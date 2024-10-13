export function Sound(options) {
    return (target) => {
        if ('sounds' in options)
            target['sounds'] = options.sounds;
        if ('id' in options)
            target['id'] = options.id;
        for (let key in options) {
            target.prototype[key] = options[key];
        }
    };
}
//# sourceMappingURL=Sound.js.map