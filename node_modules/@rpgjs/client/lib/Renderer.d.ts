import { InjectContext } from '@rpgjs/common';
import type { App, ComponentPublicInstance } from 'vue';
import { Container } from 'pixi.js';
export declare enum TransitionMode {
    None = 0,
    Fading = 1
}
export declare const EVENTS_MAP: {
    MouseEvent: string[];
    KeyboardEvent: string[];
    PointerEvent: string[];
    TouchEvent: string[];
};
export declare class RpgRenderer {
    private context;
    private gameEngine;
    private clientEngine;
    vm: ComponentPublicInstance;
    app: App;
    readonly stage: Container;
    private readonly sceneContainer;
    private readonly fadeContainer;
    private readonly spinner;
    options: any;
    guiEl: HTMLDivElement;
    private scene;
    private renderer;
    private _width;
    private _height;
    private canvasEl;
    private selector;
    private loadingScene;
    private freeze;
    private prevObjectScene;
    transitionMode: TransitionMode;
    constructor(context: InjectContext);
    get canvas(): HTMLCanvasElement;
    get height(): number;
    set height(val: number);
    get width(): number;
    set width(val: number);
    private bindMouseControls;
    private createScene;
    /**
     * @title Propagate mouse event to Viewport
     * @method propagateEvent(ev)
     * @stability 1
     * @memberof RpgRenderer
     * @returns {void}
     */
    propagateEvent(ev: MouseEvent): void;
    /***
     * Propagate events from an HTMLElement to the canvas
     *
     * @title Propagate events
     * @method addPropagateEventsFrom(el)
     * @stability 1
     * @memberof RpgRenderer
     * @returns {void}
     */
    addPropagateEventsFrom(el: HTMLElement): void;
}
