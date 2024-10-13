import { InjectContext } from '@rpgjs/common';
import { RpgClientEngine } from '../index.js';
import { Scene } from '../Scene/Scene.js';
interface GuiOptions {
    data: any;
    attachToSprite: boolean;
    display: boolean;
    name: string;
    isFunction: boolean;
    gui: any;
}
interface GuiList {
    [guiName: string]: GuiOptions;
}
export declare class Gui {
    private renderer;
    private gameEngine;
    clientEngine: RpgClientEngine;
    private socket;
    gui: GuiList;
    currentScene: Scene | null;
    private librariesInstances;
    _initialize(context: InjectContext, guiEl: HTMLDivElement): Promise<void>;
    _setSceneReady(scene: Scene): void;
    getInjectObject(): any;
    /**
   * Get a GUI. You retrieve GUI data and information whether it is displayed or not
   *
   * ```ts
   * import { RpgGui } from '@rpgjs/client'
   *
   * const gui = RpgGui.get('my-gui')
   * console.log(gui.display) // false
   * ```
   *
   * @title Get a GUI
   * @method RpgGui.get(id)
   * @param {string} id
   * @returns { { data: any, display: boolean } }
   * @memberof RpgGui
   */
    get(id: any): GuiOptions;
    /**
     * Get all GUI. You retrieve GUI data and information whether it is displayed or not
     *
     * ```ts
     * import { RpgGui } from '@rpgjs/client'
     *
     * const gui = RpgGui.getAll()
     * console.log(gui) // { 'rpg-dialog': { data: {}, display: true } }
     * ```
     *
     * @title Get all GUI
     * @method RpgGui.getAll()
     * @returns { { [guiName]: { data: any, display: boolean }  }}
     * @memberof RpgGui
     */
    getAll(): GuiList;
    /**
     * Checks if the GUI exists RpgClient's gui array
     *
     * ```ts
     * import { RpgGui } from '@rpgjs/client'
     *
     * RpgGui.exists('my-gui') // true
     * ```
     *
     * @title GUI Exists ?
     * @method RpgGui.exists(id)
     * @param {string} id
     * @returns {boolean}
     * @memberof RpgGui
     */
    exists(id: string): boolean;
    /**
     * Calls a GUI according to identifier. You can send retrievable data in the component
     *
     * ```ts
     * import { RpgGui } from '@rpgjs/client'
     *
     * RpgGui.display('my-gui')
     * ```
     *
     * @title Display GUI
     * @method RpgGui.display(id,data)
     * @param {string} id
     * @param {object} [data]
     * @returns {void}
     * @memberof RpgGui
     */
    display(id: string, data?: {}): void;
    /**
     * Hide a GUI according to its identifier
     *
     * ```ts
     * import { RpgGui } from '@rpgjs/client'
     *
     * RpgGui.hide('my-gui')
     * ```
     *
     * @title Hide GUI
     * @method RpgGui.hide(id)
     * @param {string} id
     * @returns {void}
     * @memberof RpgGui
     */
    hide(id: string): void;
}
export declare const RpgGui: Gui;
export {};
