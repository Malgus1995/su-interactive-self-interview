import { RpgSprite } from '../Sprite/Player.js';
export interface ISpriteCharacter {
    onCharacterWalk(sprite: RpgSprite): void;
    onCharacterStand(sprite: RpgSprite): void;
    onCharacterAction(sprite: RpgSprite): void;
}
