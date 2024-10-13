import { TransformOptions, FrameOptions } from '../Sprite/Spritesheet.js';
type EasingFunction = (time: number, _from: number, to: number, duration: number) => number;
export declare const Ease: Record<string, EasingFunction>;
type EaseType = (t: number, b: number, c: number, d: number) => number;
/**
 * Creates a new instance of the Timeline class, which allows for complex animations and control over keyframes.
 *
 * @constructor
 * @title new Timeline(options?)
 * @param {object} [options] - Optional configuration object for the Timeline.
 * @param {number} [options.keyframes=10] - Specifies the number of keyframes for the animation. Defaults to 10. The larger the keyframes, the smoother the animation, but the more resource-intensive it is, as the loop to browse the array will take longer.
 * @memberof Timeline
 * @since 4.0.0
 * @example
 *
 * ```ts
 * const timeline = new Timeline({ keyframes: 20 });
 * ```
 */
interface TimelineOptions {
    keyframes?: number;
}
export declare class Timeline {
    private time;
    private animation;
    private keyframes;
    constructor(options?: TimelineOptions);
    /**
     * Allows you to create complex animations more easily. For example, to display a movement with an Easing function
     *
     * ```ts
     * import { Timeline, Ease } from '@rpgjs/client'
     *
     * new Timeline()
     *      .add(30, ({ scale }) => [{
     *          frameX: 0,
     *          frameY: 1,
     *          scale: [scale]
     *      }], {
     *          scale: {
     *              from: 0,
     *              to: 1,
     *              easing: Ease.easeOutBounce
     *          }
     *      })
     *      .add(100)
     *      .create()
     * ```
     *
     * Here we say
     *
     * - Duration in frames, allowing you to specify the duration of each animation step. If the timeline respects a specific frame rate, e.g. 60 frames per second, 40 frames correspond to an animation duration of 2/3 of a second for each step.
     * - A function that will be called every 1 frame with the `scale` property defined in transform
     * - An object of transformation. Define the properties of your choice to be passed to the callback function
     *      - `to`: the starting value
     *      - `from`: the end value
     *      - `easing`: An easing function (By default, it is a linear function)
     *
     * Note that if you just put a duration (`add(100)`), it will only put a pause on the animation
     *
     * Easing functions available but you can create your own
     *
     * ```ts
     * function myEase(t: number, b: number, c: number, d: number): number { }
     * ```
     *
     * `t`: current time
     * `b`: start value
     * `c`: end value
     * `d`: duration
     *
     * @title Add Animation in timeline
     * @enum {Function}
     *
     * Ease.linear | linear
    * Ease.easeInQuad | easeInQuad
    * Ease.easeOutQuad | easeOutQuad
    * Ease.easeInOutQuad | easeInOutQuad
    * Ease.easeInCubic | easeInCubic
    * Ease.easeOutCubic | easeOutCubic
    * Ease.easeInOutCubic | easeInOutCubic
    * Ease.easeInQuart | easeInQuart
    * Ease.easeOutQuart | easeOutQuart
    * Ease.easeInOutQuart | easeInOutQuart
    * Ease.easeInQuint | easeInQuint
    * Ease.easeOutQuint | easeOutQuint
    * Ease.easeInOutQuint | easeInOutQuint
    * Ease.easeInSine | easeInSine
    * Ease.easeOutSine | easeOutSine
    * Ease.easeInOutSine | easeInOutSine
    * Ease.easeInExpo | easeInExpo
    * Ease.easeOutExpo | easeOutExpo
    * Ease.easeInOutExpo | easeInOutExpo
    * Ease.easeInCirc | easeInCirc
    * Ease.easeOutCirc | easeOutCirc
    * Ease.easeInOutCirc | easeInOutCirc
    * Ease.easeInElastic | easeInElastic
    * Ease.easeOutElastic | easeOutElastic
    * Ease.easeInOutElastic | easeInOutElastic
    * Ease.easeInBack | easeInBack
    * Ease.easeOutBack | easeOutBack
    * Ease.easeInOutBack | easeInOutBack
    * Ease.easeInBounce | easeInBounce
    * Ease.easeOutBounce | easeOutBounce
     * @method timeline.add(duration,cb?,transform?)
     * @param {number} duration
     * @param { (obj?: number, time?: number) => TransformOptions[] } [cb]
     * @param { [property: string]: { to:number, from: number: easing?: Function } } [transform]
     * @returns {Timeline}
     * @memberof Timeline
     */
    add(duration: number, cb?: (obj?: any, time?: number) => TransformOptions[], transform?: {
        [property: string]: {
            to: number;
            from: number;
            easing?: EaseType;
        };
    }): Timeline;
    /**
     * Allows you to create the animation array to assign to the `animations` property in the Spritesheet
     *
     * ```ts
     * import { Spritesheet, Timeline } from '@rpgjs/server'
     *
     * @Spritesheet({
     *  id: 'sprite',
     *  image: require('./sprite.png'),
     *  width: 192,
     *  height: 228,
     *  framesHeight: 6,
     *  framesWidth: 6,
     *  anchor: [0.5],
     *  textures: {
     *      myanim: {
     *          animations: new Timeline()
     *                          .add(SEE THE ADD METHOD)
     *                          .create()
     *      }
     *  }
     * })
     * export class MyAnim {}
     * ```
     *
     * @title Create the animation array
     * @method timeline.create()
     * @returns {FrameOptions[][]} The animation array
     * @memberof Timeline
     */
    create(): FrameOptions[][];
}
export {};
