import { Utils } from '@rpgjs/common';
import ImageLayer from './ImageLayer.js';
import TileLayer from './TileLayer.js';
import TileSet from './TileSet.js';
import { log } from '../Logger.js';
import { TiledLayerType } from '@rpgjs/tiled';
import { RpgRenderer } from '../Renderer.js';
import { Container, Graphics } from 'pixi.js';
const { intersection } = Utils;
export default class TileMap extends Container {
    constructor(context, data) {
        super();
        this.context = context;
        this.data = data;
        this.background = new Graphics();
        this.tilewidth = 0;
        this.tileheight = 0;
        this.frameRateAnimation = 10;
        this.tilesets = [];
        this.layers = {};
        this.tilesLayer = new Container();
        this.frameTile = 0;
        this.renderer = this.context.inject(RpgRenderer);
        this.x = 0;
        this.y = 0;
        this.create(data);
    }
    /** @internal */
    drawAnimateTile(frame) {
        if (frame % this.frameRateAnimation == 0) {
            this.renderer['renderer'].plugins.tilemap.tileAnim[0] = this.frameTile;
            this.frameTile++;
        }
    }
    getData() {
        return this.data;
    }
    setBackgroundColor(color) {
        color = color.replace('#', '');
        this.background.beginFill(parseInt(color, 16));
        this.background.drawRect(0, 0, (this.width || 0) * (this.tilewidth || 0), (this.height || 0) * (this.tileheight || 0));
        this.background.endFill();
    }
    create(data) {
        this.data = data;
        Object.assign(this, data);
        if (this.data.backgroundcolor)
            this.setBackgroundColor(this.data.backgroundcolor);
        this.addChild(this.background);
        this.tilesets = this.data.tilesets.map((tileSet) => {
            return new TileSet(tileSet);
        });
    }
    /** @internal */
    createOverlayTiles(x, y, instance) {
        const tilesLayer = [];
        this.data.layers.forEach((layerData) => {
            switch (layerData.type) {
                case TiledLayerType.Tile: {
                    const tileLayer = new TileLayer(layerData, this.tilesets, this);
                    const tile = tileLayer.createTile(x, y, {
                        real: true,
                        filter: (tile) => {
                            const { data, y: yObject, z: zObject } = instance;
                            const { hHitbox, height } = data;
                            const zLayer = tileLayer.z;
                            const tileHasZ = tile.properties.z !== undefined;
                            let { z } = tile.properties;
                            if (zLayer !== undefined) {
                                z = zLayer + (z !== undefined ? z : 0);
                            }
                            if (z == undefined)
                                return false;
                            const realZ = z * tile.height;
                            if (zObject + height < realZ) {
                                return true;
                            }
                            // player is on a tile but the player has a high z
                            if (zObject > realZ + tile.height) {
                                return false;
                            }
                            if (!tileHasZ)
                                return false;
                            // is front of tile
                            if (yObject + hHitbox > tile.y + tile.height) {
                                // if (yObject - tile.y >= height) {
                                //     return false
                                // }
                                // Always get tile.height for height. TODO: Fix this the height of the character.  To be seen according to future implementations...
                                // Discussion: https://community.rpgjs.dev/d/250-rpgjs-v420/6
                                const zIntersection = intersection([zObject, zObject + tile.height /** Old code: height */], [realZ, realZ + tile.height]);
                                if (!zIntersection) {
                                    return true;
                                }
                                return false;
                            }
                            return true;
                        }
                    });
                    if (tile) {
                        tileLayer.addChild(tile);
                        const size = tile.animations.length;
                        if (size > 0) {
                            const ms = 1000 / 60;
                            tile.animationSpeed = ms / (ms * this.frameRateAnimation);
                            let frameIndex = this.frameTile % size;
                            tile.gotoAndPlay(frameIndex);
                        }
                        tilesLayer.push(tileLayer);
                    }
                    break;
                }
            }
        });
        return tilesLayer;
    }
    /** @internal */
    changeTile(x, y, layerName) {
        const layer = this.layers[layerName];
        if (!layer)
            throw log(`${layerName} not exists`);
        if (layer instanceof TileLayer) {
            layer.changeTile(x, y);
        }
    }
    /** @internal */
    load(options) {
        this.tilesLayer.removeChildren();
        this.tilesets.forEach(tileset => tileset.load());
        this.data.layers.forEach((layerData) => {
            switch (layerData.type) {
                case TiledLayerType.Tile: {
                    const tileLayer = new TileLayer(layerData, this.tilesets, this);
                    if (options?.drawTiles)
                        tileLayer.create();
                    this.layers[layerData.name] = tileLayer;
                    this.tilesLayer.addChild(tileLayer);
                    break;
                }
                case TiledLayerType.Image: {
                    const imageLayer = new ImageLayer(layerData, this);
                    this.layers[layerData.name] = imageLayer;
                    this.tilesLayer.addChild(imageLayer);
                    break;
                }
            }
        });
        this.addChild(this.tilesLayer);
    }
}
//# sourceMappingURL=index.js.map