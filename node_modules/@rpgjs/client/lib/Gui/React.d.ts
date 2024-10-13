/// <reference types="react" />
import { RpgClientEngine } from '../RpgClientEngine.js';
import type { Gui } from './Gui.js';
export { useStore } from '@nanostores/react';
export declare const RpgReactContext: import("react").Context<any>;
export declare const useObjects: () => any[];
export declare const useCurrentPlayer: () => {};
export declare const useEventPropagator: () => import("react").MutableRefObject<null>;
export declare class ReactGui {
    private app;
    private clientEngine;
    private renderer;
    private _gui;
    constructor(rootEl: HTMLDivElement, parentGui: Gui);
    set gui(val: any);
}
type onReadyCallback<T = any> = (object: {
    client: RpgClientEngine;
    server: T;
}) => void;
type RpgGameProps = {
    onReady?: onReadyCallback;
    modules?: any[];
};
export declare function RpgGame({ onReady, modules }: RpgGameProps): import("react").DetailedReactHTMLElement<{
    id: string;
    ref: import("react").MutableRefObject<null>;
}, HTMLElement>;
