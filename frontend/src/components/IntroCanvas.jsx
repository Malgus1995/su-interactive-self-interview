import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import mapJson from "/src/assets/start_map_json.json";
import playerPng from "/src/assets/tiles/player.png";
import SecondCanvas from "./SecondCanvas";
import axios from "axios";

export default function IntroCanvas({ setDialogText,topOffset = 140 }) {
  const BASE_URL = "http://127.0.0.1:8000/summer";
  const gameRef = useRef(null);
  const [enteredSecondRoom, setEnteredSecondRoom] = useState(false);
  
  useEffect(() => {
    axios.get(`${BASE_URL}/init`).then((res) => {
      setDialogText(res.data.description);
    });
  }, [setDialogText]);
  useEffect(() => {
    if (!gameRef.current || enteredSecondRoom) return;
    let destroyed = false;
    let game;

    // ✅ 실시간 화면 크기 (부모 컨테이너 기준)
    const getBaseSize = () => {
      const container = gameRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;
      return { width, height };
    };
    const { width, height } = getBaseSize();

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
        width,
        height,
      },
      dom: { createContainer: true },
      canvasStyle: "z-index: 0; position: relative;",
      fps: { target: 60 },
      scene: {
        preload() {
          // 🔹 캐시에 있으면 스킵
          if (!this.cache.tilemap.exists("start_map"))
            this.load.tilemapTiledJSON("start_map", mapJson);

          if (!this.textures.exists("player"))
            this.load.spritesheet("player", playerPng, {
              frameWidth: 32,
              frameHeight: 32,
            });

          mapJson.tilesets.forEach((ts) => {
            const key = `tileset_${ts.name}`;
            if (!this.textures.exists(key))
              this.load.image(key, `/src/assets/${ts.image}`);
          });
        },

        create() {
          // ✅ 타일맵 구성
          const map = this.make.tilemap({ key: "start_map" });
          const tilesets = map.tilesets.map((ts) =>
            map.addTilesetImage(ts.name, `tileset_${ts.name}`)
          );
          const layers = {};
          map.layers.forEach((l) => {
            layers[l.name] = map.createLayer(l.name, tilesets, 0, 0);
          });

          // ✅ 오브젝트 불러오기
          const spawn = map.findObject("interactables", (o) => o.name === "init_point");
          const startDoor = map.findObject("interactables", (o) => o.name === "start_door");
          const seaPoint = map.findObject("interactables", (o) => o.name === "tmi_point");

          // ✅ 플레이어 생성
          const player = this.physics.add.sprite(spawn.x, spawn.y - 16, "player");
          player.setOrigin(0.5, 1);

          // ✅ 애니메이션 등록 (중복 방지)
          const anims = {
            down: [0, 2],
            right: [6, 8],
            left: [12, 14],
            up: [18, 20],
          };
          Object.entries(anims).forEach(([key, [s, e]]) => {
            if (!this.anims.exists(key)) {
              this.anims.create({
                key,
                frames: this.anims.generateFrameNumbers("player", { start: s, end: e }),
                frameRate: 8,
                repeat: -1,
              });
            }
          });

          // ✅ 카메라
          const cam = this.cameras.main;
          cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
          cam.startFollow(player, true, 0.1, 0.1);
          cam.setZoom(1.2);

          // ✅ 이동 관련 변수
          const cursors = this.input.keyboard.createCursorKeys();
          const moveSpeed = 150;
          let moveTarget = null;

          // ✅ 터치/마우스 이동 (단일 리스너 유지)
          this.input.once("pointerdown", () => console.log("🟢 Pointer enabled"));
          this.input.on("pointerdown", (pointer) => {
            const world = pointer.positionToCamera(cam);
            moveTarget = { x: world.x, y: world.y };
          });

          // ✅ 충돌
          const treeLayer = layers["시작점_나무"];
          const furnitureLayer = layers["시작점_가구"];
          if (furnitureLayer) {
            furnitureLayer.setCollisionByExclusion([-1]);
            this.physics.add.collider(player, furnitureLayer);
          }

          // ✅ 근처 나무 반투명 처리 (매 frame 전체 탐색 ❌)
          const fadeNearTrees = () => {
            if (!treeLayer) return;
            const tileX = Math.floor(player.x / 32);
            const tileY = Math.floor(player.y / 32);
            let isOverlap = false;

            for (let y = tileY - 1; y <= tileY + 1; y++) {
              for (let x = tileX - 1; x <= tileX + 1; x++) {
                const tile = treeLayer.getTileAt(x, y);
                if (!tile) continue;
                const tileRect = tile.getBounds();
                const playerRect = player.getBounds();
                if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, tileRect)) {
                  isOverlap = true;
                  break;
                }
              }
            }
            treeLayer.setAlpha(isOverlap ? 0.5 : 1);
          };
        let seaVisited = false;
          // ✅ 업데이트 루프
          this.update = async () => {
            if (destroyed) return;
            player.setVelocity(0);
            fadeNearTrees();

            let moving = false;

            // 🎮 키보드 이동
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

            // 🖱️ 클릭 이동
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
                    ? dx > 0 ? "right" : "left"
                    : dy > 0 ? "down" : "up",
                  true
                );
              }
            }

            // 🧍‍♂️ 정지 시
            if (!moving && !moveTarget) player.anims.stop();

            // 🚪 문 진입 이벤트
            if (startDoor) {
              const dist = Phaser.Math.Distance.Between(player.x, player.y, startDoor.x, startDoor.y);
              if (dist < 40 && !destroyed) {
                destroyed = true;
                setEnteredSecondRoom(true);
                this.game.destroy(true);
              }
            }

              if (!seaVisited && seaPoint && Phaser.Math.Distance.Between(player.x, player.y, seaPoint.x, seaPoint.y) < 40) {
                seaVisited = true; // 한 번만 실행되도록 플래그 설정
              try {
                const res = await axios.get(`${BASE_URL}/sea_point`);
                setDialogText(res.data.description); // 🔹 부모(App)의 텍스트박스 업데이트
              } catch (err) {
                console.error("API 요청 실패:", err);
              }
            }
          };
        },

        update() {
          if (this.update) this.update();
        },
      },
    };

    game = new Phaser.Game(config);

    // ✅ Resize 이벤트 (성능 최적화)
    const handleResize = () => {
      if (!game || destroyed) return;
      const { width, height } = getBaseSize();
      game.scale.resize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      destroyed = true;
      window.removeEventListener("resize", handleResize);
      if (game) game.destroy(true);
    };
  }, [enteredSecondRoom,setDialogText]);

  if (enteredSecondRoom) return <SecondCanvas />;

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
      }}>
    </div>
  );
}
