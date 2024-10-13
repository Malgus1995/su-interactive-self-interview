import { Animation } from '../Effects/Animation.js';
import { RpgComponent } from '../Components/Component.js';
import { Sprite } from 'pixi.js';
export default class Character extends Sprite {
    private component;
    private graphic;
    static readonly id: string;
    private spritesheet;
    private playStandardAnimation;
    animation: Animation;
    private objSaved;
    private data;
    constructor(component: RpgComponent, graphic: string);
    getGraphicHeight(): number;
    getGraphicWidth(): number;
    animationSprite(): import("rxjs").Observable<Sprite | null>;
    private setAnimationAnchor;
}
