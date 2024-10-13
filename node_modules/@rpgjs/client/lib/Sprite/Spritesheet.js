export function Spritesheet(options) {
    return (target) => {
        if ('images' in options)
            target['images'] = options.images;
        if ('id' in options)
            target['id'] = options.id;
        for (let key in options) {
            target.prototype[key] = options[key];
        }
        return;
    };
}
//# sourceMappingURL=Spritesheet.js.map