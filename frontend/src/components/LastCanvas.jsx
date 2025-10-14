import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import lastRoomJson from "/src/assets/last_room.json";
import playerPng from "/src/assets/tiles/player.png";
import suPng from "/src/assets/su.png";
import IntroCanvas from "./IntroCanvas";
import heartImg from "/src/assets/tiles/heart_32x32.png";
import axios from "axios";
export default function LastCanvas({ setDialogText }) {
  const gameRef = useRef(null);
  const [goIntroCanvas, setGoIntroCanvas] = useState(false);
  const BASE_URL = "http://127.0.0.1:8000/spring"; // ✅ 겨울 API base URL
  

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
    if (!gameRef.current || goIntroCanvas) return;
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
          // ✅ 캐시 존재 시 재로딩 방지
          if (!this.cache.tilemap.exists("last_room"))
            this.load.tilemapTiledJSON("last_room", lastRoomJson);

          if (!this.textures.exists("player"))
            this.load.spritesheet("player", playerPng, { frameWidth: 32, frameHeight: 32 });

          if (!this.textures.exists("su"))
            this.load.spritesheet("su", suPng, { frameWidth: 32, frameHeight: 32 });

          if (!this.textures.exists("heart")) this.load.image("heart", heartImg);

          lastRoomJson.tilesets.forEach((ts) => {
            const key = `tileset_${ts.name}`;
            if (!this.textures.exists(key)) {
              this.load.image(key, `/src/assets/${ts.image}`);
            }
          });
        },

        create() {
          const map = this.make.tilemap({ key: "last_room" });
          const sets = map.tilesets.map((ts) =>
            map.addTilesetImage(ts.name, `tileset_${ts.name}`)
          );

          const layers = {};
          map.layers.forEach((l) => {
            if (l.visible) layers[l.name] = map.createLayer(l.name, sets, 0, 0);
          });

          // ✅ 충돌 설정
          const collidableNames = ["마지막방_벽", "마지막방_나무", "마지막방_가로등"];
          const collidableLayers = collidableNames.map((n) => layers[n]).filter(Boolean);
          collidableLayers.forEach((layer) => layer.setCollisionByExclusion([-1]));

          // ✅ 오브젝트 로드
          const spawn = map.findObject("interactables", (o) => o.name === "init_point");
          const suPoint = map.findObject("interactables", (o) => o.name === "su_point");
          const playerPoint = map.findObject("interactables", (o) => o.name === "player_point");
          const approachZoneObj = map.findObject("interactables", (o) => o.name === "approach_to_su");
          const prevDoor = map.findObject("interactables", (o) => o.name === "goto_init");

          // ✅ 플레이어 생성
          const player = this.physics.add.sprite(spawn.x, spawn.y, "player");
          player.setOrigin(0.5, 1);
          player.body.setSize(16, 20, true);
          collidableLayers.forEach((layer) => this.physics.add.collider(player, layer));

          // ✅ su 생성
          const su = this.physics.add.sprite(suPoint.x, suPoint.y, "su");
          su.setOrigin(0.5, 1);
          su.setDepth(5);
          su.setFrame(10);
          su.body.immovable = true;
          this.physics.add.collider(player, su);

          // ✅ 카메라
          const cam = this.cameras.main;
          cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
          cam.startFollow(player, true, 0.15, 0.15);
          cam.setZoom(1.2);

          // ✅ 애니메이션
          const dirs = { down: [0, 2], right: [6, 8], left: [12, 14], up: [18, 20] };
          Object.entries(dirs).forEach(([key, [s, e]]) => {
            if (!this.anims.exists(`player_${key}`)) {
              this.anims.create({
                key: `player_${key}`,
                frames: this.anims.generateFrameNumbers("player", { start: s, end: e }),
                frameRate: 8,
                repeat: -1,
              });
            }
          });

          const heart = this.add.image(spawn.x, spawn.y - 64, "heart").setScale(1.2);
          heart.setScrollFactor(0);

          // ✅ 이동 관련 변수
          const cursors = this.input.keyboard.createCursorKeys();
          const moveSpeed = 150;
          let moveTarget = null;
          let eventLock = false;
          let eventTriggered = false;

          const visited = { init: false, approach: false };

          const checkArea = async (obj, key, endpoint) => {
            if (!obj || visited[key]) return;
            const inside =
              player.x >= obj.x &&
              player.x <= obj.x + (obj.width || 0) &&
              player.y >= obj.y &&
              player.y <= obj.y + (obj.height || 0);
            if (inside) {
              visited[key] = true;
              setTimeout(() => (visited[key] = false), 2500);
              try {
                const res = await axios.get(`${BASE_URL}/${endpoint}`);
                setDialogText(res.data.description);
              } catch (err) {
                console.error(`${endpoint} 호출 실패:`, err);
              }
            }
          };

          // ✅ 클릭 이동
          this.input.on("pointerdown", (p) => {
            if (eventLock) return;
            const world = p.positionToCamera(cam);
            moveTarget = { x: world.x, y: world.y };
          });

          // ✅ 접근 이벤트 (approachZone)
          if (approachZoneObj) {
            const approachZone = this.add.zone(
              approachZoneObj.x + (approachZoneObj.width || 32) / 2,
              approachZoneObj.y + (approachZoneObj.height || 32) / 2,
              approachZoneObj.width || 64,
              approachZoneObj.height || 64
            );
            this.physics.add.existing(approachZone);
            approachZone.body.setAllowGravity(false);
            approachZone.body.moves = false;

            this.physics.add.overlap(player, approachZone, () => {
              if (!eventTriggered) {
                eventTriggered = true;
                eventLock = true;
                moveTarget = null; // ✅ 기존 이동 목표 완전 초기화

                // 1️⃣ su가 player를 바라봄
                this.time.delayedCall(10, () => su.setFrame(1));

                // 2️⃣ player가 천천히 su 쪽으로 이동
                player.anims.play("player_up", true);
                this.tweens.add({
                  targets: player,
                  x: playerPoint.x,
                  y: playerPoint.y,
                  duration: 2000,
                  ease: "Linear",
                  onComplete: () => {
                    // 3️⃣ 도착 후 멈추고 서로 마주봄
                    player.anims.stop();
                    player.setFrame(1);
                    player.body.moves = false;

                    this.time.delayedCall(1000, async () => {
                      try {
                        const res = await axios.get(`${BASE_URL}/approach_point`);
                        setDialogText(res.data.description);
                      } catch (err) {
                        console.error("approach_point 호출 실패:", err);
                      }
                      eventLock = false;
                      player.body.moves = true;
                    });
                  },
                });
              }
            });
          }

          // ✅ 메인 업데이트 루프
          this.update = () => {
            if (destroyed) return;
            player.setVelocity(0);

            if (!eventLock) {
              let moving = false;

              // 키보드 이동
              if (cursors.left.isDown) {
                player.setVelocityX(-moveSpeed);
                player.anims.play("player_left", true);
                moving = true;
              } else if (cursors.right.isDown) {
                player.setVelocityX(moveSpeed);
                player.anims.play("player_right", true);
                moving = true;
              } else if (cursors.up.isDown) {
                player.setVelocityY(-moveSpeed);
                player.anims.play("player_up", true);
                moving = true;
              } else if (cursors.down.isDown) {
                player.setVelocityY(moveSpeed);
                player.anims.play("player_down", true);
                moving = true;
              }

              // 클릭 이동
              if (!moving && moveTarget) {
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
              } else if (!moving) {
                player.anims.stop();
              }
            }

            // ✅ 복귀 트리거
            if (prevDoor) {
              const prevX = prevDoor.x + (prevDoor.width || 0) / 2;
              const prevY = prevDoor.y + (prevDoor.height || 32) / 2;
              const dist = Phaser.Math.Distance.Between(player.x, player.y, prevX, prevY);
              if (dist < 80 && !destroyed) {
                destroyed = true;
                setTimeout(() => {
                  setGoIntroCanvas(true);
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
  }, [goIntroCanvas]);

  if (goIntroCanvas) return <IntroCanvas setDialogText={setDialogText} />;

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
