import { RpgShape, RpgCommonPlayer, InjectContext } from '@rpgjs/common';
import TileMap from '../Tilemap/index.js';
import { type Viewport } from 'pixi-viewport';
import { Scene, SceneSpriteLogic } from './Scene.js';
import { TiledMap } from '@rpgjs/tiled';
import { RpgComponent } from '../Components/Component.js';
import { type CameraOptions } from '@rpgjs/types';
import { Container, IRenderer, DisplayObjectEvents } from 'pixi.js';
interface MapObject extends TiledMap {
    id: number;
    sounds: string | string[] | undefined;
}
export declare class SceneMap extends Scene {
    protected context: InjectContext;
    private renderer;
    private options;
    static readonly EVENTS_LAYER_DEFAULT: string;
    /**
     * Get the tilemap
     *
     * @prop {PIXI.Container} [tilemap]
     * @memberof RpgSceneMap
     * */
    tilemap: TileMap;
    /**
     * The viewport of the map
     *
     * It automatically follows the sprite representing the player but you can attach it to something else
     *
     * > Do not change the size of the viewport
     *
     * @prop {PIXI.Viewport} viewport
     * @memberof RpgSceneMap
     * */
    viewport: Viewport | undefined;
    private players;
    private isLoaded;
    private gameMap;
    private eventsLayers;
    private defaultLayer;
    shapes: {};
    constructor(context: InjectContext, renderer: IRenderer, options?: {
        screenWidth?: number;
        screenHeight?: number;
        drawMap?: boolean;
    });
    private constructMethods;
    createEventLayers(map: MapObject): Container[];
    getEventLayer(objectName?: string): Container | undefined;
    private updateTilesOverlay;
    onUpdateObject(logic: SceneSpriteLogic, sprite: RpgComponent, moving: boolean): RpgComponent;
    addObject(obj: RpgCommonPlayer | RpgShape, id: string): RpgComponent;
    removeObject(id: string): void;
    cameraFollowSprite(id: string, options?: CameraOptions): void;
    /**
     * Listen to the events of the smile on the stage
     *
     * @title Listen mouse event
     * @method on(eventName,callback)
     * @since 3.0.0-beta.4
     * @param {string} eventName  Name of the event (see PIXI documentation). Name often used in the codes
     * - click
     * - mousedown
     * - mouseup
     * - mousemove
     * - pointerdown
     * - pointermove
     * - pointerup
     * - (etc...)
     * @param {(position: { x: number, y: number }, ev?: PIXI.InteractionEvent ) => any} callback
     * @example
     * ```ts
     * sceneMap.on('pointerdown', (position) => {
     *      console.log(position)
     * })
     * ```
     * @returns {void}
     * @memberof RpgSceneMap
     */
    on(eventName: keyof DisplayObjectEvents, cb: (position: {
        x: number;
        y: number;
    }, ev?: any) => any): void;
}
export interface SceneMap {
    data: any;
    tileWidth: number;
    tileHeight: number;
    layers: any[];
    widthPx: number;
    heightPx: number;
    zTileHeight: number;
    getShapes(): RpgShape[];
    getShape(name: string): RpgShape | undefined;
    getPositionByShape(filter: (shape: RpgShape) => {}): {
        x: number;
        y: number;
        z: number;
    } | null;
    getTileIndex(x: number, y: number, [z]?: [number]): number;
    getTileByIndex(tileIndex: number, zPlayer?: [number, number]): any;
    getTileOriginPosition(x: number, y: number): {
        x: number;
        y: number;
    };
    getTileByPosition(x: number, y: number, z?: [number, number]): any;
    getLayerByName(name: string): any;
}
export {};
