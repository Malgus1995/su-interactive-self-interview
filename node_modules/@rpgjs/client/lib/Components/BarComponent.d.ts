import { BarComponentObject } from "@rpgjs/types";
import { AbstractComponent, CellInfo } from "./AbstractComponent.js";
import { Container } from "pixi.js";
export declare class BarComponent extends AbstractComponent<BarComponentObject, Container> {
    static readonly id: string;
    private barContainer;
    private barFill;
    private textContainer;
    private barHeight;
    private text;
    private barStyle;
    private currentValue;
    private maxValue;
    private nextValue;
    private notifier;
    cacheParams: string[];
    private get barWidth();
    onInit(cell: CellInfo): void;
    updateRender(object: any, firstRender: boolean): void;
    onRemove(): void;
}
