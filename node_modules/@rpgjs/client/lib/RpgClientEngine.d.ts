import { KeyboardControls } from './KeyboardControls.js';
import { RpgRenderer } from './Renderer.js';
import { Observable, Subject } from 'rxjs';
import { RpgCommonPlayer, Control, InjectContext } from '@rpgjs/common';
import { GameEngineClient } from './GameEngine.js';
import { Scene } from './Scene/Scene.js';
import { constructor, ObjectFixtureList, Tick } from '@rpgjs/types';
import * as PIXI from 'pixi.js';
export declare class RpgClientEngine {
    private context;
    private options;
    /**
     * Get the rendering
     *
     * @prop {RpgRenderer} [renderer]
     * @readonly
     * @deprecated Use `inject(RpgRenderer)` instead. Will be removed in v5
     * @memberof RpgClientEngine
     * */
    renderer: RpgRenderer;
    /**
     * Get the socket
     *
     * @prop {Socket} [socket]
     * @readonly
     * @memberof RpgClientEngine
     * */
    socket: any;
    /**
    * retrieve the global configurations assigned at the entry point
    *
    * @prop {object} [globalConfig]
    * @readonly
    * @memberof RpgClientEngine
    * */
    globalConfig: any;
    /**
     * Get the class managing the keyboard
     *
     * @prop {KeyboardControls} [controls]
     * @deprecated Use `inject(KeyboardControls)` instead. Will be removed in v5
     * @readonly
     * @memberof RpgClientEngine
     * */
    controls: KeyboardControls;
    _options: any;
    private _tick;
    keyChange: Subject<string>;
    roomJoin: Subject<string>;
    private hasBeenDisconnected;
    private serverChanging;
    private isTeleported;
    io: any;
    private lastTimestamp;
    private subscriptionWorld;
    private clientFrames;
    private serverFrames;
    private session;
    private lastConnection;
    private lastScene;
    private matchMakerService;
    private serverFps;
    private scheduler;
    private _serverUrl;
    /**
     * * @deprecated Use `inject(GameEngineClient)` instead. Will be removed in v5
     */
    gameEngine: GameEngineClient;
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
    objects: Observable<ObjectFixtureList>;
    envs?: object;
    constructor(context: InjectContext, options: any);
    private _init;
    private addResource;
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
    get tick(): Observable<Tick>;
    /**
     * Adds Spritesheet classes
     *
     * @title Add Spritesheet
     * @method addSpriteSheet(spritesheetClass|spritesheetClass[])
     * @param { Class|Class[] } spritesheetClass
     * @method addSpriteSheet(url,id)
     * @param {string} url Define the url of the resource
     * @param {string} id Define a resource identifier
     * @returns {Class}
     * @since 3.0.0-beta.3
     * @memberof RpgClientEngine
     */
    addSpriteSheet(spritesheetClass: constructor<any>): any;
    addSpriteSheet(url: string, id: string): any;
    /**
     * Adds Sound classes
     *
     * @title Add Sound
     * @method addSound(soundClass|soundClass[])
     * @param { Class|Class[] } soundClass
     * @method addSound(url,id)
     * @param {string} url Define the url of the resource
     * @param {string} id Define a resource identifier
     * @returns {Class}
     * @since 3.0.0-beta.3
     * @memberof RpgClientEngine
     */
    addSound(soundClass: constructor<any>): any;
    addSound(url: string, id: string): any;
    getResourceUrl(source: string): string;
    /**
     * Starts the client side and connects to the server
     *
     * @title Start Client Engine
     * @method start()
     * @returns {Promise< RpgClientEngine >}
     * @memberof RpgClientEngine
     */
    start(options?: {
        renderLoop: boolean;
    }): Promise<RpgClientEngine>;
    /**
     * Display the next frame. Useful for unit tests
     *
     * @title Next Frame
     * @since 3.0.0-beta.5
     * @param {number} timestamp Indicate the timestamp of the frame
     * @method nextFrame()
     * @memberof RpgClientEngine
     */
    nextFrame(timestamp: number): void;
    sendInput(actionName: string | Control): Promise<void>;
    get player(): RpgCommonPlayer | null;
    private serverReconciliation;
    private step;
    processInput(): Promise<void>;
    /**
     *Connect to the server
     *
     * @title Connect to server
     * @method connection()
     * @returns {void}
     * @memberof RpgClientEngine
     */
    connection(uri?: string): Promise<void>;
    get world(): any;
    /**
    * VueJS Application instance
    *
    * [https://v3.vuejs.org/api/application-api.html](https://v3.vuejs.org/api/application-api.html)
    *
    * @prop {Vue} [vueApp]
    * @readonly
    * @memberof RpgClientEngine
    * */
    get vueApp(): import("vue").App<any>;
    /**
     * VueJS Parent component instance
     *
     * [https://v3.vuejs.org/api/instance-properties.html](https://v3.vuejs.org/api/instance-properties.html)
     *
     * @prop {Vue Instance} [vueInstance]
     * @readonly
     * @memberof RpgClientEngine
     * */
    get vueInstance(): import("vue").ComponentPublicInstance;
    /**
     * retrieves the current scene (SceneMap if you are on a map)
     *
     * @prop {RpgScene} [scene]
     * @deprecated
     * @readonly
     * @memberof RpgClientEngine
     * */
    get scene(): Scene | null;
    /**
     * retrieves the current scene (SceneMap if you are on a map)
     *
     * @title Connect to server
     * @method getScene()
     * @returns {RpgScene}
     * @memberof RpgClientEngine
     */
    getScene<T = Scene>(): T | null;
    /**
     * get PIXI class
     * @prop {PIXI} [PIXI]
     * @readonly
     * @memberof RpgClientEngine
     */
    get PIXI(): typeof PIXI;
    /**
     * get player id of the current player
     * @prop {string} [playerId]
     * @readonly
     * @memberof RpgClientEngine
     */
    get playerId(): string;
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
    get gameType(): 'mmorpg' | 'rpg' | undefined;
    /**
     * Find out if the game is in production or not, from the environment variables sent by the compiler.
     *
     * @title Game is dev mode
     * @prop {boolean} [isDev]
     * @readonly
     * @memberof RpgClientEngine
     * @since 4.0.0
     */
    get isDev(): boolean;
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
    get serverUrl(): string;
    get assetsPath(): string;
    get module(): import("@rpgjs/common/lib/Plugin.js").PluginSystem;
    reset(): void;
}
