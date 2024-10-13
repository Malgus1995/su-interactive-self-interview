import { RpgCommonGame, RpgCommonPlayer, RpgShape } from "@rpgjs/common";
import { Observable } from "rxjs";
import { RpgRenderer } from "./Renderer.js";
import { RpgClientEngine } from "./RpgClientEngine.js";
import { ObjectFixture } from "@rpgjs/types";
export declare class GameEngineClient extends RpgCommonGame {
    playerId: string;
    standalone: boolean;
    clientEngine: RpgClientEngine;
    renderer: RpgRenderer;
    private _objects;
    private _obsObjects;
    private _obsObjectsDeleteNotifier$;
    private _shapes;
    private _objectsChanged;
    world: {
        getObjects: () => {
            [id: string]: ObjectFixture;
        };
        getObject: (id: string) => RpgCommonPlayer | null;
        getShape: (id: string) => RpgShape | null;
        getAll: (id: string) => RpgCommonPlayer | RpgShape | null;
        removeObject: (id: string) => boolean;
        getObjectsOfGroup: () => any;
        getShapesOfGroup: () => {
            [id: string]: ObjectFixture;
        };
    };
    initialize(): void;
    private _get;
    get objectsChanged(): Observable<{
        [id: string]: ObjectFixture;
    }>;
    setObjectsChanged(val: {
        [playerId: string]: ObjectFixture;
    }): void;
    listenObject(id: string): Observable<ObjectFixture>;
    get objects(): Observable<{
        [id: string]: ObjectFixture;
    }>;
    get shapes(): Observable<{
        [id: string]: ObjectFixture;
    }>;
    get all(): Observable<{
        [id: string]: ObjectFixture;
    }>;
    getShapes(): {
        [id: string]: ObjectFixture;
    };
    getObjects(): {
        [id: string]: ObjectFixture;
    };
    getObject(id: string): ObjectFixture | null;
    getShape(id: string): ObjectFixture | null;
    getObjectAndShape(id: string): ObjectFixture | null;
    resetObjects(): void;
    getDeleteNotifier(id: string): Observable<void>;
    private _remove;
    removeObject(id: string): boolean;
    removeShape(id: string): boolean;
    removeObjectAndShape(id: string): boolean;
    static toArray(obj: any, prop: string): void;
    updateObject(obj: any): {
        object: any;
        paramsChanged: any;
    };
    setObject(id: string, newObject: any): void;
}
