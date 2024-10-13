import { HookClient, RpgPlugin, RpgShape, Utils } from "@rpgjs/common";
import { PlayerType } from "@rpgjs/types";
import { Subject, map, filter, tap, distinctUntilChanged, takeUntil, finalize } from "rxjs";
import { log } from "../Logger.js";
import { RpgSprite } from "../Sprite/Player.js";
import { BarComponent } from "./BarComponent.js";
import { ShapeComponent } from "./ShapeComponent.js";
import { DebugComponent } from "./DebugComponent.js";
import { ImageComponent } from "./ImageComponent.js";
import { TextComponent } from "./TextComponent.js";
import { TileComponent } from "./TileComponent.js";
import { Container, Sprite } from "pixi.js";
const layoutObject = {
    lines: []
};
const layoutTypes = ['top', 'bottom', 'left', 'right'];
export class RpgComponent extends Container {
    constructor(data, scene) {
        super();
        this.data = data;
        this.scene = scene;
        /** @internal */
        this.h = 1;
        /** @internal */
        this.w = 1;
        this.animationIsPlaying = false;
        this._x = 0;
        this._y = 0;
        this._rotation = 0;
        this.teleported = 0;
        this.map = '';
        this.z = 0;
        this.fixed = false;
        this.components = {
            top: layoutObject,
            bottom: layoutObject,
            left: layoutObject,
            right: layoutObject,
            center: layoutObject
        };
        this.direction = 0;
        this.container = new Container();
        this.containersLayout = {};
        this.layoutNotifierClear = {
            top: new Subject(),
            bottom: new Subject(),
            left: new Subject(),
            right: new Subject(),
            center: new Subject()
        };
        this.registerComponents = new Map();
        this.game = this.scene.game;
        this.id = this.data.id;
        this.setPosition(false);
        this.registerComponents.set(RpgSprite.id, RpgSprite);
        this.registerComponents.set(TextComponent.id, TextComponent);
        this.registerComponents.set(ShapeComponent.id, ShapeComponent);
        this.registerComponents.set(TileComponent.id, TileComponent);
        this.registerComponents.set(ImageComponent.id, ImageComponent);
        this.registerComponents.set(BarComponent.id, BarComponent);
        this.registerComponents.set(DebugComponent.id, DebugComponent);
        this.addChild(this.container);
        for (let layout of [...layoutTypes, 'center']) {
            this.containersLayout[layout] = new Container();
            this.container.addChild(this.containersLayout[layout]);
        }
        RpgPlugin.emit(HookClient.AddSprite, this);
        RpgPlugin.emit(HookClient.SceneAddSprite, [this.scene, this], true);
        this.game.listenObject(data.id)
            .pipe(takeUntil(this.game.getDeleteNotifier(data.id)), map(object => object?.paramsChanged), tap(() => {
            RpgPlugin.emit(HookClient.ChangesSprite, [this, this.logic?.['paramsChanged'], this.logic?.['prevParamsChanged']], true);
        }), filter(object => {
            return this.logic?.['componentChanged'];
        }))
            .subscribe((val) => {
            if (this.logic) {
                this.updateComponents(this.logic?.['componentChanged']);
                this.logic['componentChanged'] = undefined;
            }
        });
    }
    /**
     * the direction of the sprite
     *
     * @prop {Direction} dir
     * @readonly
     * @memberof RpgSprite
     * */
    get dir() {
        return this.direction;
    }
    /**
    * To know if the sprite is a player
    *
    * @prop {boolean} isPlayer
    * @readonly
    * @memberof RpgSprite
    * */
    get isPlayer() {
        return this.data.type == PlayerType.Player;
    }
    /**
     * To know if the sprite is an event
     *
     * @prop {boolean} isEvent
     * @readonly
     * @memberof RpgSprite
     * */
    get isEvent() {
        return this.data.type == PlayerType.Event;
    }
    /**
     * To know if the sprite is a shape
     *
     * @prop {boolean} isShape
     * @since 3.0.0-rc
     * @readonly
     * @memberof RpgSprite
     * */
    get isShape() {
        return Utils.isInstanceOf(this.data, RpgShape);
    }
    /**
     * To know if the sprite is the sprite controlled by the player
     *
     * @prop {boolean} isCurrentPlayer
     * @readonly
     * @memberof RpgSprite
     * */
    get isCurrentPlayer() {
        return this.data.id === this.scene.game.playerId;
    }
    /**
     * Retrieves the logic of the sprite
     *
     * @prop {RpgSpriteLogic} logic
     * @readonly
     * @since 3.0.0-beta.4
     * @memberof RpgSprite
     * */
    get logic() {
        return this.scene.game.world.getAll(this.data.id);
    }
    get guiDisplay() {
        return this.logic.guiDisplay;
    }
    set guiDisplay(val) {
        this.logic.guiDisplay = val;
        this.game.setObject(this.logic?.id, {
            object: this.logic,
            paramsChanged: {
                guiDisplay: val
            }
        });
    }
    setPosition(smooth = true) {
        if (this.isShape) {
            const { width, height, x, y } = this.data;
            this.w = width;
            this.h = height;
            this._x = Math.floor(x);
            this._y = Math.floor(y);
        }
        else {
            const { position, direction } = this.data;
            this._x = position?.x ?? 0;
            this._y = position?.y ?? 0;
            this.z = position?.z ?? 0;
            this.direction = direction;
        }
        this._rotation = this.data['rotation'] ?? 0;
        if (!smooth) {
            this.x = this._x;
            this.y = this._y;
            this.angle = this._rotation;
        }
    }
    // TODO
    /*drag() {
        this.interactive = true
        const filter = new filters.ColorMatrixFilter();

        const onDragEnd = () => {
            if (!this.dragMode) return
            this.dragMode.dragging = false
            this.dragMode.data = null
        }

        this
            .on('pointerdown', (event) => {
                this.dragMode = {
                    data: event.data,
                    dragging: true
                }
            })
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', () => {
                if (!this.dragMode) return
                const { dragging, data } = this.dragMode
                if (dragging) {
                    const newPosition = data.getLocalPosition(this.parent)
                    this.x = newPosition.x
                    this.y = newPosition.y
                }
            })
    }*/
    update(obj, objChanged, time, deltaRatio) {
        if (this.dragMode?.dragging)
            return { moving: true };
        const { speed, teleported, map, fixed } = obj;
        this.data = obj;
        this.setPosition();
        const renderSpeed = speed * deltaRatio;
        if (this._rotation != this.angle) {
            this.angle += Math.min(renderSpeed, this._rotation - this.angle);
        }
        let moving = obj.moving ?? false;
        if (!fixed) {
            if (teleported != this.teleported || map != this.map) {
                this.x = this._x;
                this.y = this._y;
                this.teleported = teleported;
                this.map = map;
            }
            this.parent.parent.zIndex = this._y;
            obj.posX = this._x;
            obj.posY = this._y;
            if (this._x > this.x) {
                this.x += Math.min(renderSpeed, this._x - this.x);
                moving = true;
            }
            if (this._x < this.x) {
                this.x -= Math.min(renderSpeed, this.x - this._x);
                moving = true;
            }
            if (this._y > this.y) {
                this.y += Math.min(renderSpeed, this._y - this.y);
                moving = true;
            }
            if (this._y < this.y) {
                this.y -= Math.min(renderSpeed, this.y - this._y);
                moving = true;
            }
        }
        this.callMethodInComponents('update', [obj, { moving }, deltaRatio]);
        this.onUpdate(obj);
        return {
            moving
        };
    }
    showAnimation(graphic, animationName) {
        return this.callMethodInComponents('showAnimation', [graphic, animationName]);
    }
    /**
    * Recover the position according to the graphic
    * Normally, the position is that of the hitbox but, we retrieve the top left corner of the graphic
    *
    * You can also pass the `middle` value as first parameter to retrieve the positions from the middle of the sprite
    *
    * @title Get Positions of Graphic
    * @method sprite.getPositionsOfGraphic(align)
    * @param {string} [align] middle
    * @returns { x: number, y: number }
    * @memberof RpgSprite
    */
    getPositionsOfGraphic(align) {
        let sprite;
        // if no component (no graphic for example)
        if (this.components.center?.lines.length !== 0) {
            sprite = this.containersLayout.center.getChildAt(0);
        }
        const isMiddle = align == 'middle';
        return {
            x: this.x - this.w * (sprite?.anchor.x ?? 1) + (isMiddle ? this.w / 2 : 0),
            y: this.y - this.h * (sprite?.anchor.y ?? 1) + (isMiddle ? this.h / 2 : 0)
        };
    }
    /**
     * Get the container by position (center, left, right, top, bottom)
     *
     * @param {LayoutPositionEnum} [position=center]
     * @returns {PIXI.Container}
     *
     * */
    getLayoutContainer(position = 'center') {
        return this.containersLayout[position];
    }
    /**
     * Get Current Scene. Scene is a map, battle, menu, etc.
     * @returns {T}
     */
    getScene() {
        return this.scene;
    }
    // Hooks
    onInit() { }
    onUpdate(obj) { }
    onMove() { }
    onChanges(data, old) { }
    callMethodInComponents(name, params) {
        for (let component of this.getLayoutContainer().children) {
            if (component[name])
                component[name](...params);
        }
    }
    createGrid(position, gridArray, options, sprite) {
        const gridContainer = new Sprite();
        const { height, spriteWidth, spriteHeight } = sprite;
        const width = options.width ?? spriteWidth ?? sprite.width;
        const gridHeight = options.height ?? 20;
        const hitBoxWidth = this.logic?.hitbox.w ?? 0;
        const middleWidth = hitBoxWidth / 2 - width / 2;
        const posX = gridContainer.x + (options.marginLeft ?? 0) - (options.marginRight ?? 0);
        const posY = gridContainer.y + (this.logic?.hitbox.h ?? 0) + (options.marginTop ?? 0) - (options.marginBottom ?? 0);
        switch (position) {
            case 'top':
                gridContainer.x = posX + middleWidth;
                gridContainer.y = posY - spriteHeight;
                gridContainer.y -= (gridArray.length * gridHeight);
                break;
            case 'bottom':
                gridContainer.x = posX + middleWidth;
                gridContainer.y = posY;
                break;
            case 'left':
                gridContainer.x = posX - width - (hitBoxWidth < spriteWidth ? hitBoxWidth / 2 : 0);
                gridContainer.y = posY - spriteHeight;
                break;
            case 'right':
                gridContainer.x = posX + width + (hitBoxWidth > spriteWidth ? hitBoxWidth / 2 : 0);
                gridContainer.y = posY - spriteHeight;
        }
        for (let y = 0; y < gridArray.length; y++) {
            const columns = gridArray[y].col.length;
            const cellWidth = (width / columns);
            for (let x = 0; x < columns; x++) {
                const params = gridArray[y].col[x];
                const component = this.applyComponent(params);
                component.onRender$
                    .pipe(takeUntil(this.layoutNotifierClear[position]), finalize(() => {
                    component.onRemove();
                }))
                    .subscribe(() => {
                    component.x = Math.round((x * cellWidth) + (cellWidth / 2) - (component.width / 2));
                    component.y = Math.round((y * gridHeight) + (gridHeight / 2) - (component.height / 2));
                });
                component.onInit({
                    width: cellWidth,
                    height: gridHeight
                });
                gridContainer.addChild(component);
            }
        }
        return gridContainer;
    }
    applyComponent(component) {
        const compClass = this.registerComponents.get(component.id);
        if (!compClass) {
            throw log(`Impossible to find ${component.id} component`);
        }
        return new compClass(this, component.value);
    }
    createComponentCenter(components) {
        const lines = components.center?.lines || [];
        this.getLayoutContainer().removeChildren();
        for (let { col } of lines) {
            for (let component of col) {
                const instance = this.applyComponent(component);
                if (instance.onInit)
                    instance.onInit({
                        width: this.logic?.width ?? this.width,
                        height: this.logic?.height ?? this.height
                    });
                this.getLayoutContainer().addChild(instance);
            }
        }
        this.components = components;
    }
    refreshComponents(components, sprite) {
        for (let type of layoutTypes) {
            const layout = components[type];
            if (layout?.lines) {
                const layoutContainer = this.getLayoutContainer(type);
                layoutContainer.removeChildren();
                this.layoutNotifierClear[type].next();
                layoutContainer.addChild(this.createGrid(type, layout.lines, layout, sprite));
            }
        }
    }
    updateComponents(components) {
        const graphicChanged = !!components.center?.lines;
        if (graphicChanged) {
            this.createComponentCenter(components);
        }
        if (this.subscriptionGraphic)
            this.subscriptionGraphic.unsubscribe();
        const child = this.getLayoutContainer().children[0];
        if (child instanceof RpgSprite) {
            this.subscriptionGraphic = child.animationSprite()
                .pipe(takeUntil(this.game.getDeleteNotifier(this.id)), filter((sprite) => sprite), distinctUntilChanged((p, q) => p.width === q.width &&
                p.height === q.height &&
                p.anchor.x === q.anchor.x &&
                p.anchor.y === q.anchor.y))
                .subscribe((sprite) => {
                this.refreshComponents(components, sprite);
            });
        }
        else {
            this.refreshComponents(components, {
                width: this.data.width,
                height: this.data.height,
                anchor: {
                    x: 0,
                    y: 0
                },
                x: 0,
                y: 0,
                spriteHeight: this.data.height,
                spriteWidth: this.data.width
            });
        }
    }
}
//# sourceMappingURL=Component.js.map