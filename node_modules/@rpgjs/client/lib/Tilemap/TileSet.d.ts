import { TiledTileset, Tileset as TiledTilesetClass } from '@rpgjs/tiled';
import { Texture } from 'pixi.js';
export default class TileSet extends TiledTilesetClass {
    private baseTexture;
    textures: Texture[];
    constructor(tileSet: TiledTileset);
}
