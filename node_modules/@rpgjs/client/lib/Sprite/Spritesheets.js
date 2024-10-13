import { _initResource } from '../Resources.js';
export const spritesheets = new Map();
export function _initSpritesheet(_spritesheets, engine) {
    return _initResource(spritesheets, _spritesheets, 'image', engine);
}
//# sourceMappingURL=Spritesheets.js.map