import { RpgClientEngine } from "../RpgClientEngine.js";
import { Graphics, Renderer } from "pixi.js";
export declare class SpinnerGraphic extends Graphics {
    private clientEngine;
    constructor(clientEngine: RpgClientEngine);
    render(renderer: Renderer): void;
}
