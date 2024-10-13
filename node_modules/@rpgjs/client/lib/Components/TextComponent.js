import { Text } from "pixi.js";
import { AbstractComponent } from "./AbstractComponent.js";
class TextComponent extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.cacheParams = [];
        this.container = new Text('');
        this.originValue = '';
    }
    onInit(cell) {
        if (typeof this.value == 'string') {
            this.container.text = this.value;
        }
        else if (this.value.style) {
            this.container.style = this.value.style;
            this.container.text = this.value.text;
        }
        this.container.style = {
            ...this.container.style,
            wordWrapWidth: cell.width
        };
        this.parseTextAndCache(this.container.text);
        this.originValue = this.container.text;
        // first render for replace variable and remove {}
        this.updateRender(this.component.logic);
        this.addChild(this.container);
        super.onInit(cell);
    }
    updateRender(object) {
        this.container.text = this.replaceText(object, this.originValue);
    }
}
TextComponent.id = 'text';
export { TextComponent };
//# sourceMappingURL=TextComponent.js.map