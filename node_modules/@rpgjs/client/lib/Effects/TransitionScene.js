import { RpgClientEngine } from "../RpgClientEngine.js";
import { Timeline } from "./Timeline.js";
export class TransitionScene {
    constructor(context, container) {
        this.context = context;
        this.container = container;
        this.frameIndex = 0;
        this.animations = [];
        this.complete = () => { };
        this.clientEngine = this.context.inject(RpgClientEngine);
    }
    addFadeIn() {
        return this.addFading(1, 0);
    }
    addFadeOut() {
        return this.addFading(0, 1);
    }
    addFading(from, to) {
        this.animations = new Timeline()
            .add(15, ({ opacity }) => [{
                opacity
            }], {
            opacity: {
                from,
                to
            }
        })
            .create();
        return this;
    }
    onComplete(cb) {
        this.complete = cb;
        return this;
    }
    start() {
        this.updateSubscription = this.clientEngine.tick.subscribe(() => this.update());
    }
    update() {
        const animationFrame = this.animations[this.frameIndex];
        if (!animationFrame) {
            this.complete();
            this.updateSubscription.unsubscribe();
            return;
        }
        const frame = animationFrame[0];
        this.container.alpha = frame.opacity;
        this.frameIndex++;
    }
}
//# sourceMappingURL=TransitionScene.js.map