import { Howl, Howler } from 'howler';
import { log } from '../Logger.js';
import { sounds } from './Sounds.js';
class RpgSoundClass {
    constructor() {
        this.sounds = new Map();
    }
    get(id) {
        if (this.sounds.has(id)) {
            return this.sounds.get(id);
        }
        const resource = sounds.get(id);
        if (!resource) {
            throw log(`Impossible to find the ${id} sound. Did you put the right name or create the sound?`);
        }
        const howl = new Howl({
            src: [resource.sound],
            loop: resource.loop,
            autoplay: resource.autoplay,
            volume: resource.volume,
            sprite: resource.sprite
        });
        this.sounds.set(id, howl);
        return howl;
    }
    stop(id) {
        this.get(id).stop();
    }
    play(id) {
        const sound = this.get(id);
        if (!sound.playing()) {
            sound.play();
            return true;
        }
        return false;
    }
    clear() {
        this.sounds.clear();
        this.global.stop();
    }
    get global() {
        return Howler;
    }
}
export const RpgSound = new RpgSoundClass();
//# sourceMappingURL=RpgSound.js.map