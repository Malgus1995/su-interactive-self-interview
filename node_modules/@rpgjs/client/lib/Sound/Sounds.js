import { _initResource } from '../Resources.js';
export const sounds = new Map();
export function _initSound(_sounds, engine) {
    return _initResource(sounds, _sounds, 'sound', engine);
}
//# sourceMappingURL=Sounds.js.map