import { useEffect, useRef } from "react";
import Phaser from "phaser";
import mapJsonUrl from "/src/assets/start_map_json.json?url";

export default function IntroCanvas() {
  const gameRef = useRef(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const tilesetNames = [
      "floors_3_simple_S-20C-5",
      "gather_avatars_1.0",
      "gather_chairs_1.3",
      "gather_decoration_1.21",
      "gather_decoration_exterior_1.3",
      "gather_doors_template",
      "gather_exterior_roofs_2.1",
      "gather_exterior_walls_2.1",
      "gather_facade_elements_1.2",
      "gather_floors_1.5",
      "gather_floors_2_exploration",
      "gather_interior_walls_1.6",
      "gather_islands_1.0",
      "gather_plants_1.2",
      "gather_signage_1.2",
      "gather_tables_2.1",
      "gather_terrains_3.a",
      "gather_walls_interior_template",
      "TileAndStone",
      "toppers",
      "trimsanddoors",
      "Wall_unstable",
      "walltexture",
      "WindowsObjects",
    ];

    const config = {
      type: Phaser.AUTO,
      width: 10,            // 임시값 (맵 로드 후 실제 크기로 리사이즈)
      height: 10,
      parent: gameRef.current,
      pixelArt: true,
      backgroundAlpha: 0,   // 렌더러 배경 투명
      scale: {
        mode: Phaser.Scale.NONE, // 내부 자동 스케일 끔 (직접 배치)
      },
      scene: {
        preload() {
          this.load.tilemapTiledJSON("start_map", mapJsonUrl);
          tilesetNames.forEach((name) => {
            const imagePath = new URL(`/src/assets/tiles/${name}.png`, window.location.origin).href;
            this.load.image(`tileset_${name}`, imagePath);
          });
        },
        create() {
          const map = this.make.tilemap({ key: "start_map" });
          const sets = map.tilesets
            .map((ts) => {
              const key = `tileset_${ts.name}`;
              if (this.textures.exists(key))
                return map.addTilesetImage(ts.name, key, ts.tileWidth, ts.tileHeight);
              return null;
            })
            .filter(Boolean);

          map.createLayer("시작점_바닥", sets, 0, 0);
          const objLayer = map.createLayer("시작점_가구", sets, 0, 0);
          objLayer?.setDepth(1);

          const W = map.widthInPixels;
          const H = map.heightInPixels;

          // ✅ 게임/카메라를 맵 크기에 딱 맞춤 → 검은 여백 사라짐
          this.scale.resize(W, H);
          this.cameras.main.setViewport(0, 0, W, H);
          this.cameras.main.setBounds(0, 0, W, H);
          this.cameras.main.setBackgroundColor("rgba(0,0,0,0)"); // 카메라 배경 투명
          this.cameras.main.setZoom(1);                          // 줌은 CSS로 처리
          this.cameras.main.centerOn(W / 2, H / 2);

          // 중앙 고정 + 줌(스케일) 적용
          const applyCenter = () => {
            const canvas = this.game.canvas;
            if (!canvas) return;
            const zoom = 0.6;               // 👉 원하는 줌 (유지)
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const cw = W * zoom;
            const ch = H * zoom;

            canvas.style.position = "absolute";
            canvas.style.left = `${(vw - cw) / 2}px`;
            canvas.style.top = `${(vh - ch) / 2}px`;
            canvas.style.transform = `scale(${zoom})`;
            canvas.style.transformOrigin = "top left";
            canvas.style.background = "transparent";
            canvas.style.display = "block";
          };

          applyCenter();
          window.addEventListener("resize", applyCenter);
          this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            window.removeEventListener("resize", applyCenter);
          });
        },
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div
      ref={gameRef}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "transparent",
      }}
    />
  );
}
