import { SpritesheetOptions, TextureOptions, AnimationFrames, FrameOptions, TransformOptions } from '../Sprite/Spritesheet.js';
import { RpgComponent } from '../Components/Component.js';
import { Sprite, Container, Texture } from 'pixi.js';
import { Observable } from 'rxjs';
type Image = {
    image: string;
};
type TextureOptionsMerging = TextureOptions & {
    spriteWidth: number;
    spriteHeight: number;
    sound?: string;
} & Image & TransformOptions;
type FrameOptionsMerging = TextureOptionsMerging & FrameOptions;
type SpritesheetOptionsMerging = TextureOptionsMerging & SpritesheetOptions;
type AnimationDataFrames = {
    container: Container;
    sprites: FrameOptionsMerging[];
    frames: Texture[][];
    name: string;
    animations: AnimationFrames;
    params: any[];
    data: TextureOptionsMerging;
};
export declare class Animation extends Sprite {
    id: string;
    private _attachTo;
    hitbox: {
        w: number;
        h: number;
    };
    applyTransform: (frame: FrameOptionsMerging, data: TextureOptionsMerging, spritesheet: SpritesheetOptionsMerging) => Partial<FrameOptionsMerging>;
    private spritesheet;
    private currentAnimation;
    private time;
    private frameIndex;
    private animations;
    private _animation$;
    readonly animation$: Observable<Sprite | null>;
    onFinish: () => void;
    get attachTo(): RpgComponent | undefined;
    set attachTo(component: RpgComponent | undefined);
    constructor(id: string);
    private createTextures;
    private createAnimations;
    private getSpriteSize;
    getSpriteHeight(): number;
    getSpriteWidth(): number;
    has(name: string): boolean;
    get(name: string): AnimationDataFrames;
    isPlaying(name?: string): boolean;
    stop(): void;
    play(name: string, params?: any[]): void;
    update(deltaRatio: number): void;
}
export {};
