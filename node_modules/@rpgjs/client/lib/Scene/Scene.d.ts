import { InjectContext } from '@rpgjs/common';
import RpgSprite from '../Sprite/Character.js';
import { Animation } from '../Effects/Animation.js';
import { Observable, Subject } from 'rxjs';
import { GameEngineClient } from '../GameEngine.js';
import { RpgComponent } from '../Components/Component.js';
import { Controls } from '@rpgjs/types';
import { Container } from 'pixi.js';
export type SceneObservableData = {
    data: {
        [key: string]: any;
    };
    partial: {
        [key: string]: any;
    };
};
export interface SceneSpriteLogic {
    paramsChanged: {
        [key: string]: any;
    } | null;
    prevParamsChanged: object;
}
export declare abstract class Scene {
    protected context: InjectContext;
    protected objects: Map<string, RpgComponent>;
    protected animationLayer: Container;
    private controls;
    private animations;
    private _data;
    /**
     *  @deprecated Use `inject(GameEngineClient)` instead. Will be removed in v5
     */
    game: GameEngineClient;
    /**
     * Listen to the movement of objects on stage
     *
     * @prop {Observable<{ [key: string]: object }>} [objectsMoving]
     * @readonly
     * @memberof RpgScene
     * @since v4.1.0
     *
     * In <module>/scene-map.ts
     *
     * ```ts
     * import { RpgSceneMap } from '@rpgjs/client'
     *
     * export default {
     *      onAfterLoading(scene: RpgSceneMap) {
     *         scene.objectsMoving.subscribe((objects) => {
     *             console.log(objects)
     *          })
     *      }
     * }
     * ```
     */
    readonly objectsMoving: Subject<{
        [key: string]: any;
    }>;
    constructor(context: InjectContext);
    /**
     * Listen to all the synchronized values of the scene with the server
     *
     * ```ts
     * import { RpgClient, RpgModule, RpgSceneMap } from '@rpgjs/client'
     *
     *  @RpgModule<RpgClient>({
            scenes: {
                map: {
                    onAfterLoading(scene: RpgSceneMap) {
                      scene.valuesChange.subscribe((obj) => {
                         console.log(obj.data, obj.partial)
                      })
                    }
                }
            }
        })
        export default class RpgClientModuleEngine {}
     * ```
     *
     * - `data` represents all the current data of the scene (`users`, `events` and others)
     * - `partial` represents only the data that has changed on the scene
     *
     * > In the class, you can also use the onChanges hook
     *
     *
     * @prop {Observable<{ data: object, partial: object }>} [valuesChange]
     * @readonly
     * @memberof RpgScene
     */
    get valuesChange(): Observable<SceneObservableData>;
    private triggerSpriteChanges;
    abstract onUpdateObject(logic: SceneSpriteLogic, sprite: RpgComponent, moving: boolean): void;
    abstract addObject(obj: any, id: string): RpgComponent;
    abstract removeObject(id: string): any;
    /**
     * Display an animation on the scene
     *
     * The object is the following:
     * * `graphic`: Spritesheet id
     * * `animationName`: The name of the animation
     * * `attachTo`: Define a sprite. The animation will follow this sprite (optional)
     * * `x`: Position X (0 by default)
     * * `y`: Position Y (0 by default)
     * * `loop`: Display the animation in a loop (false by default)
     *
     * ```ts
     * import { RpgClient, RpgModule, RpgSceneMap } from '@rpgjs/client'
     *

     * @RpgModule<RpgClient>({
            scenes: {
                map: {
                    onAfterLoading(scene: RpgSceneMap) {
                        const animation = scene.showAnimation({
                            graphic: 'my-spritesheet',
                            animationName: 'my-anim'
                        })
                    }
                }
            }
        })
        export default class RpgClientModuleEngine {}
     * ```
     *
     * The return is an animation containing two methods:
     * * `play()`: Play the animation (Already the case when calling the method)
     * * `stop()`: Stop the animation
     *
     * They have a hook:
     *
     * `onFinish`: Triggered when the animation is finished
     *
     * ```ts
     * animation.onFinish = () => {
     *      console.log('finish !')
     * }
     * ```
     *
     * @title Show Animation
     * @method scene.showAnimation(object)
     * @param {object} object
     * @returns {Animation}
     * @memberof RpgScene
     */
    showAnimation({ graphic, animationName, attachTo, x, y, loop, replaceGraphic }: {
        graphic: string;
        animationName: string;
        attachTo?: RpgComponent;
        x?: number;
        y?: number;
        loop?: boolean;
        replaceGraphic?: boolean;
    }): Animation | undefined;
    /**
    * Retrieve a sprite according to its identifier
    *
    * @title Get Sprite
    * @method scene.getSprite(id)
    * @param {string} id
    * @returns {RpgSprite | undefined}
    * @memberof RpgScene
    */
    getSprite(id: string): RpgComponent<any> | undefined;
    getPlayer(id: string): RpgComponent | undefined;
    /**
    * Retrieve a sprite that the player controls
    *
    * @title Get Current Player
    * @method scene.getCurrentPlayer()
    * @returns {RpgSprite | undefined}
    * @memberof RpgScene
    */
    getCurrentPlayer(): RpgSprite | RpgComponent | undefined;
    onInit(): void;
    onLoad(): void;
    onChanges(obj: any): void;
    onDraw(t: number): void;
    onAddSprite(sprite: RpgSprite): void;
    onRemoveSprite(sprite: RpgSprite): void;
}
export interface Scene {
    inputs: Controls;
    updateScene(obj: SceneObservableData): any;
}
