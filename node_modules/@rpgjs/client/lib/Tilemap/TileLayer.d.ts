import { Layer, Tile as TileClass } from '@rpgjs/tiled';
import TileSet from './TileSet.js';
import TileMap from './index.js';
import { CommonLayer } from './CommonLayer.js';
export default class TileLayer extends CommonLayer {
    private tileSets;
    private tilemap;
    private _tiles;
    tiles: (TileClass | null)[];
    static findTileSet(gid: number, tileSets: TileSet[]): TileSet | undefined;
    constructor(layer: Layer, tileSets: TileSet[], map: TileMap);
    private addFrame;
}
