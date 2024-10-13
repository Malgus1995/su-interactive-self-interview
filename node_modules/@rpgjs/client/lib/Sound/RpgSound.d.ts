import { Howl, Howler } from 'howler';
declare class RpgSoundClass {
    private sounds;
    get(id: string): Howl;
    stop(id: string): void;
    play(id: string): boolean;
    clear(): void;
    get global(): typeof Howler;
}
export declare const RpgSound: RpgSoundClass;
export {};
