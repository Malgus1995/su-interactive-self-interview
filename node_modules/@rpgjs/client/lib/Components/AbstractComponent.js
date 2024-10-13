import { Subject, filter, takeUntil } from "rxjs";
import get from 'lodash.get';
import { Container } from "pixi.js";
const REGEXP_VAR = /{([^\}]+)}/g;
export class AbstractComponent extends Container {
    constructor(component, value) {
        super();
        this.component = component;
        this.value = value;
        this._onRender$ = new Subject();
        this._onDestroy$ = new Subject();
        this.onRender$ = this._onRender$.asObservable();
        this.game = this.component.game;
        this.firstRender = true;
        this.style = this.value?.style;
        this.cacheText = {};
    }
    getStyle() {
        return this.style || {};
    }
    parseTextAndCache(text) {
        // parse text to get varariable in {} format et cache it
        const matches = text.matchAll(REGEXP_VAR);
        this.cacheParams = [
            ...this.cacheParams,
            ...Array.from(matches).map(match => match[1])
        ];
        return this.cacheParams;
    }
    replaceText(object, text) {
        return text.replace(REGEXP_VAR, (match, key) => {
            const value = get(object, key);
            if (value !== undefined) {
                this.cacheText[key] = value;
                return value ?? '';
            }
            return value ?? this.cacheText[key] ?? '';
        });
    }
    getValue(object, expression) {
        if (typeof expression === 'string') {
            const value = get(object, expression);
            if (value !== undefined) {
                if (this.cacheParams.indexOf(expression) === -1)
                    this.cacheParams.push(expression);
                return value;
            }
        }
        return expression;
    }
    verifyParams() {
        const params = this.component.logic;
        for (const param of this.cacheParams) {
            if (get(params, param) === undefined) {
                throw new Error(`Param ${param} not found in object ${this.component.logic?.id}`);
            }
        }
    }
    onInit(cell) {
        this.cell = cell;
        this.verifyParams();
        const render = (object) => {
            const opacity = this.getValue(object, this.getStyle().opacity || this.value.opacity);
            if (opacity !== undefined) {
                this.alpha = Math.min(opacity, 1);
            }
        };
        render(this.component.logic);
        const objectId = this.component.logic?.id;
        this.game.listenObject(objectId)
            .pipe(takeUntil(this._onDestroy$), filter(object => {
            const params = object?.paramsChanged;
            if (!params)
                return false;
            for (const param of this.cacheParams) {
                if (get(params, param))
                    return true;
            }
            return false;
        }))
            .subscribe(({ object }) => {
            this.updateRender(object, this.firstRender);
            render(object);
            this.firstRender = false;
            this._onRender$.next(this);
        });
    }
    onRemove() {
        this._onDestroy$.next();
        this._onDestroy$.complete();
    }
}
//# sourceMappingURL=AbstractComponent.js.map