import require$$0 from "react-dom";
import { useCallback, useSyncExternalStore, createContext, useState, useContext, useEffect, useRef, createElement } from "react";
import { i as inject, R as RpgRenderer, E as EVENTS_MAP } from "./index-ba657126.js";
import { map, tap, BehaviorSubject } from "rxjs";
import { RpgPlugin } from "@rpgjs/common";
import "vue";
var createRoot;
var m = require$$0;
if ({}.NODE_ENV === "production") {
  createRoot = m.createRoot;
  m.hydrateRoot;
} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}
function listenKeys(store, keys, listener) {
  let keysSet = /* @__PURE__ */ new Set([...keys, void 0]);
  return store.listen((value, changed) => {
    if (keysSet.has(changed)) {
      listener(value, changed);
    }
  });
}
function useStore(store, opts = {}) {
  let subscribe = useCallback(
    (onChange) => opts.keys ? listenKeys(store, opts.keys, onChange) : store.listen(onChange),
    [opts.keys, store]
  );
  let get = store.get.bind(store);
  return useSyncExternalStore(subscribe, get, get);
}
const RpgReactContext = createContext({});
const useObjects = () => {
  const [objects, setObjects] = useState([]);
  const {
    rpgObjects
  } = useContext(RpgReactContext);
  useEffect(() => {
    rpgObjects.pipe(map((objects2) => Object.values(objects2).map((obj) => obj.object))).subscribe(setObjects);
  }, []);
  return objects;
};
const useCurrentPlayer = () => {
  const {
    rpgCurrentPlayer
  } = useContext(RpgReactContext);
  const currentPlayerRef = useRef({});
  let _onChanges;
  const subscribe = (onChanges) => {
    _onChanges = onChanges;
    return () => {
      _onChanges = null;
    };
  };
  useEffect(() => {
    const ob$ = rpgCurrentPlayer.pipe(map((player) => player.object), tap((player) => currentPlayerRef.current = player));
    const subscription = ob$.subscribe(() => {
      _onChanges == null ? void 0 : _onChanges();
    });
    return () => subscription.unsubscribe();
  }, []);
  return useSyncExternalStore(subscribe, () => currentPlayerRef.current);
};
const useEventPropagator = () => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      const element = ref.current;
      const eventListeners = {};
      const renderer = inject(RpgRenderer);
      EVENTS_MAP.MouseEvent.forEach((eventType) => {
        const listener = (event) => renderer.propagateEvent(event);
        element.addEventListener(eventType, listener);
        eventListeners[eventType] = listener;
      });
      return () => {
        EVENTS_MAP.MouseEvent.forEach((eventType) => {
          element.removeEventListener(eventType, eventListeners[eventType]);
        });
      };
    }
  }, [ref]);
  return ref;
};
class ReactGui {
  //private _tooltips: BehaviorSubject<any[]> = new BehaviorSubject([] as any)
  constructor(rootEl, parentGui) {
    this._gui = new BehaviorSubject([]);
    this.app = createRoot(rootEl);
    this.clientEngine = parentGui.clientEngine;
    this.renderer = this.clientEngine.renderer;
    const GuiTooltip = (ui) => {
      return () => {
        const [_tooltip, setTooltip] = useState([]);
        useEffect(() => {
          var _a;
          parentGui.listenTooltipObjects.subscribe(setTooltip);
          (_a = parentGui.currentScene) == null ? void 0 : _a.objectsMoving.next({});
        }, [parentGui.currentScene]);
        return parentGui.tooltipFilter(_tooltip).map((sprite) => createElement("div", {
          style: parentGui.tooltipPosition({
            x: sprite.position.x,
            y: sprite.position.y
          }),
          key: sprite.id
        }, createElement(ui.gui, {
          spriteData: sprite,
          ...ui.data || {}
        })));
      };
    };
    const GuiWrapper = () => {
      const [_gui, setGui] = useState([]);
      useEffect(() => {
        this._gui.subscribe((gui) => setGui(gui));
      }, []);
      return createElement(RpgReactContext.Provider, {
        value: parentGui.getInjectObject()
      }, ..._gui.filter((ui) => ui.display && !ui.attachToSprite).map((ui) => createElement("div", {
        key: ui.name,
        style: {
          "pointerEvents": "auto"
        }
      }, createElement(ui.gui, ui.data || {}))), ..._gui.filter((ui) => ui.display && ui.attachToSprite).map((ui) => createElement("div", {
        key: ui.name,
        style: {
          "pointerEvents": "auto"
        }
      }, createElement(GuiTooltip(ui)))));
    };
    this.app.render(createElement(GuiWrapper));
  }
  set gui(val) {
    let array = [];
    for (let key in val) {
      if (!val[key].isFunction)
        continue;
      array.push(val[key]);
    }
    this._gui.next(array);
  }
}
function RpgGame({
  onReady,
  modules
}) {
  const divRef = useRef(null);
  useEffect(() => {
    let client, server;
    const engine = window.RpgStandalone;
    engine(modules).then((val) => {
      if (val.client) {
        client = val.client;
        server = val.server;
      } else {
        client = val;
        server = null;
      }
      onReady == null ? void 0 : onReady({
        client,
        server
      });
    });
    return () => {
      server == null ? void 0 : server.world.clear();
      client.reset();
      RpgPlugin.clear();
      server == null ? void 0 : server.io.clear();
      server == null ? void 0 : server.io.events.clear();
      server == null ? void 0 : server.stop();
      if (divRef.current)
        divRef.current.innerHTML = "";
    };
  }, [modules]);
  return createElement("div", {
    id: "rpg",
    ref: divRef
  });
}
export {
  ReactGui,
  RpgGame,
  RpgReactContext,
  useCurrentPlayer,
  useEventPropagator,
  useObjects,
  useStore
};
