import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import mapJson from "/src/assets/start_map_json.json";
import playerPng from "/src/assets/tiles/player.png";
import SecondCanvas from "./SecondCanvas";

export default function IntroCanvas({ topOffset = 140 }) {
  const gameRef = useRef(null);
  const [enteredSecondRoom, setEnteredSecondRoom] = useState(false);

  useEffect(() => {
    if (!gameRef.current || enteredSecondRoom) return;
    let destroyed = false;
    let game;

    // ✅ 반응형 세로형 (9:16) 비율 계산
    const getBaseSize = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const baseHeight = Math.min(vh * 0.8, 900); // 화면 높이 80% 사용
      const baseWidth = Math.round(baseHeight * 9 / 16); // 9:16 비율 유지
      return { baseWidth, baseHeight };
    };

    const { baseWidth, baseHeight } = getBaseSize();

    const config = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      pixelArt: true,
      transparent: true,
      physics: { default: "arcade", arcade: { debug: false } },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: baseWidth,
        height: baseHeight,
      },
      scene: {
        preload() {
          // ✅ 리소스 로드
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
          // ✅ 타일맵 구성
          const map = this.make.tilemap({ key: "start_map" });
          const sets = map.tilesets.map((ts) =>
            map.addTilesetImage(ts.name, `tileset_${ts.name}`)
          );

          const layers = {};
          map.layers.forEach((l) => {
            layers[l.name] = map.createLayer(l.name, sets, 0, 0);
          });

          // ✅ 오브젝트 로드
          const spawn = map.findObject("interactables", (o) => o.name === "init_point");
          const startDoor = map.findObject("interactables", (o) => o.name === "start_door");

          const player = this.physics.add.sprite(spawn.x, spawn.y - 16, "player");
          player.setOrigin(0.5, 1);

          // ✅ 애니메이션 정의
          const directions = { down: [0, 2], right: [6, 8], left: [12, 14], up: [18, 20] };
          Object.entries(directions).forEach(([key, [start, end]]) =>
            this.anims.create({
              key,
              frames: this.anims.generateFrameNumbers("player", { start, end }),
              frameRate: 8,
              repeat: -1,
            })
          );

          // ✅ 카메라 & 이동
          const cursors = this.input.keyboard.createCursorKeys();
          const cam = this.cameras.main;
          cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
          cam.startFollow(player, true, 0.1, 0.1);
          cam.setZoom(1.2);

          const moveSpeed = 150;
          let moveTarget = null;

          this.input.on("pointerdown", (pointer) => {
            const worldPoint = pointer.positionToCamera(cam);
            moveTarget = { x: worldPoint.x, y: worldPoint.y };
          });

          // ✅ 충돌 및 투명 처리
          const treeLayer = layers["시작점_나무"];
          const furnitureLayer = layers["시작점_가구"];

          if (furnitureLayer) {
            furnitureLayer.setCollisionByExclusion([-1]);
            this.physics.add.collider(player, furnitureLayer);
          }

          // ✅ 근처 나무만 반투명 처리
          const checkTransparency = () => {
            if (!treeLayer) return;
            const px = player.x, py = player.y;
            const tileX = Math.floor(px / 32);
            const tileY = Math.floor(py / 32);

            let overlapping = false;
            for (let y = tileY - 1; y <= tileY + 1; y++) {
              for (let x = tileX - 1; x <= tileX + 1; x++) {
                const tile = treeLayer.getTileAt(x, y);
                if (tile && tile.index !== -1) {
                  const tileRect = tile.getBounds();
                  const playerRect = player.getBounds();
                  if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, tileRect)) {
                    overlapping = true;
                    break;
                  }
                }
              }
            }
            treeLayer.setAlpha(overlapping ? 0.5 : 1);
          };

          // ✅ 업데이트 루프
          this.update = () => {
            if (destroyed) return;
            player.setVelocity(0);

            const moveByKey = () => {
              if (cursors.left.isDown) {
                player.setVelocityX(-moveSpeed);
                player.anims.play("left", true);
                return true;
              } else if (cursors.right.isDown) {
                player.setVelocityX(moveSpeed);
                player.anims.play("right", true);
                return true;
              } else if (cursors.up.isDown) {
                player.setVelocityY(-moveSpeed);
                player.anims.play("up", true);
                return true;
              } else if (cursors.down.isDown) {
                player.setVelocityY(moveSpeed);
                player.anims.play("down", true);
                return true;
              }
              return false;
            };

            if (!moveByKey()) {
              if (moveTarget) {
                const dx = moveTarget.x - player.x;
                const dy = moveTarget.y - player.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 5) {
                  moveTarget = null;
                  player.anims.stop();
                } else {
                  const angle = Math.atan2(dy, dx);
                  player.setVelocity(Math.cos(angle) * moveSpeed, Math.sin(angle) * moveSpeed);
                  player.anims.play(
                    Math.abs(dx) > Math.abs(dy)
                      ? dx > 0
                        ? "right"
                        : "left"
                      : dy > 0
                      ? "down"
                      : "up",
                    true
                  );
                }
              } else player.anims.stop();
            }

            checkTransparency();

            // ✅ 문 진입
            if (startDoor) {
              const doorDist = Phaser.Math.Distance.Between(player.x, player.y, startDoor.x, startDoor.y);
              if (doorDist < 40 && !destroyed) {
                destroyed = true;
                setEnteredSecondRoom(true);
                this.game.destroy(true);
              }
            }
          };
        },

        update() {
          this.update && this.update();
        },
      },
    };

    game = new Phaser.Game(config);

    // ✅ resize 최적화
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!game) return;
        const { baseWidth, baseHeight } = getBaseSize();
        game.scale.resize(baseWidth, baseHeight);
        game.scale.refresh();
      }, 200);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      destroyed = true;
      if (game) game.destroy(true);
      window.removeEventListener("resize", handleResize);
    };
  }, [enteredSecondRoom]);

  if (enteredSecondRoom) return <SecondCanvas />;

  // ✅ 부모 컨테이너에서 주어진 공간 꽉 채우기
  return (
    <div
      ref={gameRef}
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
}
