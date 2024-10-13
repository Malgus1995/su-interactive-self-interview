import { spritesheets } from '../Sprite/Spritesheets.js';
import { Tileset as TiledTilesetClass } from '@rpgjs/tiled';
import { log } from '../Logger.js';
import { Texture, Rectangle } from 'pixi.js';
export default class TileSet extends TiledTilesetClass {
    constructor(tileSet) {
        super(tileSet);
        this.textures = [];
    }
    /** @internal */
    load() {
        const spritesheet = spritesheets.get(this.name);
        if (!spritesheet) {
            throw log(`Impossible to find ${this.name} tileset`);
        }
        this.baseTexture = spritesheet.resource;
        for (let y = this.margin; y < this.image.height; y += this.tileheight + this.spacing) {
            for (let x = this.margin; x < this.image.width; x += this.tilewidth + this.spacing) {
                this.textures.push(new Texture(this.baseTexture, new Rectangle(+x, +y, +this.tilewidth, +this.tileheight)));
            }
        }
    }
}
//# sourceMappingURL=TileSet.js.map