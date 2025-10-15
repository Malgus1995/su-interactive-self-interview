import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import mapJsonUrl from "/src/assets/start_map_json.json?url"; // ✅ Vite가 URL로 변환
import SecondCanvas from "./SecondCanvas";
import axios from "axios";

export default function IntroCanvas({ setDialogText, topOffset = 140 }) {
  // ✅ 도커/Nginx 환경에서는 /api → backend 로 프록시됨
  const BASE_URL = "/summer";
  const gameRef = useRef(null);
  const [enteredSecondRoom, setEnteredSecondRoom] = useState(false);

  // ✅ 초기 설명 텍스트 로드
  useEffect(() => {
    axios
      .get(`${BASE_URL}/init`)
      .then((res) => setDialogText(res.data.description))
      .catch((err) => console.error("init_point 호출 실패:", err));
  }, [setDialogText]);

  useEffect(() => {
    if (!gameRef.current || enteredSecondRoom) return;
    let destroyed = false;
    let game;

    const getBaseSize = () => {
      const container = gameRef.current;
      return {
        width: container.clientWidth,
        height: container.clientHeight,
      };
    };
    const { width, height } = getBaseSize();

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
      fps: { target: 60 },
      scene: {
        preload() {
          // ✅ 타일맵 JSON URL 로드
          if (!this.cache.tilemap.exists("start_map"))
            this.load.tilemapTiledJSON("start_map", mapJsonUrl);

          // ✅ 스프라이트시트 (public/assets)
          if (!this.textures.exists("player"))
            this.load.spritesheet("player", "assets/tiles/player.png", {
              frameWidth: 32,
              frameHeight: 32,
            });

          // ✅ 타일셋 이미지 (JSON 내 image 필드 기준)
          // JSON 내부의 image 값은 "tiles/foo.png" 형식이라고 가정
          this.load.once("filecomplete", () => {
            const data = this.cache.tilemap.get("start_map").data;
            data.tilesets?.forEach((ts) => {
              const key = `tileset_${ts.name}`;
              if (!this.textures.exists(key))
                this.load.image(key, `assets/${ts.image}`);
            });
          });
        },

        create() {
          const map = this.make.tilemap({ key: "start_map" });
          const tilesets = map.tilesets.map((ts) =>
            map.addTilesetImage(ts.name, `tileset_${ts.name}`)
          );

          const layers = {};
          map.layers.forEach((l) => {
            layers[l.name] = map.createLayer(l.name, tilesets, 0, 0);
          });

          // ✅ 오브젝트 레이어
          const spawn = map.findObject("interactables", (o) => o.name === "init_point");
          const startDoor = map.findObject("interactables", (o) => o.name === "start_door");
          const seaPoint = map.findObject("interactables", (o) => o.name === "tmi_point");

          // ✅ 플레이어 생성
          const player = this.physics.add.sprite(spawn.x, spawn.y - 16, "player");
          player.setOrigin(0.5, 1);

          // ✅ 애니메이션 등록
          const anims = { down: [0, 2], right: [6, 8], left: [12, 14], up: [18, 20] };
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

          // ✅ 이동 관련
          const cursors = this.input.keyboard.createCursorKeys();
          const moveSpeed = 150;
          let moveTarget = null;

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

          const fadeNearTrees = () => {
            if (!treeLayer) return;
            const tileX = Math.floor(player.x / 32);
            const tileY = Math.floor(player.y / 32);
            let overlap = false;
            for (let y = tileY - 1; y <= tileY + 1; y++) {
              for (let x = tileX - 1; x <= tileX + 1; x++) {
                const tile = treeLayer.getTileAt(x, y);
                if (!tile) continue;
                const tileRect = tile.getBounds();
                const playerRect = player.getBounds();
                if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, tileRect)) {
                  overlap = true;
                  break;
                }
              }
            }
            treeLayer.setAlpha(overlap ? 0.5 : 1);
          };

          let seaVisited = false;

          this.update = async () => {
            if (destroyed) return;
            player.setVelocity(0);
            fadeNearTrees();

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
                    ? dx > 0 ? "right" : "left"
                    : dy > 0 ? "down" : "up",
                  true
                );
              }
            }

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

            // 🌊 바다 포인트
            if (!seaVisited && seaPoint && Phaser.Math.Distance.Between(player.x, player.y, seaPoint.x, seaPoint.y) < 40) {
              seaVisited = true;
              try {
                const res = await axios.get(`${BASE_URL}/sea_point`);
                setDialogText(res.data.description);
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
  }, [enteredSecondRoom, setDialogText]);

  if (enteredSecondRoom) return <SecondCanvas setDialogText={setDialogText} />;

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
