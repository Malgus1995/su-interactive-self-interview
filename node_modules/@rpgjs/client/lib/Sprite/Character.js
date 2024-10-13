import { Utils, RpgPlugin, HookClient } from '@rpgjs/common';
import { spritesheets } from './Spritesheets.js';
import { Animation } from '../Effects/Animation.js';
import { Animation as AnimationEnum } from '../Effects/AnimationCharacter.js';
import { Sprite } from 'pixi.js';
const { capitalize } = Utils;
class Character extends Sprite {
    constructor(component, graphic) {
        super();
        this.component = component;
        this.graphic = graphic;
        this.playStandardAnimation = true;
        this.objSaved = {};
        this.data = {};
        /** @internal */
        this.h = 1;
        /** @internal */
        this.w = 1;
        this.data = component.logic;
        this.setGraphic(graphic);
    }
    /** @internal */
    showAnimation(graphic, animationName) {
        const refreshAnimation = (graphic) => {
            this.removeChild(this.animation);
            this.animation = new Animation(graphic);
            this.addChild(this.animation);
            this.setAnimationAnchor();
        };
        const memoryGraphic = this.graphic;
        let graphicId = '';
        // Changes only graphics already defined on the character
        if (Utils.isArray(graphic)) {
            graphicId = graphic.find(id => id == this.graphic);
        }
        else {
            graphicId = graphic;
        }
        if (!graphicId) {
            return null;
        }
        refreshAnimation(graphicId);
        this.component.animationIsPlaying = true;
        this.animation.onFinish = () => {
            this.playStandardAnimation = true;
            this.component.animationIsPlaying = false;
            refreshAnimation(memoryGraphic);
            this.update(this.objSaved);
        };
        this.playStandardAnimation = false;
        this.playAnimation(animationName);
        return this.animation;
    }
    /** @internal */
    setGraphic(graphic) {
        this.children.forEach((graphic, index) => {
            if (graphic.id == this.graphic) {
                this.removeChildAt(index);
            }
        });
        this.graphic = graphic;
        this.spritesheet = spritesheets.get(this.graphic);
        this.animation = new Animation(this.graphic);
        this.addChild(this.animation);
        this.setAnimationAnchor();
    }
    getGraphicHeight() {
        return this.animation.getSpriteHeight();
    }
    getGraphicWidth() {
        return this.animation.getSpriteWidth();
    }
    animationSprite() {
        return this.animation.animation$;
    }
    setAnimationAnchor() {
        this.animation.hitbox = { h: this.data.hHitbox, w: this.data.wHitbox };
        this.animation.applyTransform = (frame, animation, spritesheet) => {
            const { spriteWidth, spriteHeight } = animation;
            const prop = 'spriteRealSize';
            const currentAnchor = frame[prop] || animation[prop] || spritesheet[prop];
            if (currentAnchor) {
                return {};
            }
            return {
                spriteRealSize: {
                    width: spriteWidth,
                    height: spriteHeight
                }
            };
        };
    }
    /** @internal */
    update(obj, options = {}, deltaRatio = 1) {
        const { moving } = options;
        this.data = obj;
        if (this.anim)
            this.anim.update(deltaRatio);
        if (this.animation)
            this.animation.update(deltaRatio);
        if (this.playStandardAnimation) {
            if (moving) {
                RpgPlugin.emit(HookClient.SpriteMove, this);
                this.playAnimation(AnimationEnum.Walk);
            }
            else {
                this.playAnimation(AnimationEnum.Stand);
            }
        }
        this.objSaved = obj;
        return {
            moving,
            instance: this
        };
    }
    /** @internal */
    playAnimation(name) {
        const hook = `onCharacter${capitalize(name)}`;
        if (!this.spritesheet)
            return;
        if (this.spritesheet[hook]) {
            this.spritesheet[hook](this);
        }
        else if (this.animation.has(name)) {
            this.animation.play(name, [this.data.direction]);
        }
    }
}
Character.id = 'graphic';
export default Character;
//# sourceMappingURL=Character.js.map