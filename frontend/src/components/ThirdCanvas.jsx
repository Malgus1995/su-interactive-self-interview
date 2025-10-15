import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import thirdRoomJson from "/src/assets/third_room.json";
import playerPng from "/src/assets/tiles/player.png";
import SecondCanvas from "./SecondCanvas";
import LastCanvas from "./LastCanvas";

// ✅ NPC 이미지 import

import axios from "axios";
export default function ThirdCanvas({ setDialogText }) {
  const playerPng =  "assets/tiles/player.png";
  const clararaPng = "/assets/clarara.png";
  const sunnyPng = "/assets/sunny.png";
  const skkoPng = "/assets/skko.png";
  const davidPng = "/assets/david.png";
  const kyminPng = "/assets/kymin.png";
  const richseaPng = "/assets/richsea.png";
  const europiaPng = "/assets/europia.png";


  const gameRef = useRef(null);
  const BASE_URL = "/api/winter";
  const [goBackSecondRoom, setGoBackSecondRoom] = useState(false);
  const [enteredLastRoom, setEnteredLastRoom] = useState(false);

   useEffect(() => {
    axios
      .get(`${BASE_URL}/init_point`)
      .then((res) => {
        setDialogText(res.data.description);
      })
      .catch((err) => {
        console.error("⚠️ init_point API 호출 실패:", err);
      });
  }, [setDialogText]);

  useEffect(() => {
    if (!gameRef.current || goBackSecondRoom) return;
    let destroyed = false;
    let game;

    const getBaseSize = () => {
      const container = gameRef.current;
      return {
        baseWidth: container.clientWidth,
        baseHeight: container.clientHeight,
      };
    };
    const { baseWidth, baseHeight } = getBaseSize();

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
          // ✅ 1️⃣ 맵 캐시 확인 후 필요한 경우만 로드
          if (!this.cache.tilemap.exists("third_room")) {
            this.load.tilemapTiledJSON("third_room", thirdRoomJson);
          }

          // ✅ 2️⃣ 플레이어 스프라이트시트 캐시 확인
          if (!this.textures.exists("player")) {
            this.load.spritesheet("player", playerPng, {
              frameWidth: 32,
              frameHeight: 32,
            });
          }

          // ✅ 3️⃣ 타일셋 중복 로드 방지
          thirdRoomJson.tilesets.forEach((ts) => {
            const key = `tileset_${ts.name}`;
            if (!this.textures.exists(key)) {
              this.load.image(key, `assets/${ts.image}`);
            }
          });

          // ✅ 4️⃣ NPC 스프라이트시트 캐시 확인 후 로드
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
          // ✅ 맵 생성 (이미 캐시에 있으면 즉시 사용)
          const map = this.make.tilemap({ key: "third_room" });
          const sets = map.tilesets.map((ts) =>
            map.addTilesetImage(ts.name, `tileset_${ts.name}`)
          );

          // ✅ 레이어 등록
          const layers = {};
          map.layers.forEach((l) => {
            if (l.visible) layers[l.name] = map.createLayer(l.name, sets, 0, 0);
          });

          // ✅ 충돌 설정
          const collidableNames = ["세번째방_펜스", "세번째방_나무"];
          const collidableLayers = collidableNames
            .map((n) => layers[n])
            .filter(Boolean);
          collidableLayers.forEach((layer) => layer.setCollisionByExclusion([-1]));

          // ✅ 스폰 및 포인트
          const spawn =
            map.findObject("interactions", (o) => o.name === "init_point") ||
            { x: map.widthInPixels / 2, y: map.heightInPixels / 2 };
          const prevDoor = map.findObject("interactions", (o) => o.name === "prev_point");
          const nextDoor = map.findObject("interactions", (o) => o.name === "next_point");
          const programming = map.findObject("interactions", (o) => o.name === "programming");
          const notebook = map.findObject("interactions", (o) => o.name === "notebook");
          const communication = map.findObject("interactions", (o) => o.name === "comunication");
          const masterDegree = map.findObject("interactions", (o) => o.name === "master_degree");
          const path = map.findObject("interactions", (o) => o.name === "path");

          const visited = {
            programming: false,
            notebook: false,
            communication: false,
            masterDegree: false,
            path: false,
          };

          const checkArea = async (obj, key, endpoint) => {
            if (!obj || visited[key]) return;
            const inside =
              player.x >= obj.x &&
              player.x <= obj.x + obj.width &&
              player.y >= obj.y &&
              player.y <= obj.y + obj.height;

            if (inside) {
              visited[key] = true;
              setTimeout(() => (visited[key] = false), 2000);
              try {
                const res = await axios.get(`${BASE_URL}/${endpoint}`);
                if (typeof setDialogText === "function") {
                  setDialogText(res.data.description);
                }
              } catch (err) {
                console.error(`⚠️ ${endpoint} API 실패:`, err);
              }
            }
          };

          // ✅ 플레이어
          const player = this.physics.add.sprite(spawn.x, spawn.y - 16, "player");
          player.setOrigin(0.5, 1);
          player.body.setSize(16, 20, true);
          collidableLayers.forEach((layer) => this.physics.add.collider(player, layer));
          player.body.pushable = false;

          // ✅ 카메라
          const cam = this.cameras.main;
          cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
          cam.startFollow(player, true, 0.15, 0.15);
          cam.setZoom(1.2);

          // ✅ 플레이어 애니메이션 (중복 방지)
          const dirs = { down: [0, 2], right: [6, 8], left: [12, 14], up: [18, 20] };
          Object.entries(dirs).forEach(([key, [s, e]]) => {
            const animKey = `player_${key}`;
            if (!this.anims.exists(animKey)) {
              this.anims.create({
                key: animKey,
                frames: this.anims.generateFrameNumbers("player", { start: s, end: e }),
                frameRate: 8,
                repeat: -1,
              });
            }
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

          // ✅ NPC 애니메이션 생성 (중복 방지)
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

          // ✅ NPC 움직임 (트윈)
          const moveNPC = (npc, axis, range) => {
            if (!npc) return;
            const basePos = npc[axis];
            const delayBetween = Phaser.Math.Between(300, 600);

            const moveOnce = (dir) => {
              const animDir =
                axis === "x" ? (dir > 0 ? "right" : "left") : dir > 0 ? "down" : "up";
              const dist = dir * range;
              npc.anims.play(`${npc.texture.key}_${animDir}`, true);

              this.tweens.add({
                targets: npc,
                [axis]: basePos + dist,
                duration: Phaser.Math.Between(1500, 2200),
                ease: "Sine.easeInOut",
                onComplete: () => {
                  npc.anims.stop();
                  npc.setFrame(1);
                  this.time.delayedCall(delayBetween, () => moveOnce(-dir));
                },
              });
            };
            moveOnce(Math.random() < 0.5 ? -1 : 1);
          };

          ["sunny", "skko"].forEach((n) => moveNPC(npcs[n], "x", 16));
          ["david", "europia"].forEach((n) => moveNPC(npcs[n], "y", 16));

          // ✅ 이동 제어
          const cursors = this.input.keyboard.createCursorKeys();
          const moveSpeed = 150;
          let moveTarget = null;

          this.input.on("pointerdown", (p) => {
            const world = p.positionToCamera(cam);
            moveTarget = { x: world.x, y: world.y };
          });

          // ✅ 업데이트 루프
          this.update = async () => {
            if (destroyed) return;
            player.setVelocity(0);

            // 키보드 이동
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

            // 포인터 이동
            if (!moveByKey() && moveTarget) {
              const dx = moveTarget.x - player.x;
              const dy = moveTarget.y - player.y;
              const dist2 = dx * dx + dy * dy;
              if (dist2 < 25) {
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
            } else if (!moveByKey()) player.anims.stop();

            // ✅ 두 번째 방 복귀
            if (prevDoor) {
              const prevX = prevDoor.x + (prevDoor.width || 0) / 2;
              const prevY = prevDoor.y - (prevDoor.height || 32) / 2;
              const dist = Phaser.Math.Distance.Between(player.x, player.y, prevX, prevY);
              if (dist < 30 && !destroyed) {
                destroyed = true;
                setTimeout(() => {
                  setGoBackSecondRoom(true);
                  this.game.destroy(true);
                }, 150);
              }
            }

            // ✅ 마지막 방 진입
            if (nextDoor) {
              const nextX = nextDoor.x + (nextDoor.width || 0) / 2;
              const nextY = nextDoor.y + (nextDoor.height || 32) / 2;
              const dist = Phaser.Math.Distance.Between(player.x, player.y, nextX, nextY);
              if (dist < 60 && !destroyed) {
                destroyed = true;
                setTimeout(() => {
                  setEnteredLastRoom(true);
                  this.game.destroy(true);
                }, 150);
              }
            }
            await checkArea(programming, "programming", "language_point");
            await checkArea(notebook, "notebook", "notebook_point");
            await checkArea(communication, "communication", "communication_point");
            await checkArea(masterDegree, "masterDegree", "master_degree_point");
            await checkArea(path, "path", "path_point");
            
          };
        },

        update() {
          this.update && this.update();
        },
      },
    };

    game = new Phaser.Game(config);

    // ✅ Resize
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
  }, [goBackSecondRoom]);

  if (goBackSecondRoom) return <SecondCanvas setDialogText={setDialogText} />;
  if (enteredLastRoom) return <LastCanvas setDialogText={setDialogText} />;

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
