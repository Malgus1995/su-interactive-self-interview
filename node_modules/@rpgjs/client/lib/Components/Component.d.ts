import { Direction, RpgCommonPlayer, RpgShape } from "@rpgjs/common";
import { LayoutPositionEnum, PositionXY } from "@rpgjs/types";
import { Scene } from "../Scene/Scene.js";
import { Container } from "pixi.js";
export interface IComponent {
    id: string;
    value: any;
}
export declare class RpgComponent<T = any> extends Container {
    private data;
    private scene;
    animationIsPlaying: boolean;
    protected _x: number;
    protected _y: number;
    private _rotation;
    protected teleported: number;
    protected map: string;
    protected z: number;
    protected fixed: boolean;
    private components;
    private direction;
    private container;
    private containersLayout;
    private subscriptionGraphic;
    private layoutNotifierClear;
    private registerComponents;
    private dragMode?;
    readonly game: import("../GameEngine.js").GameEngineClient;
    readonly id: string;
    constructor(data: RpgCommonPlayer | RpgShape, scene: Scene);
    /**
     * the direction of the sprite
     *
     * @prop {Direction} dir
     * @readonly
     * @memberof RpgSprite
     * */
    get dir(): Direction;
    /**
    * To know if the sprite is a player
    *
    * @prop {boolean} isPlayer
    * @readonly
    * @memberof RpgSprite
    * */
    get isPlayer(): boolean;
    /**
     * To know if the sprite is an event
     *
     * @prop {boolean} isEvent
     * @readonly
     * @memberof RpgSprite
     * */
    get isEvent(): boolean;
    /**
     * To know if the sprite is a shape
     *
     * @prop {boolean} isShape
     * @since 3.0.0-rc
     * @readonly
     * @memberof RpgSprite
     * */
    get isShape(): boolean;
    /**
     * To know if the sprite is the sprite controlled by the player
     *
     * @prop {boolean} isCurrentPlayer
     * @readonly
     * @memberof RpgSprite
     * */
    get isCurrentPlayer(): boolean;
    /**
     * Retrieves the logic of the sprite
     *
     * @prop {RpgSpriteLogic} logic
     * @readonly
     * @since 3.0.0-beta.4
     * @memberof RpgSprite
     * */
    get logic(): RpgCommonPlayer | RpgShape | null;
    get guiDisplay(): boolean;
    set guiDisplay(val: boolean);
    setPosition(smooth?: boolean): void;
    update(obj: any, objChanged: any, time: number, deltaRatio: number): {
        moving: boolean;
    };
    showAnimation(graphic: string | string[], animationName: string): void;
    /**
    * Recover the position according to the graphic
    * Normally, the position is that of the hitbox but, we retrieve the top left corner of the graphic
    *
    * You can also pass the `middle` value as first parameter to retrieve the positions from the middle of the sprite
    *
    * @title Get Positions of Graphic
    * @method sprite.getPositionsOfGraphic(align)
    * @param {string} [align] middle
    * @returns { x: number, y: number }
    * @memberof RpgSprite
    */
    getPositionsOfGraphic(align: string): PositionXY;
    /**
     * Get the container by position (center, left, right, top, bottom)
     *
     * @param {LayoutPositionEnum} [position=center]
     * @returns {PIXI.Container}
     *
     * */
    getLayoutContainer(position?: LayoutPositionEnum): Container;
    /**
     * Get Current Scene. Scene is a map, battle, menu, etc.
     * @returns {T}
     */
    getScene<T>(): T;
    onInit(): void;
    onUpdate(obj: any): void;
    onMove(): void;
    onChanges(data: any, old: any): void;
    private callMethodInComponents;
    private createGrid;
    private applyComponent;
    private createComponentCenter;
    private refreshComponents;
    private updateComponents;
}
