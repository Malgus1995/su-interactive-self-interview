import { Utils } from "@rpgjs/common";
import { AbstractComponent } from "./AbstractComponent.js";
import { Graphics } from "pixi.js";
class DebugComponent extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.color = '#ff0000';
        this.cacheParams = ['map', 'position.x', 'position.y'];
        this.container = new Graphics();
    }
    onInit(cell) {
        this.addChild(this.container);
        this.updateRender(this.component.logic);
        this.eventMode = 'static';
        this.on('pointerdown', () => {
            console.log(this.component.logic);
        });
        super.onInit(cell);
    }
    updateRender(object) {
        const hitbox = object.hitbox;
        const { pos, w, h } = hitbox;
        this.container.clear();
        const { value: color, alpha } = Utils.hexaToNumber(this.color);
        this.container.beginFill(color, alpha);
        this.container.drawRect(0, 0, w, h);
        this.container.endFill();
    }
}
DebugComponent.id = 'debug';
export { DebugComponent };
//# sourceMappingURL=DebugComponent.js.map