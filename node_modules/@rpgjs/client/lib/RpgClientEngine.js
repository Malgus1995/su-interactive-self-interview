var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { KeyboardControls } from './KeyboardControls.js';
import { RpgRenderer } from './Renderer.js';
import { _initSpritesheet, spritesheets } from './Sprite/Spritesheets.js';
import { _initSound, sounds } from './Sound/Sounds.js';
import { World } from 'simple-room-client';
import { BehaviorSubject, Subject, lastValueFrom } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { RpgGui } from './Gui/Gui.js';
import { PrebuiltGui, Utils, RpgPlugin, HookClient, RpgCommonMap, Scheduler, } from '@rpgjs/common';
import { RpgSound } from './Sound/RpgSound.js';
import { GameEngineClient } from './GameEngine.js';
import { Spritesheet } from './Sprite/Spritesheet.js';
import { log } from './Logger.js';
import { Sound } from './Sound/Sound.js';
import { PlayerType, SocketEvents, SocketMethods } from '@rpgjs/types';
import { Assets, utils } from 'pixi.js';
import * as PIXI from 'pixi.js';
const { extractId, isString } = Utils;
export class RpgClientEngine {
    constructor(context, options) {
        this.context = context;
        this.options = options;
        /**
        * retrieve the global configurations assigned at the entry point
        *
        * @prop {object} [globalConfig]
        * @readonly
        * @memberof RpgClientEngine
        * */
        this.globalConfig = {};
        this._tick = new BehaviorSubject({
            timestamp: -1,
            deltaTime: 0,
            frame: 0,
            deltaRatio: 1
        });
        this.keyChange = new Subject();
        this.roomJoin = new Subject();
        this.hasBeenDisconnected = false;
        this.serverChanging = false;
        this.isTeleported = false;
        this.lastTimestamp = 0;
        this.clientFrames = new Map();
        this.serverFrames = new Map();
        this.session = null;
        this.lastConnection = '';
        this.lastScene = '';
        this.matchMakerService = null;
        this.serverFps = 60;
        this.scheduler = new Scheduler();
        this._serverUrl = '';
        /**
         * * @deprecated Use `inject(GameEngineClient)` instead. Will be removed in v5
         */
        this.gameEngine = this.context.inject(GameEngineClient);
        /**
         * Read objects synchronized with the server
         *
         * @prop {Observable< {
                [id: string]: {
                    object: any,
                    paramsChanged: any
                }
          } >} [objects]
         * @readonly
         * @memberof RpgClientEngine
         */
        this.objects = this.gameEngine.objects;
        this.envs = {};
        this.envs = options.envs || {};
        this.tick.subscribe(({ timestamp, deltaTime }) => {
            if (timestamp != -1)
                this.step(timestamp, deltaTime);
        });
    }
    async _init() {
        this.renderer = this.context.inject(RpgRenderer);
        const pluginLoadResource = async (hookName, type) => {
            const resource = this.options[type] || [];
            this.options[type] = [
                ...Utils.arrayFlat(await RpgPlugin.emit(hookName, resource)) || [],
                ...resource
            ];
        };
        await pluginLoadResource(HookClient.AddSpriteSheet, 'spritesheets');
        await pluginLoadResource(HookClient.AddGui, 'gui');
        await pluginLoadResource(HookClient.AddSound, 'sounds');
        this.renderer.options = {
            selector: '#rpg',
            selectorCanvas: '#canvas',
            selectorGui: '#gui',
            canvas: {},
            gui: [],
            spritesheets: [],
            sounds: [],
            ...this.options
        };
        this.io = this.options.io;
        if (this.options.serverFps)
            this.serverFps = this.options.serverFps;
        this.globalConfig = this.options.globalConfig;
        this.gameEngine.standalone = this.options.standalone;
        this.gameEngine.renderer = this.renderer;
        this.gameEngine.clientEngine = this;
        this.addSpriteSheet(this.renderer.options.spritesheets);
        (this.renderer.options.sounds || []).forEach(sound => {
            const id = isString(sound) ? extractId(sound) : undefined;
            this.addSound(sound, id);
        });
        // deprecated
        if (typeof __RPGJS_PRODUCTION__ != 'undefined' && __RPGJS_PRODUCTION__) {
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/service-worker.js');
                });
            }
        }
        this.controls = this.context.inject(KeyboardControls);
    }
    addResource(resourceClass, cb) {
        let array = resourceClass;
        if (!Utils.isArray(resourceClass)) {
            array = [resourceClass];
        }
        cb(array, this);
    }
    /**
     * Listen to each frame
     *
     * @prop {Observable<{ timestamp: number, deltaTime: number, frame: number }>} tick
     * @readonly
     * @since 3.0.0-beta.5
     * @memberof RpgClientEngine
     * @example
     *
     * ```ts
     * client.tick.subscribe(({ timestamp, deltaTime, frame }) => {
     *
     * })
     * ```
     * */
    get tick() {
        return this.scheduler.tick;
    }
    addSpriteSheet(spritesheetClass, id) {
        if (typeof spritesheetClass === 'string') {
            if (!id) {
                throw log('Please, specify the resource ID (second parameter)');
            }
            let AutoSpritesheet = class AutoSpritesheet {
            };
            AutoSpritesheet = __decorate([
                Spritesheet({
                    id,
                    image: this.getResourceUrl(spritesheetClass)
                })
            ], AutoSpritesheet);
            spritesheetClass = AutoSpritesheet;
        }
        this.addResource(spritesheetClass, _initSpritesheet);
        return spritesheetClass;
    }
    addSound(soundClass, id) {
        if (typeof soundClass === 'string') {
            if (!id) {
                throw log('Please, specify the resource ID (second parameter)');
            }
            let AutoSound = class AutoSound {
            };
            AutoSound = __decorate([
                Sound({
                    id,
                    sound: this.getResourceUrl(soundClass)
                })
            ], AutoSound);
            soundClass = AutoSound;
        }
        this.addResource(soundClass, _initSound);
        return soundClass;
    }
    getResourceUrl(source) {
        // @ts-ignore
        if (window.urlCache && window.urlCache[source]) {
            // @ts-ignore
            return window.urlCache[source];
        }
        if (source.startsWith('data:')) {
            return source;
        }
        // @ts-ignore
        const staticDir = this.envs.VITE_BUILT;
        if (staticDir) {
            return this.assetsPath + '/' + Utils.basename(source);
        }
        return source;
    }
    /**
     * Starts the client side and connects to the server
     *
     * @title Start Client Engine
     * @method start()
     * @returns {Promise< RpgClientEngine >}
     * @memberof RpgClientEngine
     */
    async start(options = {
        renderLoop: true
    }) {
        await this._init();
        await this.renderer.init();
        const { maxFps } = this.options;
        if (options.renderLoop) {
            this.scheduler.start({
                maxFps
            });
            // The processing is outside the rendering loop because if the FPS are lower (or higher) then the sending to the server would be slower or faster. Here it is constant
            setInterval(() => {
                this.processInput();
            }, Utils.fps2ms(this.serverFps));
        }
        const ret = await RpgPlugin.emit(HookClient.Start, this);
        this.matchMakerService = this.options.globalConfig.matchMakerService;
        const hasFalseValue = ret.findIndex(el => el === false) != -1;
        if (!hasFalseValue) {
            let serverUri = {};
            if (this.matchMakerService) {
                if (Utils.isFunction(this.matchMakerService)) {
                    serverUri = this.matchMakerService();
                }
                else {
                    serverUri = await lastValueFrom(ajax.getJSON(this.matchMakerService));
                }
            }
            // @ts-ignore
            const envUrl = this.envs.VITE_SERVER_URL;
            await this.connection(serverUri.url ? serverUri.url + ':' + serverUri.port :
                envUrl ? envUrl : undefined);
        }
        return this;
    }
    /**
     * Display the next frame. Useful for unit tests
     *
     * @title Next Frame
     * @since 3.0.0-beta.5
     * @param {number} timestamp Indicate the timestamp of the frame
     * @method nextFrame()
     * @memberof RpgClientEngine
     */
    nextFrame(timestamp) {
        this.scheduler.nextTick(timestamp);
    }
    async sendInput(actionName) {
        const player = this.player;
        if (!player)
            return;
        if (player.canMove) {
            player.pendingMove.push({
                input: actionName,
                frame: this.scheduler.frame
            });
        }
    }
    get player() {
        return this.gameEngine.world.getObject(this.gameEngine.playerId);
    }
    serverReconciliation(player) {
        let garbage = [];
        this.serverFrames.forEach((serverData, frame) => {
            const { data: serverPos, time: serverTime } = serverData;
            const client = this.clientFrames.get(frame);
            if (!client || (client && client.data.x != serverPos.x || client.data.y != serverPos.y)) {
                if (serverPos.x)
                    player.position.x = serverPos.x;
                if (serverPos.y)
                    player.position.y = serverPos.y;
            }
            player.position.z = serverPos.z;
            garbage.push(frame);
        });
        garbage.forEach(frame => {
            this.serverFrames.delete(frame);
            this.clientFrames.delete(frame);
        });
        garbage = [];
    }
    async step(t, dt) {
        RpgPlugin.emit(HookClient.Step, [this, t, dt], true);
    }
    async processInput() {
        const player = this.player;
        this.controls.preStep();
        if (player) {
            if (player.pendingMove.length > 0) {
                const { inputs: inputEvent } = await this.gameEngine.processInput(this.gameEngine.playerId, this.controls.options);
                if (inputEvent.length == 0)
                    return;
                const frame = Date.now();
                this.clientFrames.set(frame, {
                    data: player.position.copy(),
                    time: frame
                });
                if (this.socket) {
                    this.socket.emit('move', { input: inputEvent, frame });
                }
                RpgPlugin.emit(HookClient.SendInput, [this, inputEvent], true);
            }
            if (player.canMove)
                this.serverReconciliation(player);
        }
    }
    /**
     *Connect to the server
     *
     * @title Connect to server
     * @method connection()
     * @returns {void}
     * @memberof RpgClientEngine
     */
    async connection(uri) {
        const { standalone } = this.gameEngine;
        const { globalConfig } = this;
        this._serverUrl = uri || '';
        if (!standalone) {
            this.socket = this.io(uri, {
                auth: {
                    token: this.session
                },
                ...(globalConfig.socketIoClient || {})
            });
        }
        else {
            this.socket = this.io;
        }
        this.socket.on('connect', () => {
            if (RpgGui.exists(PrebuiltGui.Disconnect))
                RpgGui.hide(PrebuiltGui.Disconnect);
            RpgPlugin.emit(HookClient.Connected, [this, this.socket], true);
            this.hasBeenDisconnected = false;
        });
        this.socket.on('playerJoined', (playerEvent) => {
            this.gameEngine.playerId = playerEvent.playerId;
            this.session = playerEvent.session;
        });
        this.socket.on('connect_error', (err) => {
            RpgPlugin.emit(HookClient.ConnectedError, [this, err, this.socket], true);
        });
        this.socket.on('preLoadScene', ({ id, reconnect }) => {
            if (this.lastScene == id) {
                return;
            }
            this.lastScene = id;
            this.renderer.transitionScene(id);
            if (reconnect) {
                this.roomJoin.next('');
                this.roomJoin.complete();
            }
        });
        this.socket.on(SocketEvents.GameReload, () => {
            window.location.reload();
        });
        this.socket.on(SocketEvents.LoadScene, ({ name, data }) => {
            this.renderer.loadScene(name, data);
        });
        this.socket.on(SocketEvents.ChangeServer, async ({ url, port }) => {
            const connection = url + ':' + port;
            if (this.lastConnection == connection) {
                return;
            }
            if (this.subscriptionWorld) {
                this.subscriptionWorld.unsubscribe();
            }
            this.lastConnection = connection;
            this.serverChanging = true;
            this.socket.disconnect();
            this.connection(connection);
        });
        this.socket.on('changeTile', ({ tiles, x, y }) => {
            const scene = this.renderer.getScene();
            scene?.changeTile(x, y, tiles);
        });
        const callMethod = ({ objectId, params, name }) => {
            const scene = this.renderer.getScene();
            const sprite = scene?.getPlayer(objectId);
            if (!sprite)
                return;
            switch (name) {
                case SocketMethods.ShowAnimation:
                    scene?.showAnimation({
                        attachTo: sprite,
                        graphic: params[0],
                        animationName: params[1],
                        replaceGraphic: params[2]
                    });
                    break;
                case SocketMethods.CameraFollow:
                    const [spriteId, options] = params;
                    scene?.cameraFollowSprite(spriteId, options);
                    break;
                case SocketMethods.PlaySound:
                    RpgSound.play(params[0]);
                    break;
                case SocketMethods.ModeMove:
                    const player = this.player;
                    const { checkCollision } = params[0];
                    if (player) {
                        player.checkCollision = checkCollision;
                    }
                    break;
            }
        };
        this.socket.on(SocketEvents.CallMethod, callMethod);
        let lastRoomId = '';
        this.subscriptionWorld = World.listen(this.socket)
            .value
            .subscribe(async (val) => {
            const scene = this.renderer.getScene();
            if (!val.data) {
                return;
            }
            const partialRoom = val.partial;
            if (val.roomId != lastRoomId) {
                this.clientFrames.clear();
                this.serverFrames.clear();
                this.gameEngine.resetObjects();
                lastRoomId = val.roomId;
                this.isTeleported = false;
            }
            const objectsChanged = {};
            const callAction = (objectId, paramsChanged) => {
                if (paramsChanged && SocketEvents.CallMethod in paramsChanged) {
                    // Force rendering on the map (display events) and then perform actions on it (animation, etc.).
                    this.renderer.draw(Date.now(), 1, 1, 1);
                    callMethod({
                        objectId,
                        ...paramsChanged[SocketEvents.CallMethod]
                    });
                }
            };
            const change = (prop, root = val, localEvent = false) => {
                const list = root.data[prop];
                const partial = root.partial[prop];
                const isShape = prop == 'shapes';
                if (!partial) {
                    return;
                }
                if (val.resetProps.indexOf(prop) != -1) {
                    const objects = isShape ? this.gameEngine.getShapes() : this.gameEngine.getObjects();
                    for (let key in objects) {
                        const obj = objects[key];
                        if (obj) {
                            this.gameEngine.removeObjectAndShape(key);
                        }
                    }
                }
                for (let key in partial) {
                    const obj = list[key];
                    const paramsChanged = partial ? partial[key] : undefined;
                    if (obj == null || obj.deleted) {
                        // perform actions on the sprite before deleting it
                        callAction(key, paramsChanged);
                        this.gameEngine.removeObjectAndShape(key);
                        continue;
                    }
                    if (!obj)
                        continue;
                    if (!isShape) {
                        obj.type = {
                            users: PlayerType.Player,
                            events: PlayerType.Event
                        }[prop];
                    }
                    if (prop == 'users' && this.gameEngine.playerId == key) {
                        if (obj.events) {
                            const nbEvents = Object.values(obj.events);
                            if (nbEvents.length == 0) {
                                this.gameEngine.events = {};
                            }
                            else {
                                change('events', {
                                    data: obj,
                                    partial: paramsChanged,
                                    time: val.time,
                                    roomId: val.roomId,
                                    resetProps: val.resetProps
                                }, true);
                            }
                        }
                        if (partialRoom?.pos && partialRoom?.frame !== undefined) {
                            this.serverFrames.set(partialRoom.frame, {
                                data: partialRoom.pos,
                                time: Date.now()
                            });
                        }
                    }
                    objectsChanged[key] = this.gameEngine.updateObject({
                        playerId: key,
                        params: obj,
                        localEvent,
                        paramsChanged,
                        isShape
                    });
                    // perform actions on the sprite after creation/update
                    callAction(key, paramsChanged);
                }
            };
            if (partialRoom.join) {
                this.roomJoin.next(partialRoom);
                this.roomJoin.complete();
            }
            change('users');
            change('events');
            change('shapes');
            this.gameEngine.setObjectsChanged(objectsChanged);
            if (scene) {
                scene.update(val);
            }
        });
        this.socket.on('disconnect', (reason) => {
            if (this.serverChanging) {
                return;
            }
            if (RpgGui.exists(PrebuiltGui.Disconnect))
                RpgGui.display(PrebuiltGui.Disconnect);
            RpgPlugin.emit(HookClient.Disconnect, [this, reason, this.socket], true);
            this.hasBeenDisconnected = true;
        });
        RpgGui._setSocket(this.socket);
        if (standalone) {
            await this.socket.connection({
                auth: {
                    token: this.session
                }
            });
        }
        this.serverChanging = false;
    }
    get world() {
        return World;
    }
    // shortcuts
    /**
    * VueJS Application instance
    *
    * [https://v3.vuejs.org/api/application-api.html](https://v3.vuejs.org/api/application-api.html)
    *
    * @prop {Vue} [vueApp]
    * @readonly
    * @memberof RpgClientEngine
    * */
    get vueApp() {
        return this.renderer.app;
    }
    /**
     * VueJS Parent component instance
     *
     * [https://v3.vuejs.org/api/instance-properties.html](https://v3.vuejs.org/api/instance-properties.html)
     *
     * @prop {Vue Instance} [vueInstance]
     * @readonly
     * @memberof RpgClientEngine
     * */
    get vueInstance() {
        return this.renderer.vm;
    }
    /**
     * retrieves the current scene (SceneMap if you are on a map)
     *
     * @prop {RpgScene} [scene]
     * @deprecated
     * @readonly
     * @memberof RpgClientEngine
     * */
    get scene() {
        return this.renderer.getScene();
    }
    /**
     * retrieves the current scene (SceneMap if you are on a map)
     *
     * @title Connect to server
     * @method getScene()
     * @returns {RpgScene}
     * @memberof RpgClientEngine
     */
    getScene() {
        return this.renderer.getScene();
    }
    /**
     * get PIXI class
     * @prop {PIXI} [PIXI]
     * @readonly
     * @memberof RpgClientEngine
     */
    get PIXI() {
        return PIXI;
    }
    /**
     * get player id of the current player
     * @prop {string} [playerId]
     * @readonly
     * @memberof RpgClientEngine
     */
    get playerId() {
        return this.gameEngine.playerId;
    }
    /**
     * Finds the game mode from the environment variables sent by the compiler.
     * Can be used in menus to display options according to type
     *
     * @title Game Type
     * @prop {string|undefined} [gameType] mmorpg | rpg or undefined if environment variable not found
     * @readonly
     * @memberof RpgClientEngine
     * @since 4.0.0
     */
    get gameType() {
        return this.envs?.['VITE_RPG_TYPE'];
    }
    /**
     * Find out if the game is in production or not, from the environment variables sent by the compiler.
     *
     * @title Game is dev mode
     * @prop {boolean} [isDev]
     * @readonly
     * @memberof RpgClientEngine
     * @since 4.0.0
     */
    get isDev() {
        return !this.envs?.['VITE_BUILT'];
    }
    /**
     * Get the server url. This is the url for the websocket
     *
     * To customize the URL, use the `matchMakerService` configuration
     *
     * @title Server URL
     * @prop {string} [serverUrl] If empty string, server url is same as client url
     * @readonly
     * @memberof RpgClientEngine
     * @since 4.0.0
     */
    get serverUrl() {
        if (!this._serverUrl.startsWith('http')) {
            return 'http://' + this._serverUrl;
        }
        return this._serverUrl;
    }
    get assetsPath() {
        return this.envs?.['VITE_ASSETS_PATH'] || 'assets';
    }
    get module() {
        return RpgPlugin;
    }
    reset() {
        this.subscriptionWorld.unsubscribe();
        this.world.reset();
        spritesheets.clear();
        sounds.clear();
        Assets.reset();
        utils.clearTextureCache();
        for (let textureUrl in utils.BaseTextureCache) {
            delete utils.BaseTextureCache[textureUrl];
        }
        for (let textureUrl in utils.TextureCache) {
            delete utils.TextureCache[textureUrl];
        }
        RpgGui.clear();
        RpgCommonMap.bufferClient.clear();
        RpgSound.clear();
    }
}
//# sourceMappingURL=RpgClientEngine.js.map