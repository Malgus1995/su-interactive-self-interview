import { Sprite } from "pixi.js";
import { AbstractComponent } from "./AbstractComponent.js";
class ImageComponent extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.cacheParams = [];
        this.source = '';
    }
    onInit(cell) {
        super.onInit(cell);
        this.setImage();
    }
    setImage() {
        if (typeof this.value == 'string') {
            this.source = this.value;
        }
        else {
            this.source = this.value.source;
        }
        this.updateRender({});
    }
    updateRender(object) {
        this.removeChildren();
        const engine = this.component.getScene().game.clientEngine;
        this.addChild(Sprite.from(engine.getResourceUrl(this.source)));
    }
}
ImageComponent.id = 'image';
export { ImageComponent };
//# sourceMappingURL=ImageComponent.js.map