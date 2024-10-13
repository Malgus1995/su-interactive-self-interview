import { TileComponentObject } from "@rpgjs/types";
import { AbstractComponent, CellInfo } from "./AbstractComponent.js";
import { Container } from "pixi.js";
export declare class TileComponent extends AbstractComponent<TileComponentObject, Container> {
    static readonly id: string;
    cacheParams: string[];
    gid: number;
    onInit(cell: CellInfo): void;
    updateRender(object: any): void;
}
