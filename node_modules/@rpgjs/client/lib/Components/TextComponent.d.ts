import { TextComponentObject } from "@rpgjs/types";
import { Graphics, Text } from "pixi.js";
import { AbstractComponent } from "./AbstractComponent.js";
export declare class TextComponent extends AbstractComponent<TextComponentObject, Text> {
    static readonly id: string;
    cacheParams: string[];
    private container;
    private originValue;
    onInit(cell: Graphics): void;
    updateRender(object: any): void;
}
