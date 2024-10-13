import { AnimatedSprite, groupD8 } from "pixi.js";
export default class Tile extends AnimatedSprite {
    static getTextures(tile, tileSet) {
        const textures = [];
        if (tile.animations && tile.animations.length) {
            tile.animations.forEach(frame => {
                textures.push(tileSet.textures[frame.tileid].clone());
            });
        }
        else {
            textures.push(tileSet.textures[tile.gid - tileSet.firstgid].clone());
        }
        return textures;
    }
    constructor(tile, tileSet) {
        super(Tile.getTextures(tile, tileSet));
        this.tile = tile;
        this.tileSet = tileSet;
        this.animations = [];
        this._x = 0;
        this._y = 0;
        this.properties = {};
        this.animations = tile.animations || [];
        this.properties = tile.properties;
        this.textures = Tile.getTextures(tile, tileSet);
        this.texture = this.textures[0];
        this.flip();
    }
    get gid() {
        return this.tile.gid;
    }
    setAnimation(frame) {
        const size = this.animations.length;
        if (size > 1) {
            const offset = (this.animations[1].tileid - this.animations[0].tileid) * this.width;
            frame.tileAnimX(offset, size);
        }
    }
    flip() {
        let symmetry;
        let i = 0;
        const add = (symmetrySecond) => {
            i++;
            if (symmetry)
                symmetry = groupD8.add(symmetry, symmetrySecond);
            else
                symmetry = symmetrySecond;
        };
        if (this.tile.horizontalFlip) {
            add(groupD8.MIRROR_HORIZONTAL);
        }
        if (this.tile.verticalFlip) {
            add(groupD8.MIRROR_VERTICAL);
        }
        if (this.tile.diagonalFlip) {
            if (i % 2 == 0) {
                add(groupD8.MAIN_DIAGONAL);
            }
            else {
                add(groupD8.REVERSE_DIAGONAL);
            }
        }
        if (symmetry)
            this.texture.rotate = symmetry;
    }
}
//# sourceMappingURL=Tile.js.map