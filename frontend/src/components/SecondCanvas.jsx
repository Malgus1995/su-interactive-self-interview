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

    // ✅ 반응형 크기 계산
    const getBaseSize = () => {
      const container = gameRef.current;
      return { baseWidth: container.clientWidth, baseHeight: container.clientHeight };
    };
    const { baseWidth, baseHeight } = getBaseSize();

    // ✅ Phaser 설정
    const config = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      pixelArt: true,
      transparent: true,
      physics: { default: "arcade", arcade: { debug: false } },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: baseWidth,
        height: baseHeight,
      },
      fps: { target: 60 },
      scene: {
        preload() {
          // ✅ 캐시에 존재하는 리소스는 스킵
          if (!this.cache.tilemap.exists("second_room")) {
            console.log("📦 Loading second_room tilemap...");
            this.load.tilemapTiledJSON("second_room", secondRoomJson);
          }

          if (!this.textures.exists("player")) {
            console.log("📦 Loading player spritesheet...");
            this.load.spritesheet("player", playerPng, {
              frameWidth: 32,
              frameHeight: 32,
            });
          }

          // ✅ 타일셋 이미지 캐시 확인
          secondRoomJson.tilesets.forEach((ts) => {
            const key = `tileset_${ts.name}`;
            if (!this.textures.exists(key)) {
              this.load.image(key, `/src/assets/${ts.image}`);
            }
          });
        },

        create() {
          // ✅ 맵 불러오기 (캐시 사용)
          const map = this.make.tilemap({ key: "second_room" });
          const sets = map.tilesets.map((ts) =>
            map.addTilesetImage(ts.name, `tileset_${ts.name}`)
          );

          // ✅ 레이어 구성
          const layers = {};
          map.layers.forEach((l) => {
            if (!l.visible) return;
            layers[l.name] = map.createLayer(l.name, sets, 0, 0);
          });

          // ✅ 충돌 레이어 설정
          const collidableNames = ["인물", "두번째방_나무", "두번째방_조형물"];
          const collidableLayers = collidableNames
            .map((n) => layers[n])
            .filter(Boolean);
          collidableLayers.forEach((layer) => layer.setCollisionByExclusion([-1]));

          // ✅ 오브젝트 로드
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

          // ✅ 플레이어 생성 (캐시된 스프라이트시트 사용)
          const player = this.physics.add.sprite(spawn.x, spawn.y - 16, "player");
          player.setOrigin(0.5, 1);

          collidableLayers.forEach((l) => this.physics.add.collider(player, l));

          // ✅ 카메라
          const cam = this.cameras.main;
          cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
          cam.startFollow(player, true, 0.15, 0.15);
          cam.setZoom(1.2);

          // ✅ 애니메이션 등록 (중복 방지)
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

          // ✅ 입력 제어
          const cursors = this.input.keyboard.createCursorKeys();
          const moveSpeed = 150;
          let moveTarget = null;

          this.input.on("pointerdown", (p) => {
            const world = p.positionToCamera(cam);
            moveTarget = { x: world.x, y: world.y };
          });

          // ✅ 업데이트 루프 (최적화)
          this.update = () => {
            if (destroyed) return;
            player.setVelocity(0);

            let moving = false;

            if (cursors.left.isDown) {
              player.setVelocityX(-moveSpeed);
              player.anims.play("left", true);
              moving = true;
            } else if (cursors.right.isDown) {
              player.setVelocityX(moveSpeed);
              player.anims.play("right", true);
              moving = true;
            } else if (cursors.up.isDown) {
              player.setVelocityY(-moveSpeed);
              player.anims.play("up", true);
              moving = true;
            } else if (cursors.down.isDown) {
              player.setVelocityY(moveSpeed);
              player.anims.play("down", true);
              moving = true;
            }

            if (!moving && moveTarget) {
              const dx = moveTarget.x - player.x;
              const dy = moveTarget.y - player.y;
              const dist2 = dx * dx + dy * dy;
              if (dist2 < 25) moveTarget = null;
              else {
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
            }

            if (!moving && !moveTarget) player.anims.stop();

            // ✅ 이전 방 이동 (prevDoor)
            if (prevDoor) {
              const prevX = prevDoor.x + (prevDoor.width || 32) / 2;
              const prevY = prevDoor.y + (prevDoor.height || 32);
              const inRangeX =
                player.x > prevDoor.x - 64 &&
                player.x < prevDoor.x + (prevDoor.width || 32) + 64;
              const inRangeY = Math.abs(player.y - prevY) < 40;

              if (inRangeX && inRangeY && !destroyed) {
                destroyed = true;
                setTimeout(() => {
                  setGoBackToFirstRoom(true);
                  this.game.destroy(true);
                }, 100);
              }
            }

            // ✅ 다음 방 이동 (nextDoor)
            if (nextDoor) {
              const doorDist = Phaser.Math.Distance.Between(
                player.x,
                player.y,
                nextDoor.x,
                nextDoor.y
              );
              if (doorDist < 60 && !destroyed) {
                destroyed = true;
                setTimeout(() => {
                  setEnteredThirdRoom(true);
                  this.game.destroy(true);
                }, 100);
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

    // ✅ Resize 최적화
    const handleResize = () => {
      if (!game || destroyed) return;
      const { baseWidth, baseHeight } = getBaseSize();
      game.scale.resize(baseWidth, baseHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      destroyed = true;
      window.removeEventListener("resize", handleResize);
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
