import { useEffect, useRef } from "react";
import Phaser from "phaser";
import csvUrl from "/src/assets/start_point.csv?url";
import tileUrl from "/src/assets/start_point.png?url";

export default function IntroCanvas() {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      pixelArt: true,
      physics: { default: "arcade" },
      scene: {
        preload() {
          // ✅ CSV 파일과 타일셋 이미지 로드
          this.load.tilemapCSV("start_point_map", csvUrl);
          this.load.image("tiles", tileUrl);
        },

        create() {
          // ✅ 맵과 타일셋 생성
          const map = this.make.tilemap({
            key: "start_point_map",
            tileWidth: 32,
            tileHeight: 32,
          });

          const tileset = map.addTilesetImage("tiles");
          const layer = map.createLayer(0, tileset, 0, 0);

          // ✅ 카메라 설정
          this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
          this.cameras.main.centerOn(map.widthInPixels / 2, map.heightInPixels / 2);
          this.cameras.main.setZoom(2);
          this.cameras.main.setBackgroundColor("#000000");

          console.log("✅ CSV Map Loaded Successfully:", map);
        },
      },
    };

    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, []);

  return <div ref={gameRef}></div>;
}
