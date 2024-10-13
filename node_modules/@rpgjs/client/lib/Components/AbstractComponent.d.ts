import { ComponentObject } from "@rpgjs/types";
import { RpgComponent } from "./Component.js";
import { GameEngineClient } from "../GameEngine.js";
import { Container, Graphics, Sprite } from "pixi.js";
export type CellInfo = {
    x?: number;
    y?: number;
    width: number;
    height: number;
};
export declare abstract class AbstractComponent<TypeComponent extends ComponentObject<any>, ContainerType extends Container | Text | Sprite | Graphics> extends Container {
    protected component: RpgComponent;
    protected value: TypeComponent['value'];
    private _onRender$;
    private _onDestroy$;
    readonly onRender$: import("rxjs").Observable<AbstractComponent<TypeComponent, ContainerType>>;
    protected readonly game: GameEngineClient;
    protected firstRender: boolean;
    private style;
    private cacheText;
    protected cell?: CellInfo;
    constructor(component: RpgComponent, value: TypeComponent['value']);
    getStyle<T>(): T;
    protected parseTextAndCache(text: string): string[];
    protected replaceText(object: any, text: string): string;
    protected getValue(object: any, expression: any): any;
    private verifyParams;
    onInit(cell: CellInfo): void;
    abstract updateRender(object: any, firstRender: boolean): void;
    abstract cacheParams: string[];
    onRemove(): void;
}
