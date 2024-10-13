import { Container } from "pixi.js";
import { ImageComponentObject } from "@rpgjs/types";
import { AbstractComponent, CellInfo } from "./AbstractComponent.js";
export declare class ImageComponent extends AbstractComponent<ImageComponentObject, Container> {
    static readonly id: string;
    cacheParams: string[];
    source: string;
    onInit(cell: CellInfo): void;
    private setImage;
    updateRender(object: any): void;
}
