import { Texture, AnimatedSprite } from "pixi.js";
import TileSet from "./TileSet.js";
import { Tile as TiledTileClass } from '@rpgjs/tiled';
import { CompositeTilemap } from "@pixi/tilemap";
export default class Tile extends AnimatedSprite {
    private tile;
    private tileSet;
    static getTextures(tile: TiledTileClass, tileSet: TileSet): Texture<import("pixi.js").Resource>[];
    animations: {
        tileid: number;
        duration: number;
    }[];
    _x: number;
    _y: number;
    pointsBufIndex: number;
    properties: any;
    constructor(tile: TiledTileClass, tileSet: TileSet);
    get gid(): number;
    setAnimation(frame: CompositeTilemap): void;
    flip(): void;
}
