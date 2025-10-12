import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import secondRoomJson from "/src/assets/second_room.json";
import playerPng from "/src/assets/tiles/player.png";
import ThirdCanvas from "./ThirdCanvas";
import IntroCanvas from "./IntroCanvas";

export default function SecondCanvas() {
  const gameRef = useRef(null);
  const [enteredThirdRoom, setEnteredThirdRoom] = useState(false);
  const [goBackToFirstRoom, setGoBackToFirstRoom] = useState(false);

  useEffect(() => {
    if (!gameRef.current || enteredThirdRoom) return;
    let destroyed = false;
    let game;

    const getBaseSize = () => {
      const vh = window.innerHeight;
      const baseHeight = Math.min(vh * 0.8, 900);
      const baseWidth = Math.round((baseHeight * 9) / 16);
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
      fps: { target: 60 },
      scene: {
        preload() {
          if (!this.cache.tilemap.exists("second_room"))
            this.load.tilemapTiledJSON("second_room", secondRoomJson);
          if (!this.textures.exists("player")) {
            this.load.spritesheet("player", playerPng, {
              frameWidth: 32,
              frameHeight: 32,
            });
          }
          secondRoomJson.tilesets.forEach((ts) => {
            const key = `tileset_${ts.name}`;
            if (!this.textures.exists(key))
              this.load.image(key, `/src/assets/${ts.image}`);
          });
        },

        create() {
          const map = this.make.tilemap({ key: "second_room" });
          const sets = map.tilesets.map((ts) =>
            map.addTilesetImage(ts.name, `tileset_${ts.name}`)
          );

          const layers = {};
          map.layers.forEach((l) => {
            if (!l.visible) return;
            layers[l.name] = map.createLayer(l.name, sets, 0, 0);
          });

          // ✅ 충돌 레이어
          const collidableNames = ["인물", "두번째방_나무", "두번째방_조형물"];
          const collidableLayers = [];
          collidableNames.forEach((n) => {
            const layer = layers[n];
            if (layer) {
              layer.setCollisionByExclusion([-1]);
              collidableLayers.push(layer);
            }
          });

          // ✅ 스폰 및 출구 포인트
          const spawn =
            map.findObject("interactions", (o) => o.name === "init_point") ||
            { x: map.widthInPixels / 2, y: map.heightInPixels / 2 };

          const nextDoor = map.findObject(
            "interactions",
            (o) => o.name === "next_door"
          );

          const prevDoor = map.findObject(
            "interactions",
            (o) => o.name === "prev_room_point"
          );

          const player = this.physics.add.sprite(spawn.x, spawn.y - 16, "player");
          player.setOrigin(0.5, 1);

          collidableLayers.forEach((l) => this.physics.add.collider(player, l));

          // ✅ 카메라
          const cam = this.cameras.main;
          cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
          cam.startFollow(player, true, 0.15, 0.15);
          cam.setZoom(1.2);

          // ✅ 애니메이션
          const dirs = { down: [0, 2], right: [6, 8], left: [12, 14], up: [18, 20] };
          Object.entries(dirs).forEach(([k, [s, e]]) => {
            if (!this.anims.exists(k))
              this.anims.create({
                key: k,
                frames: this.anims.generateFrameNumbers("player", { start: s, end: e }),
                frameRate: 8,
                repeat: -1,
              });
          });

          const cursors = this.input.keyboard.createCursorKeys();
          const moveSpeed = 150;
          let moveTarget = null;

          this.input.on("pointerdown", (p) => {
            const world = p.positionToCamera(cam);
            moveTarget = { x: world.x, y: world.y };
          });

          // ✅ 업데이트 루프
          this.update = () => {
            if (destroyed) return;
            player.setVelocity(0);

            const move = () => {
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

            if (!move()) {
              if (moveTarget) {
                const dx = moveTarget.x - player.x;
                const dy = moveTarget.y - player.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 5) {
                  moveTarget = null;
                  player.anims.stop();
                } else {
                  const ang = Math.atan2(dy, dx);
                  player.setVelocity(Math.cos(ang) * moveSpeed, Math.sin(ang) * moveSpeed);
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

            // ✅ 이전 방 진입 트리거 (prev_room_point)
            if (prevDoor) {
            // 중심점 계산
            const prevX = prevDoor.x + (prevDoor.width || 32) / 2;
            const prevY = prevDoor.y + (prevDoor.height || 32);

            // 💡 X방향으로도 넓게 감지 (좌우 여유 범위 추가)
            const inHorizontalRange =
                player.x > prevDoor.x - 64 && player.x < prevDoor.x + (prevDoor.width || 32) + 64;

            // 💡 Y방향도 완화
            const inVerticalRange = Math.abs(player.y - prevY) < 40;

            if (inHorizontalRange && inVerticalRange && !destroyed) {
                console.log("🚪 prev_room_point 접근 감지됨 → 첫 번째 방으로 이동");
                destroyed = true;
                setTimeout(() => {
                setGoBackToFirstRoom(true);
                this.game.destroy(true);
                }, 100);
            }
            }






            // ✅ 문 접근 감지 → 다음 방 진입
            if (nextDoor) {
              const doorDist = Phaser.Math.Distance.Between(
                player.x,
                player.y,
                nextDoor.x,
                nextDoor.y
              );
              if (doorDist < 60 && !destroyed) { // 🚪 거리 완화 90
                console.log("🚪 next_room_point 접근 감지됨");
                destroyed = true;
                setEnteredThirdRoom(true);
                this.game.destroy(true);
              }
            } else {
              console.warn("⚠️ next_room_point 오브젝트를 찾지 못했습니다!");
            }
          };
        },
        update() {
          this.update && this.update();
        },
      },
    };

    game = new Phaser.Game(config);
    return () => {
      destroyed = true;
      if (game) game.destroy(true);
    };
  }, [enteredThirdRoom]);

  if (enteredThirdRoom) return <ThirdCanvas />;
  if (goBackToFirstRoom) return <IntroCanvas />;

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
