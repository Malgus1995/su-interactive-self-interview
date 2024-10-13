import { Layer } from "@rpgjs/tiled";
import TileMap from './index.js';
import { Container } from "pixi.js";
export declare class CommonLayer extends Container {
    protected layer: Layer;
    protected map: TileMap;
    z: number;
    constructor(layer: Layer, map: TileMap);
    applyProperties(): void;
}
