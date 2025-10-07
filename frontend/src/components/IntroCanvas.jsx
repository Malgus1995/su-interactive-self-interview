import { useEffect, useRef } from "react";
import Phaser from "phaser";

export default function IntroCanvas() {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      physics: { default: "arcade" },
      scene: {
        preload() {
          this.load.image("tiles", "/assets/tileset.png");
          this.load.tilemapTiledJSON("map", "/assets/map.json");
        },
        create() {
          const map = this.make.tilemap({ key: "map" });
          const tileset = map.addTilesetImage("tileset", "tiles");
          map.createLayer("Ground", tileset);
        },
      },
    };

    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, []);

  return <div ref={gameRef} />;
}
