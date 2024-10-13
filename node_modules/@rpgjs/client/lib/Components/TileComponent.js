import Tile from "../Tilemap/Tile.js";
import TileLayer from "../Tilemap/TileLayer.js";
import { AbstractComponent } from "./AbstractComponent.js";
class TileComponent extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.cacheParams = [];
        this.gid = 0;
    }
    onInit(cell) {
        this.cell = cell;
        if (typeof this.value == 'number') {
            this.gid = this.value;
        }
        else {
            this.gid = this.value.gid;
        }
        this.updateRender({});
        super.onInit(cell);
    }
    updateRender(object) {
        this.removeChildren();
        const height = typeof this.value != 'number' ? this.getValue(object, this.value.height) : null ?? this.cell?.height ?? 0;
        const width = typeof this.value != 'number' ? this.getValue(object, this.value.width) : null ?? this.cell?.width ?? 0;
        const scene = this.component.getScene();
        const tilemap = scene.tilemap;
        const tileset = TileLayer.findTileSet(this.gid, tilemap.tilesets);
        if (tileset) {
            const tile = new Tile({
                gid: this.gid
            }, tileset);
            tile.width = width ?? 0;
            tile.height = height ?? 0;
            this.addChild(tile);
        }
    }
}
TileComponent.id = 'tile';
export { TileComponent };
//# sourceMappingURL=TileComponent.js.map