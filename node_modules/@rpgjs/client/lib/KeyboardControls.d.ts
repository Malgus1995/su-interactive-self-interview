import { InjectContext } from '@rpgjs/common';
import { ControlOptions, Controls } from '@rpgjs/types';
type BoundKey = {
    actionName: string;
    options: ControlOptions;
    parameters?: any;
};
export declare class KeyboardControls {
    private context;
    private clientEngine;
    private keyState;
    private boundKeys;
    private stop;
    private lastKeyPressed;
    private _controlsOptions;
    constructor(context: InjectContext);
    private directionToAngle;
    private setupListeners;
    private bindKey;
    private applyKeyDown;
    private applyKeyUp;
    private applyKeyPress;
    private onKeyChange;
    /**
     * From the name of the entry, we retrieve the control information
     *
     * ```ts
     * import { Input, inject, KeyboardControls } from '@rpgjs/client'
     *
     * const controls = inject(KeyboardControls)
     * controls.getControl(Input.Enter)

     * if (control) {
     *    console.log(control.actionName) // action
     * }
     * ```
     * @title Get Control
     * @method getControl(inputName)
     * @param {string} inputName
     * @returns { { actionName: string, options: any } | undefined }
     * @memberof KeyboardControls
     */
    getControl(inputName: string): BoundKey | undefined;
    /**
     * Returns all controls
     *
     * @method getControls()
     * @since 4.2.0
     * @returns { { [key: string]: BoundKey } }
     * @memberof KeyboardControls
     */
    getControls(): {
        [key: string]: BoundKey;
    };
    /**
     * Triggers an input according to the name of the control
     *
     * ```ts
     * import { Control, inject, KeyboardControls } from '@rpgjs/client'
     *
     * const controls = inject(KeyboardControls)
     * controls.applyControl(Control.Action)
     * ```
     *
     * You can put a second parameter or indicate on whether the key is pressed or released
     *
     * ```ts
     * import { Control, inject, KeyboardControls } from '@rpgjs/client'
     *
     * const controls = inject(KeyboardControls)
     * controls.applyControl(Control.Up, true) // keydown
     * controls.applyControl(Control.Up, false) // keyup
     * ```
     * @title Apply Control
     * @method applyControl(controlName,isDown)
     * @param {string} controlName
     * @param {boolean} [isDown]
     * @returns {Promise<void>}
     * @memberof KeyboardControls
     */
    applyControl(controlName: string | number, isDown?: boolean | undefined): Promise<void>;
    /**
     * Stop listening to the inputs. Pressing a key won't do anything
     *
     * @title Stop Inputs
     * @method stopInputs()
     * @returns {void}
     * @memberof KeyboardControls
     */
    stopInputs(): void;
    /**
     * Listen to the inputs again
     *
     * @title Listen Inputs
     * @method listenInputs()
     * @returns {void}
     * @memberof KeyboardControls
     */
    listenInputs(): void;
    /**
     * Assign custom inputs to the scene
     *
     * The object is the following:
     *
     * * the key of the object is the name of the control. Either it is existing controls (Up, Dow, Left, Right, Action, Back) or customized controls
     * * The value is an object representing control information:
     *      * repeat {boolean} The key can be held down to repeat the action. (false by default)
     *      * bind {string | string[]} To which key is linked the control
     *      * method {Function} Function to be triggered. If you do not set this property, the name of the control is sent directly to the server.
     *      * delay {object|number} (since v3.2.0) Indicates how long (in milliseconds) the player can press the key again to perform the action
     *          * delay.duration
     *          * delay.otherControls {string | string[]} Indicates the other controls that will also have the delay at the same time
     *
     * ```ts
     * import { Control, Input, inject, KeyboardControls } from '@rpgjs/client'
     *
     * const controls = inject(KeyboardControls)
     * controls.setInputs({
            [Control.Up]: {
                repeat: true,
                bind: Input.Up
            },
            [Control.Down]: {
                repeat: true,
                bind: Input.Down
            },
            [Control.Right]: {
                repeat: true,
                bind: Input.Right
            },
            [Control.Left]: {
                repeat: true,
                bind: Input.Left
            },
            [Control.Action]: {
                bind: [Input.Space, Input.Enter]
            },
            [Control.Back]: {
                bind: Input.Escape
            },

            // The myscustom1 control is sent to the server when the A key is pressed.
            mycustom1: {
                bind: Input.A
            },

            // the myAction method is executed when the B key is pressed
            mycustom2: {
                bind: Input.B,
                method({ actionName }) {
                    console.log('cool', actionName)
                }
            },

            // The player can redo the action after 400ms
            mycustom3: {
                bind: Input.C,
                delay: 400 // ms
            },

            // The player can redo the action (mycustom4) and the directions after 400ms
            mycustom4: {
                bind: Input.C,
                delay: {
                    duration: 400,
                    otherControls: [Control.Up, Control.Down, Control.Left, Control.Right]
                }
            }
        })
     *
     * ```
     * @enum {string} Control
     *
     * Control.Up | up
     * Control.Down | down
     * Control.Left | left
     * Control.Right | right
     * Control.Action | action
     * Control.Back | back
     *
     * @enum {string} Mouse Event
     *
     * click | Click
     * dblclick | Double Click
     * mousedown | Mouse Down
     * mouseup | Mouse Up
     * mouseover | Mouse Over
     * mousemove | Mouse Move
     * mouseout | Mouse Out
     * contextmenu | Context Menu
     *
     *
     * @enum {string} Input
     *
     * break | Pause
    * backspace | Backspace / Delete
    * tab | Tab
    * clear | Clear
    * enter | Enter
    * shift | Shift
    * ctrl | Control
    * alt | Alt
    * pause/break | Pause / Break
    * caps lock | Caps Lock
    * escape | Escape
    * conversion | Conversion
    * non-conversion | Non-conversion
    * space | Space
    * page up | Page Up
    * page down | Page Down
    * end | End
    * home | Home
    * left | Left Arrow
    * up | Up Arrow
    * right | Right Arrow
    * down | Down Arrow
    * select | Select
    * print | Print
    * execute | Execute
    * Print Screen | Print Screen
    * insert | Insert
    * delete | Delete
    * n0 | 0
    * n1 | 1
    * n2 | 2
    * n3 | 3
    * n4 | 4
    * n5 | 5
    * n6 | 6
    * n7 | 7
    * n8 | 8
    * n9 | 9
    * : | Colon
    * semicolon (firefox), equals | Semicolon (Firefox), Equals
    * < | Less Than
    * equals (firefox) | Equals (Firefox)
    * ß | Eszett
    * @ | At
    * a | A
    * b | B
    * c | C
    * d | D
    * e | E
    * f | F
    * g | G
    * h | H
    * i | I
    * j | J
    * k | K
    * l | L
    * m | M
    * n | N
    * o | O
    * p | P
    * q | Q
    * r | R
    * s | S
    * t | T
    * u | U
    * v | V
    * w | W
    * x | X
    * y | Y
    * z | Z
    * Windows Key / Left ⌘ / Chromebook Search key | Windows Key / Left Command ⌘ / Chromebook Search Key
    * right window key | Right Windows Key
    * Windows Menu / Right ⌘ | Windows Menu / Right Command ⌘
    * numpad 0 | Numpad 0
    * numpad 1 | Numpad 1
    * numpad 2 | Numpad 2
    * numpad 3 | Numpad 3
    * numpad 4 | Numpad 4
    * numpad 5 | Numpad 5
    * numpad 6 | Numpad 6
    * numpad 7 | Numpad 7
    * numpad 8 | Numpad 8
    * numpad 9 | Numpad 9
    * multiply | Multiply
    * add | Add
    * numpad period (firefox) | Numpad Period (Firefox)
    * subtract | Subtract
    * decimal point | Decimal Point
    * divide | Divide
    * f1 | F1
    * f2 | F2
    * f3 | F3
    * f4 | F4
    * f5 | F5
    * f6 | F6
    * f7 | F7
    * f8 | F8
    * f9 | F9
    * f10 | F10
    * f11 | F11
    * f12 | F12
    * f13 | F13
    * f14 | F14
    * f15 | F15
    * f16 | F16
    * f17 | F17
    * f18 | F18
    * f19 | F19
    * f20 | F20
    * f21 | F21
    * f22 | F22
    * f23 | F23
    * f24 | F24
    * num lock | Num Lock
    * scroll lock | Scroll Lock
    * ^ | Caret
    * ! | Exclamation Point
    * # | Hash
    * $ | Dollar Sign
    * ù | Grave Accent U
    * page backward | Page Backward
    * page forward | Page Forward
    * closing paren (AZERTY) | Closing Parenthesis (AZERTY)
    * * | Asterisk
    * ~ + * key | Tilde + Asterisk Key
    * minus (firefox), mute/unmute | Minus (Firefox), Mute/Unmute
    * decrease volume level | Decrease Volume Level
    * increase volume level | Increase Volume Level
    * next | Next
    * previous | Previous
    * stop | Stop
    * play/pause | Play/Pause
    * e-mail | Email
    * mute/unmute (firefox) | Mute/Unmute (Firefox)
    * decrease volume level (firefox) | Decrease Volume Level (Firefox)
    * increase volume level (firefox) | Increase Volume Level (Firefox)
    * semi-colon / ñ | Semicolon / ñ
    * equal sign | Equal Sign
    * comma | Comma
    * dash | Dash
    * period | Period
    * forward slash / ç | Forward Slash / ç
    * grave accent / ñ / æ | Grave Accent / ñ / æ
    * ?, / or ° | ?, / or °
    * numpad period (chrome) | Numpad Period (Chrome)
    * open bracket | Open Bracket
    * back slash | Backslash
    * close bracket / å | Close Bracket / å
    * single quote / ø | Single Quote / ø
    * \` | Backtick
    * left or right ⌘ key (firefox) | Left or Right Command Key (Firefox)
    * altgr | AltGr
    * < /git > | < /git >
    * GNOME Compose Key | GNOME Compose Key
    * ç | ç
    * XF86Forward | XF86Forward
    * XF86Back | XF86Back
    * alphanumeric | Alphanumeric
    * hiragana/katakana | Hiragana/Katakana
    * half-width/full-width | Half-Width/Full-Width
    * kanji | Kanji
    * toggle touchpad | Toggle Touchpad
     *
     * @title Set Inputs
     * @method setInputs(inputs)
     * @param {object} inputs
     * @memberof KeyboardControls
     */
    setInputs(inputs: Controls): void;
    get options(): Controls;
    private transformDirectionInNumber;
}
export {};
