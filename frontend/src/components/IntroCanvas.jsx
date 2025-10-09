import { useEffect, useRef } from "react";
import Phaser from "phaser";
import mapJson from "/src/assets/start_map_json.json";
import playerPng from "/src/assets/tiles/player.png";

export default function IntroCanvas() {
  const gameRef = useRef(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      pixelArt: true,
      transparent: true,
      physics: { default: "arcade", arcade: { debug: false } },
      scale: { mode: Phaser.Scale.RESIZE },
      scene: {
        preload() {
          this.load.tilemapTiledJSON("start_map", mapJson);
          mapJson.tilesets.forEach((ts) => {
            this.load.image(`tileset_${ts.name}`, `/src/assets/${ts.image}`);
          });
          this.load.spritesheet("player", playerPng, {
            frameWidth: 32,
            frameHeight: 32,
          });
        },

        create() {
          const map = this.make.tilemap({ key: "start_map" });
          const sets = map.tilesets
            .map((ts) => {
              const key = `tileset_${ts.name}`;
              return this.textures.exists(key)
                ? map.addTilesetImage(ts.name, key)
                : null;
            })
            .filter(Boolean);

          const layers = {};
          map.layers.forEach((l) => {
            const layer = map.createLayer(l.name, sets, 0, 0);
            layer.visible = true;
            layers[l.name] = layer;
          });

          // ✅ 플레이어 생성
          const spawn = map.findObject(
            "interactables",
            (o) => o.name === "init_point"
          );
          const player = this.physics.add.sprite(spawn.x, spawn.y - 16, "player");
          player.setOrigin(0.5, 1);
          player.setCollideWorldBounds(true);

          // ✅ 충돌 (가구)
          if (layers["시작점_가구"]) {
            layers["시작점_가구"].setCollisionByExclusion([-1]);
            this.physics.add.collider(player, layers["시작점_가구"]);
          }

          // ✅ 이동 애니메이션
          this.anims.create({
            key: "down",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1,
          });
          this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("player", { start: 12, end: 14 }),
            frameRate: 8,
            repeat: -1,
          });
          this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("player", { start: 6, end: 8 }),
            frameRate: 8,
            repeat: -1,
          });
          this.anims.create({
            key: "up",
            frames: this.anims.generateFrameNumbers("player", { start: 18, end: 20 }),
            frameRate: 8,
            repeat: -1,
          });

          const cursors = this.input.keyboard.createCursorKeys();
          const cam = this.cameras.main;
          cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
          cam.startFollow(player, true, 0.1, 0.1);
          cam.setBackgroundColor("rgba(0,0,0,0)");

          // ✅ 나무 레이어 참조
          const treeLayer = layers["시작점_나무"];

          // ✅ 클릭/터치 이동 목표 좌표
          let moveTarget = null;
          const moveSpeed = 150;

          this.input.on("pointerdown", (pointer) => {
            // 클릭 또는 터치 좌표를 맵 기준으로 변환
            const worldPoint = pointer.positionToCamera(cam);
            moveTarget = { x: worldPoint.x, y: worldPoint.y };
          });

          // ✅ 반응형 중앙 확대
          const resizeAndCenter = () => {
            const canvas = this.game.canvas;
            if (!canvas) return;
            const W = map.widthInPixels;
            const H = map.heightInPixels;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const scaleX = vw / W;
            const scaleY = vh / (H * 0.8);
            const zoom = Math.min(scaleX, scaleY) * 1.2;
            cam.setZoom(zoom);
            cam.centerOn(W / 2, H / 2);
            canvas.style.position = "absolute";
            canvas.style.left = `${(vw - W * zoom) / 2}px`;
            canvas.style.top = `${(vh - H * zoom) / 2}px`;
            canvas.style.background = "transparent";
          };
          resizeAndCenter();
          window.addEventListener("resize", resizeAndCenter);
          this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            window.removeEventListener("resize", resizeAndCenter);
          });

          // ✅ 매 프레임 갱신
          this.update = () => {
            player.setVelocity(0);

            // 키보드 이동 우선
            if (cursors.left.isDown) {
              player.setVelocityX(-moveSpeed);
              player.anims.play("left", true);
              moveTarget = null;
            } else if (cursors.right.isDown) {
              player.setVelocityX(moveSpeed);
              player.anims.play("right", true);
              moveTarget = null;
            } else if (cursors.up.isDown) {
              player.setVelocityY(-moveSpeed);
              player.anims.play("up", true);
              moveTarget = null;
            } else if (cursors.down.isDown) {
              player.setVelocityY(moveSpeed);
              player.anims.play("down", true);
              moveTarget = null;
            }
            // ✅ 클릭/터치 이동 처리
            else if (moveTarget) {
              const dx = moveTarget.x - player.x;
              const dy = moveTarget.y - player.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < 5) {
                moveTarget = null;
                player.anims.stop();
              } else {
                const angle = Math.atan2(dy, dx);
                const vx = Math.cos(angle) * moveSpeed;
                const vy = Math.sin(angle) * moveSpeed;
                player.setVelocity(vx, vy);

                // 방향 애니메이션
                if (Math.abs(dx) > Math.abs(dy)) {
                  player.anims.play(dx > 0 ? "right" : "left", true);
                } else {
                  player.anims.play(dy > 0 ? "down" : "up", true);
                }
              }
            } else {
              player.anims.stop();
            }

            // ✅ 나무 투명 처리 (충돌 기반)
            if (treeLayer) {
              const playerRect = player.getBounds();
              let overlapping = false;
              treeLayer.forEachTile((tile) => {
                if (tile.index === -1) return;
                const tileRect = tile.getBounds();
                if (
                  Phaser.Geom.Intersects.RectangleToRectangle(playerRect, tileRect)
                ) {
                  overlapping = true;
                }
              });
              treeLayer.setAlpha(overlapping ? 0.5 : 1);
            }
          };
        },

        update() {
          this.update && this.update();
        },
      },
    };

    const game = new Phaser.Game(config);
    return () => game.destroy(true);
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
