import { createRoot } from 'react-dom/client';
import { createElement, useState, createContext, useEffect, useContext, useSyncExternalStore, useRef } from 'react';
import { EVENTS_MAP, RpgRenderer } from '../Renderer.js';
import { BehaviorSubject, map, tap } from 'rxjs';
import { inject } from '../inject.js';
import { RpgPlugin } from '@rpgjs/common';
export { useStore } from '@nanostores/react';
export const RpgReactContext = createContext({});
// TODO
export const useObjects = () => {
    const [objects, setObjects] = useState([]);
    const { rpgObjects } = useContext(RpgReactContext);
    useEffect(() => {
        rpgObjects
            .pipe(map((objects) => Object.values(objects).map((obj) => obj.object)))
            .subscribe(setObjects);
    }, []);
    return objects;
};
// TODO
export const useCurrentPlayer = () => {
    const { rpgCurrentPlayer } = useContext(RpgReactContext);
    const currentPlayerRef = useRef({});
    let _onChanges;
    const subscribe = (onChanges) => {
        _onChanges = onChanges;
        return () => {
            _onChanges = null;
        };
    };
    useEffect(() => {
        const ob$ = rpgCurrentPlayer
            .pipe(map((player) => player.object), tap((player) => currentPlayerRef.current = player));
        const subscription = ob$.subscribe(() => {
            _onChanges?.();
        });
        return () => subscription.unsubscribe();
    }, []);
    return useSyncExternalStore(subscribe, () => currentPlayerRef.current);
};
export const useEventPropagator = () => {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current) {
            const element = ref.current;
            const eventListeners = {};
            const renderer = inject(RpgRenderer);
            EVENTS_MAP.MouseEvent.forEach(eventType => {
                const listener = event => renderer.propagateEvent(event);
                element.addEventListener(eventType, listener);
                eventListeners[eventType] = listener;
            });
            return () => {
                EVENTS_MAP.MouseEvent.forEach(eventType => {
                    element.removeEventListener(eventType, eventListeners[eventType]);
                });
            };
        }
    }, [ref]);
    return ref;
};
export class ReactGui {
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
                    parentGui.listenTooltipObjects.subscribe(setTooltip);
                    // force combineLatest to emit first value
                    parentGui.currentScene?.objectsMoving.next({});
                }, [parentGui.currentScene]);
                return parentGui.tooltipFilter(_tooltip).map(sprite => createElement('div', {
                    style: parentGui.tooltipPosition({ x: sprite.position.x, y: sprite.position.y }),
                    key: sprite.id,
                }, createElement(ui.gui, {
                    spriteData: sprite,
                    ...(ui.data || {}),
                })));
            };
        };
        const GuiWrapper = () => {
            const [_gui, setGui] = useState([]);
            useEffect(() => {
                this._gui.subscribe(gui => setGui(gui));
            }, []);
            return createElement(RpgReactContext.Provider, {
                value: parentGui.getInjectObject()
            }, ..._gui.filter(ui => ui.display && !ui.attachToSprite).map(ui => createElement('div', {
                key: ui.name,
                style: { 'pointerEvents': 'auto' },
            }, createElement(ui.gui, ui.data || {}))), ..._gui.filter(ui => ui.display && ui.attachToSprite).map(ui => createElement('div', {
                key: ui.name,
                style: { 'pointerEvents': 'auto' },
            }, createElement(GuiTooltip(ui)))));
        };
        this.app.render(createElement(GuiWrapper));
    }
    set gui(val) {
        let array = [];
        for (let key in val) {
            // ignore vuejs component
            if (!val[key].isFunction)
                continue;
            array.push(val[key]);
        }
        this._gui.next(array);
    }
}
export function RpgGame({ onReady, modules }) {
    const divRef = useRef(null);
    useEffect(() => {
        let client, server;
        // @ts-ignore
        const engine = window.RpgStandalone;
        engine(modules).then((val) => {
            if (val.client) {
                client = val.client;
                server = val.server;
            }
            else {
                client = val;
                server = null;
            }
            onReady?.({
                client,
                server
            });
        });
        return () => {
            server?.world.clear();
            client.reset();
            RpgPlugin.clear();
            server?.io.clear();
            server?.io.events.clear();
            server?.stop();
            if (divRef.current)
                divRef.current.innerHTML = '';
        };
    }, [modules]);
    return createElement('div', { id: 'rpg', ref: divRef });
}
//# sourceMappingURL=React.js.map