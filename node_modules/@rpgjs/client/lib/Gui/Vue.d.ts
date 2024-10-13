import type { Gui } from './Gui.js';
export declare class VueGui {
    private parentGui;
    private renderer;
    private gameEngine;
    private clientEngine;
    private app;
    private vm;
    private socket;
    constructor(rootEl: HTMLDivElement, parentGui: Gui);
    _setSceneReady(): void;
    set gui(val: any);
}
