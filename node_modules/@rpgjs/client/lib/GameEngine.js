import { RpgCommonGame, RpgCommonPlayer, GameSide, RpgShape } from "@rpgjs/common";
import { BehaviorSubject, combineLatest, Subject, map } from "rxjs";
export class GameEngineClient extends RpgCommonGame {
    constructor() {
        super(...arguments);
        this._objects = new BehaviorSubject({});
        this._obsObjects = {};
        this._obsObjectsDeleteNotifier$ = {};
        this._shapes = new BehaviorSubject({});
        this._objectsChanged = new BehaviorSubject({});
        this.world = {
            getObjects: this.getObjects.bind(this),
            getObject: (id) => {
                const obj = this.getObject(id);
                if (!obj)
                    return null;
                return obj.object;
            },
            getShape: (id) => {
                const obj = this.getShape(id);
                if (!obj)
                    return null;
                return obj.object;
            },
            getAll: (id) => {
                const obj = this.getObjectAndShape(id);
                if (!obj)
                    return null;
                return obj.object;
            },
            removeObject: this.removeObject.bind(this),
            getObjectsOfGroup: () => {
                return {
                    ...this.getObjects(),
                    ...this.events
                };
            },
            getShapesOfGroup: () => {
                return this.getShapes();
            }
        };
    }
    initialize() {
        super.initialize(GameSide.Client);
    }
    _get(prop, id) {
        const objects = this[prop].value;
        const val = objects[id];
        if (!val)
            return null;
        return val;
    }
    get objectsChanged() {
        return this._objectsChanged.asObservable();
    }
    setObjectsChanged(val) {
        this._objectsChanged.next(val);
    }
    listenObject(id) {
        return this._obsObjects[id].asObservable();
    }
    get objects() {
        return this._objects.asObservable();
    }
    get shapes() {
        return this._shapes.asObservable();
    }
    get all() {
        return combineLatest([
            this.objects,
            this.shapes
        ]).pipe(map(([objects, shapes]) => {
            return {
                ...objects,
                ...shapes
            };
        }));
    }
    getShapes() {
        return this._shapes.value;
    }
    getObjects() {
        return this._objects.value;
    }
    getObject(id) {
        return this._get('_objects', id);
    }
    getShape(id) {
        return this._get('_shapes', id);
    }
    getObjectAndShape(id) {
        let obj = this.getObject(id);
        if (!obj)
            obj = this.getShape(id);
        return obj;
    }
    resetObjects() {
        for (let id in this._obsObjectsDeleteNotifier$) {
            this._obsObjectsDeleteNotifier$[id].next();
            this._obsObjectsDeleteNotifier$[id].complete();
            this._obsObjects[id].complete();
        }
        this._obsObjectsDeleteNotifier$ = {};
        this._obsObjects = {};
        this._objects.next({});
        this._shapes.next({});
    }
    getDeleteNotifier(id) {
        return this._obsObjectsDeleteNotifier$[id].asObservable();
    }
    _remove(prop, id) {
        const logic = prop == '_objects' ? this.getObject(id) : this.getShape(id);
        if (logic) {
            const objects = { ...this[prop].value }; // clone
            delete objects[id];
            this._obsObjectsDeleteNotifier$[id].next();
            this._obsObjectsDeleteNotifier$[id].complete();
            this._obsObjects[id].complete();
            delete this._obsObjects[id];
            delete this._obsObjectsDeleteNotifier$[id];
            this[prop].next(objects);
            return true;
        }
        return false;
    }
    removeObject(id) {
        if (this.events[id]) {
            delete this.events[id];
        }
        return this._remove('_objects', id);
    }
    removeShape(id) {
        return this._remove('_shapes', id);
    }
    removeObjectAndShape(id) {
        let bool = this.removeObject(id);
        if (!bool)
            bool = this.removeShape(id);
        return bool;
    }
    static toArray(obj, prop) {
        if (obj[prop])
            obj[prop] = Object.values(obj[prop]);
    }
    updateObject(obj) {
        const { playerId: id, params, localEvent, paramsChanged, isShape } = obj;
        if (paramsChanged.components) {
            paramsChanged.layout = {
                center: {
                    lines: [
                        {
                            col: paramsChanged.components
                        }
                    ]
                }
            };
        }
        const layoutToArray = (params) => {
            const layout = params.layout;
            if (layout) {
                ['center', 'top', 'right', 'bottom', 'left'].forEach((key) => {
                    if (!layout[key])
                        return;
                    GameEngineClient.toArray(layout[key], 'lines');
                    if (!layout[key].lines)
                        return;
                    layout[key].lines.map(layout => {
                        GameEngineClient.toArray(layout, 'col');
                    });
                });
            }
        };
        layoutToArray(params);
        GameEngineClient.toArray(params, 'polygon');
        const isMe = () => id == this.playerId;
        let logic;
        let teleported = false;
        let propName = '_objects';
        const createObsForObject = (data) => {
            this._obsObjectsDeleteNotifier$[id] = new Subject();
            this._obsObjects[id] = new BehaviorSubject(data);
        };
        if (isShape) {
            propName = '_shapes';
            logic = this.world.getShape(id);
            if (!logic) {
                logic = this.addShape(params);
                createObsForObject({ logic });
            }
        }
        else {
            if (localEvent) {
                logic = this.events[id];
                if (!logic) {
                    logic = this.addEvent(RpgCommonPlayer, id);
                    createObsForObject({ logic });
                    this.events[id] = {
                        object: logic
                    };
                }
                else {
                    logic = logic.object;
                }
            }
            else {
                logic = this.world.getObject(id);
            }
            if (!logic) {
                logic = this.addPlayer(RpgCommonPlayer, id);
                createObsForObject({ logic });
            }
        }
        logic.prevParamsChanged = Object.assign({}, logic);
        for (let key in params) {
            if (!localEvent &&
                (key == 'position' ||
                    (key == 'direction' && paramsChanged && paramsChanged.position))) {
                if (isMe() && logic.canMove)
                    continue;
            }
            logic[key] = params[key];
        }
        if (paramsChanged) {
            layoutToArray(paramsChanged);
            if (paramsChanged.layout)
                logic.componentChanged = paramsChanged.layout;
            if (paramsChanged.teleported) {
                teleported = true;
                logic.position = { ...params.position }; // clone
                logic.direction = params.direction;
            }
            if (!logic.paramsChanged)
                logic.paramsChanged = {};
            logic.paramsChanged = paramsChanged;
        }
        const newObject = {
            object: logic,
            paramsChanged
        };
        this.setObject(id, newObject);
        return newObject;
    }
    setObject(id, newObject) {
        const propName = newObject.object instanceof RpgShape ? '_shapes' : '_objects';
        this[propName].next({
            ...this[propName].value,
            ...{
                [id]: newObject
            }
        });
        this._obsObjects[id].next(newObject);
    }
}
//# sourceMappingURL=GameEngine.js.map