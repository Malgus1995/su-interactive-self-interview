import { Container } from "pixi.js";
import { InjectContext } from "@rpgjs/common";
export declare class TransitionScene {
    private context;
    private container;
    private frameIndex;
    private animations;
    private updateSubscription;
    private complete;
    private clientEngine;
    constructor(context: InjectContext, container: Container);
    addFadeIn(): this;
    addFadeOut(): this;
    private addFading;
    onComplete(cb: Function): this;
    start(): void;
    private update;
}
