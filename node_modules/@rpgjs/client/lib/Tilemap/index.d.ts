import { InjectContext } from '@rpgjs/common';
import ImageLayer from './ImageLayer.js';
import TileLayer from './TileLayer.js';
import TileSet from './TileSet.js';
import { TiledMap, Layer } from '@rpgjs/tiled';
import { Container, Graphics } from 'pixi.js';
export interface MapInfo extends TiledMap {
    layers: Layer[];
}
export default class TileMap extends Container {
    private context;
    private data;
    background: Graphics;
    tilewidth: number;
    tileheight: number;
    private frameRateAnimation;
    tilesets: TileSet[];
    layers: {
        [layerName: string]: TileLayer | ImageLayer;
    };
    private tilesLayer;
    private frameTile;
    private renderer;
    constructor(context: InjectContext, data: MapInfo);
    getData(): MapInfo;
    setBackgroundColor(color: string): void;
    private create;
}
