import { RpgCommonMap, RpgPlugin, HookClient, Utils, RpgCommonPlayer } from '@rpgjs/common';
import TileMap from '../Tilemap/index.js';
import * as _PixiViewport from 'pixi-viewport';
import { Scene } from './Scene.js';
import { spritesheets } from '../Sprite/Spritesheets.js';
import { RpgSound } from '../Sound/RpgSound.js';
import { TiledLayerType } from '@rpgjs/tiled';
import { RpgComponent } from '../Components/Component.js';
import { Assets, Container, Point } from 'pixi.js';
import { EventLayer } from './EventLayer.js';
// The export was made in this way to ensure compatibility with unit tests (https://github.com/RSamaium/RPG-JS/issues/240)
const { Viewport: PixiViewport } = _PixiViewport;
class SceneMap extends Scene {
    constructor(context, renderer, options = {}) {
        super(context);
        this.context = context;
        this.renderer = renderer;
        this.options = options;
        this.players = {};
        this.isLoaded = false;
        this.eventsLayers = {};
        this.shapes = {};
        if (options.drawMap === undefined)
            this.options.drawMap = true;
        this.onInit();
    }
    constructMethods() {
        [
            'getTileIndex',
            'getTileByIndex',
            'getTileOriginPosition',
            'getTileByPosition',
            'getLayerByName'
        ].forEach(method => this[method] = this.gameMap[method].bind(this.gameMap));
        [
            'heightPx',
            'widthPx',
            'zTileHeight',
            'tileHeight',
            'tileWidth',
            'data',
            'layers'
        ].forEach(prop => this[prop] = this.gameMap[prop]);
    }
    /** @internal */
    async load(obj, prevObj, isUpdate = false) {
        let { sounds } = obj;
        const { clientEngine } = this.game;
        if (sounds) {
            if (!Utils.isArray(sounds))
                sounds = obj.sounds = [sounds];
        }
        this.gameMap = new RpgCommonMap();
        this.gameMap.load(obj);
        this.gameMap.clearCacheTilesets();
        this.constructMethods();
        RpgCommonMap.bufferClient.set(obj.id, this.gameMap);
        this.tilemap = new TileMap(this.context, this.gameMap.getData());
        // TODO: Remove this
        Assets.reset();
        let nbLoad = 0;
        const objects = this.game.world.getObjectsOfGroup();
        for (let { object } of Object.values(objects)) {
            if (Utils.isInstanceOf(object, RpgCommonPlayer) && object) {
                object.updateInVirtualGrid();
            }
        }
        const assets = [];
        for (let tileset of this.tilemap.tilesets) {
            let spritesheet = spritesheets.get(tileset.name);
            if (!spritesheet) {
                clientEngine.addSpriteSheet(tileset.image.source, tileset.name);
                spritesheet = spritesheets.get(tileset.name);
            }
            if (spritesheet?.resource) {
                continue;
            }
            Assets.add(tileset.name, spritesheet.image);
            assets.push(tileset.name);
            nbLoad++;
        }
        if (nbLoad > 0) {
            const assetsLoaded = await Assets.load(assets);
            for (let assetName in assetsLoaded) {
                const spritesheet = spritesheets.get(assetName);
                if (spritesheet)
                    spritesheet.resource = assetsLoaded[assetName];
            }
        }
        RpgPlugin.emit(HookClient.SceneMapLoading, Assets);
        this.tilemap.load({
            drawTiles: this.options.drawMap,
            isUpdate
        });
        this.viewport = new PixiViewport({
            screenWidth: this.options.screenWidth,
            screenHeight: this.options.screenHeight,
            worldWidth: obj.width * obj.tilewidth,
            worldHeight: obj.height * obj.tileheight,
            noTicker: true,
            events: this.renderer.events
        });
        this.tilemap.addChild(this.animationLayer);
        this.viewport.clamp({ direction: 'all' });
        this.viewport.addChild(this.tilemap, ...this.createEventLayers(obj));
        this.isLoaded = true;
        if (prevObj.sounds && prevObj.sounds instanceof Array) {
            prevObj.sounds.forEach(soundId => {
                const continueSound = (obj.sounds || []).find(id => id == soundId);
                if (!continueSound)
                    RpgSound.stop(soundId);
            });
        }
        if (sounds)
            sounds.forEach(soundId => RpgSound.play(soundId));
        if (this.onLoad)
            this.onLoad();
        return this.viewport;
    }
    createEventLayers(map) {
        const containers = [];
        map.layers.forEach((layerData) => {
            if (layerData.type !== TiledLayerType.ObjectGroup)
                return;
            if (this.eventsLayers[layerData.name]) {
                containers.push(this.eventsLayers[layerData.name]);
                return;
            }
            const layer = new EventLayer();
            this.defaultLayer = this.eventsLayers[layerData.name] = layer;
            containers.push(layer);
        });
        if (containers.length == 0) {
            if (!this.defaultLayer) {
                this.defaultLayer = new EventLayer();
            }
            containers.push(this.defaultLayer);
        }
        this.cameraFollowSprite(this.game.playerId);
        return containers;
    }
    getEventLayer(objectName) {
        for (let layerData of this.data.layers) {
            if (layerData.type != TiledLayerType.ObjectGroup) {
                continue;
            }
            if (!layerData.objects) {
                continue;
            }
            for (let object of layerData.objects) {
                if (object.name == objectName) {
                    return this.eventsLayers[layerData.name];
                }
            }
        }
        return this.defaultLayer;
    }
    /** @internal */
    changeTile(x, y, layers) {
        for (let layerName in layers) {
            const layerInfo = layers[layerName];
            this.gameMap?.setTile(x, y, layerName, layerInfo);
            this.tilemap.changeTile(x, y, layerName);
        }
    }
    /** @internal */
    draw(t, deltaTime, deltaRatio, frame) {
        if (!this.isLoaded) {
            return;
        }
        super.draw(t, deltaTime, deltaRatio, frame);
        this.tilemap.drawAnimateTile(frame);
        this.viewport?.update(deltaTime);
    }
    // @internal
    updateTilesOverlayAllSprites() {
        const objects = this.objects;
        for (let [id, sprite] of objects) {
            this.updateTilesOverlay(sprite);
        }
    }
    updateTilesOverlay(sprite) {
        if (!this.gameMap)
            return sprite;
        const { tileWidth, tileHeight } = this.gameMap;
        const { tilesOverlay } = sprite;
        const bounds = sprite.parent.getLocalBounds();
        const width = Math.ceil(bounds.width / tileWidth) * tileWidth;
        const height = Math.ceil(bounds.height / tileHeight) * tileHeight;
        const _x = bounds.x;
        const _y = bounds.y;
        const addTile = (x, y) => {
            const tiles = this.tilemap.createOverlayTiles(x, y, sprite);
            if (tiles.length)
                tilesOverlay.addChild(...tiles);
        };
        tilesOverlay.removeChildren();
        for (let i = _x; i <= _x + width; i += tileWidth) {
            for (let j = _y; j <= _y + height; j += tileHeight) {
                addTile(i, j);
            }
        }
        return sprite;
    }
    onUpdateObject(logic, sprite, moving) {
        const { paramsChanged } = logic;
        if (!this.gameMap)
            return sprite;
        if (moving || (paramsChanged && (paramsChanged.width || paramsChanged.height))) {
            this.updateTilesOverlay(sprite);
        }
        return sprite;
    }
    /** @internal */
    setPlayerPosition(id, { x, y }) {
        this.players[id].x = x;
        this.players[id].y = y;
    }
    /** @internal */
    updateScene(obj) { }
    addObject(obj, id) {
        const wrapper = new Container();
        const inner = new Container();
        const tilesOverlay = new Container();
        const component = new RpgComponent(obj, this);
        component.tilesOverlay = tilesOverlay;
        inner.addChild(component);
        wrapper.addChild(inner, tilesOverlay);
        this.objects.set(id, component);
        this.getEventLayer(obj.id)?.addChild(wrapper);
        if (component.isCurrentPlayer)
            this.cameraFollowSprite(id);
        component.onInit();
        return component;
    }
    removeObject(id) {
        let sprite = this.objects.get(id);
        if (sprite) {
            if (!sprite.animationIsPlaying) {
                this.objects.delete(id);
                RpgPlugin.emit(HookClient.SceneRemoveSprite, [this, sprite], true);
                RpgPlugin.emit(HookClient.RemoveSprite, sprite);
                sprite.destroy();
            }
            else {
                sprite.visible = false;
            }
        }
    }
    getShape(name) {
        return this.game.getShape(name)?.object;
    }
    getShapes() {
        const shapes = Object.values(this.game.getShapes());
        return shapes.map(shape => shape.object);
    }
    cameraFollowSprite(id, options = {}) {
        const sprite = this.getSprite(id);
        const follow = () => {
            if (sprite)
                this.viewport?.follow(sprite);
        };
        if (options.smoothMove) {
            this.viewport?.plugins.remove('follow');
            let moreOptions = {};
            if (typeof options.smoothMove != 'boolean') {
                moreOptions = options.smoothMove;
            }
            this.viewport?.animate({
                position: new Point(sprite?.x, sprite?.y),
                ...moreOptions,
                callbackOnComplete: follow
            });
        }
        else {
            follow();
        }
    }
    /**
     * Listen to the events of the smile on the stage
     *
     * @title Listen mouse event
     * @method on(eventName,callback)
     * @since 3.0.0-beta.4
     * @param {string} eventName  Name of the event (see PIXI documentation). Name often used in the codes
     * - click
     * - mousedown
     * - mouseup
     * - mousemove
     * - pointerdown
     * - pointermove
     * - pointerup
     * - (etc...)
     * @param {(position: { x: number, y: number }, ev?: PIXI.InteractionEvent ) => any} callback
     * @example
     * ```ts
     * sceneMap.on('pointerdown', (position) => {
     *      console.log(position)
     * })
     * ```
     * @returns {void}
     * @memberof RpgSceneMap
     */
    on(eventName, cb) {
        if (!this.viewport)
            return;
        this.viewport.eventMode = 'static';
        this.viewport.on(eventName, (...args) => {
            const ev = args[0];
            const pos = ev.getLocalPosition(this.viewport);
            if (ev.defaultPrevented)
                return;
            cb(pos, ev);
        });
    }
}
SceneMap.EVENTS_LAYER_DEFAULT = 'events-layer-default';
export { SceneMap };
//# sourceMappingURL=Map.js.map