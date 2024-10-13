import { AbstractComponent, CellInfo } from "./AbstractComponent.js";
import { ShapeComponentObject } from "@rpgjs/types";
import { Graphics } from "pixi.js";
export declare class ShapeComponent extends AbstractComponent<ShapeComponentObject, Graphics> {
    static readonly id: string;
    private type;
    private container;
    cacheParams: string[];
    onInit(cell: CellInfo): void;
    updateRender(object: any): void;
}
