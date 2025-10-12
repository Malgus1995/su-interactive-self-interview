import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import thirdRoomJson from "/src/assets/third_room.json";
import playerPng from "/src/assets/tiles/player.png";
import SecondCanvas from "./SecondCanvas";
import LastCanvas from "./LastCanvas";

// ✅ NPC 이미지 import
import clararaPng from "/src/assets/clarara.png";
import sunnyPng from "/src/assets/sunny.png";
import skkoPng from "/src/assets/skko.png";
import davidPng from "/src/assets/david.png";
import kyminPng from "/src/assets/kymin.png";
import richseaPng from "/src/assets/richsea.png";
import europiaPng from "/src/assets/europia.png";

export default function ThirdCanvas() {
  const gameRef = useRef(null);
  const [goBackSecondRoom, setGoBackSecondRoom] = useState(false);
  const [enteredLastRoom, setEnteredLastRoom] = useState(false);

  useEffect(() => {
    if (!gameRef.current || goBackSecondRoom) return;
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
          // ✅ 맵 + 플레이어
          this.load.tilemapTiledJSON("third_room", thirdRoomJson);
          this.load.spritesheet("player", playerPng, {
            frameWidth: 32,
            frameHeight: 32,
          });

          // ✅ 타일셋 로드
          thirdRoomJson.tilesets.forEach((ts) => {
            const key = `tileset_${ts.name}`;
            if (!this.textures.exists(key)) {
              this.load.image(key, `../../src/assets/${ts.image}`);
            }
          });

          // ✅ NPC 리스트
          this.npcList = [
            "skko",
            "sunny",
            "david",
            "kymin",
            "clarara",
            "richsea",
            "europia",
          ];

          const npcImages = {
            skko: skkoPng,
            sunny: sunnyPng,
            david: davidPng,
            kymin: kyminPng,
            clarara: clararaPng,
            richsea: richseaPng,
            europia: europiaPng,
          };

          // ✅ 고정 프레임(3x4) 방식
          this.npcList.forEach((name) => {
            if (!this.textures.exists(name)) {
              this.load.spritesheet(name, npcImages[name], {
                frameWidth: 32,
                frameHeight: 32,
              });
            }
          });
        },

        create() {
          // ✅ 맵 생성
          const map = this.make.tilemap({ key: "third_room" });
          const sets = map.tilesets.map((ts) =>
            map.addTilesetImage(ts.name, `tileset_${ts.name}`)
          );

          const layers = {};
          map.layers.forEach((l) => {
            if (l.visible) {
              layers[l.name] = map.createLayer(l.name, sets, 0, 0);
            }
          });

          // ✅ 충돌 설정
          const collidableNames = ["세번째방_펜스", "세번째방_나무"];
          const collidableLayers = collidableNames
            .map((n) => layers[n])
            .filter(Boolean);
          collidableLayers.forEach((layer) =>
            layer.setCollisionByExclusion([-1])
          );

          // ✅ 스폰 / 복귀 포인트
          const spawn =
            map.findObject("interactions", (o) => o.name === "init_point") ||
            { x: map.widthInPixels / 2, y: map.heightInPixels / 2 };
          const prevDoor = map.findObject(
            "interactions",
            (o) => o.name === "prev_point"
          );

          const nextDoor = map.findObject(
            "interactions",
            (o) => o.name === "next_point"
          );

          const player = this.physics.add.sprite(spawn.x, spawn.y - 16, "player");
          player.setOrigin(0.5, 1);
          collidableLayers.forEach((layer) =>
            this.physics.add.collider(player, layer)
          );

          // ✅ 카메라
          const cam = this.cameras.main;
          cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
          cam.startFollow(player, true, 0.15, 0.15);
          cam.setZoom(1.2);

          // ✅ 플레이어 애니메이션
          const dirs = { down: [0, 2], right: [6, 8], left: [12, 14], up: [18, 20] };
          Object.entries(dirs).forEach(([key, [s, e]]) => {
            const animKey = `player_${key}`;
            this.anims.create({
              key: animKey,
              frames: this.anims.generateFrameNumbers("player", { start: s, end: e }),
              frameRate: 8,
              repeat: -1,
            });
          });

          // ✅ NPC 배치
          const npcs = {};
          this.npcList.forEach((name) => {
            const obj = map.findObject("interactions", (o) => o.name === name);
            if (!obj) return;
            const npc = this.physics.add.sprite(obj.x, obj.y, name);
            npc.setOrigin(0.5, 0.85);
            npc.setDepth(5);
            npc.body.moves = true;
            npc.body.immovable = true;
            npc.body.setSize(16, 20, true);
            npcs[name] = npc;
          });

          Object.values(npcs).forEach((npc) => {
            this.physics.add.collider(player, npc);
            });

         player.body.pushable = false; // NPC 안 밀게 설정

          // ✅ NPC 애니메이션 생성 (3×4 구조)
          const createNPCAnims = (npcName) => {
            if (!this.textures.exists(npcName)) return;
            const seq = {
              down: [0, 1, 2],
              left: [3, 4, 5],
              right: [6, 7, 8],
              up: [9, 10, 11],
            };
            for (const [dir, [s, , e]] of Object.entries(seq)) {
              const animKey = `${npcName}_${dir}`;
              if (!this.anims.exists(animKey)) {
                this.anims.create({
                  key: animKey,
                  frames: this.anims.generateFrameNumbers(npcName, { start: s, end: e }),
                  frameRate: 6,
                  repeat: -1,
                });
              }
            }
          };
          this.npcList.forEach((n) => createNPCAnims(n));

        const moveNPC = (npc, axis, range) => {
        if (!npc) return;

        const basePos = npc[axis];
        const speed = 20; // 이동 속도 (픽셀/프레임)
        const delayBetween = Phaser.Math.Between(300, 600);

        // 🔁 무한 반복용 함수
        const moveOnce = (dir) => {
            const animDir =
            axis === "x" ? (dir > 0 ? "right" : "left") : dir > 0 ? "down" : "up";
            const dist = dir * range;

            npc.anims.play(`${npc.texture.key}_${animDir}`, true);

            // 1. 이동
            this.tweens.add({
            targets: npc,
            [axis]: basePos + dist,
            duration: Phaser.Math.Between(1500, 2200),
            ease: "Sine.easeInOut",
            onComplete: () => {
                // 2. 멈춤
                npc.anims.stop();
                npc.setFrame(1);

                // 3. 방향 반전 후 대기 → 다음 루프
                this.time.delayedCall(delayBetween, () => {
                moveOnce(-dir);
                });
            },
            });
        };

        // 시작 방향 랜덤
        const firstDir = Math.random() < 0.5 ? -1 : 1;
        moveOnce(firstDir);
        };




          ["sunny", "skko"].forEach((n) => moveNPC(npcs[n], "x", 16));
          ["david", "europia"].forEach((n) => moveNPC(npcs[n], "y", 16));

          // ✅ 이동 제어 (플레이어 로직 그대로 유지)
          const cursors = this.input.keyboard.createCursorKeys();
          const moveSpeed = 150;
          let moveTarget = null;
          this.input.on("pointerdown", (p) => {
            const world = p.positionToCamera(cam);
            moveTarget = { x: world.x, y: world.y };
          });

          this.update = () => {
            if (destroyed) return;
            player.setVelocity(0);

            const moveByKey = () => {
              if (cursors.left.isDown) {
                player.setVelocityX(-moveSpeed);
                player.anims.play("player_left", true);
                return true;
              } else if (cursors.right.isDown) {
                player.setVelocityX(moveSpeed);
                player.anims.play("player_right", true);
                return true;
              } else if (cursors.up.isDown) {
                player.setVelocityY(-moveSpeed);
                player.anims.play("player_up", true);
                return true;
              } else if (cursors.down.isDown) {
                player.setVelocityY(moveSpeed);
                player.anims.play("player_down", true);
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
                  const ang = Math.atan2(dy, dx);
                  player.setVelocity(Math.cos(ang) * moveSpeed, Math.sin(ang) * moveSpeed);
                  player.anims.play(
                    Math.abs(dx) > Math.abs(dy)
                      ? dx > 0
                        ? "player_right"
                        : "player_left"
                      : dy > 0
                      ? "player_down"
                      : "player_up",
                    true
                  );
                }
              } else player.anims.stop();
            }

            // ✅ 복귀 트리거
            if (prevDoor) {
            // 💡 Phaser는 Tiled 오브젝트의 y가 상단이므로, 실제 위치를 약간 아래로 보정
            const prevX = prevDoor.x + (prevDoor.width || 0) / 2;
            const prevY = prevDoor.y - (prevDoor.height || 32) / 2;

            const doorDist = Phaser.Math.Distance.Between(player.x, player.y, prevX, prevY);
            if (doorDist < 30 && !destroyed) { // 거리도 약간 완화
              console.log("🚪 prev_point 접근 감지됨 → 두 번째 방으로 이동");
              destroyed = true;
              setTimeout(() => {
                setGoBackSecondRoom(true);
                this.game.destroy(true);
              }, 150);
            }
          }
          if (nextDoor) {
              const nextX = nextDoor.x + (nextDoor.width || 0) / 2;
              const nextY = nextDoor.y + (nextDoor.height || 32) / 2;
              const doorDist = Phaser.Math.Distance.Between(player.x, player.y, nextX, nextY);
              if (doorDist < 60 && !destroyed) {
                console.log("🚪 next_point 접근 감지됨 → 마지막 방으로 이동");
                destroyed = true;
                setTimeout(() => {
                  setEnteredLastRoom(true);
                  this.game.destroy(true);
                }, 150);
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
    return () => {
      destroyed = true;
      if (game) game.destroy(true);
    };
  }, [goBackSecondRoom]);

  if (goBackSecondRoom) return <SecondCanvas />;
  if (enteredLastRoom) return <LastCanvas />; 

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
