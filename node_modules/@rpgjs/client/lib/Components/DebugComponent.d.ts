import { AbstractComponent, CellInfo } from "./AbstractComponent.js";
import { DebugComponentObject } from "@rpgjs/types";
import { Graphics } from "pixi.js";
export declare class DebugComponent extends AbstractComponent<DebugComponentObject, Graphics> {
    static readonly id: string;
    color: string;
    cacheParams: string[];
    private container;
    onInit(cell: CellInfo): void;
    updateRender(object: any): void;
}
