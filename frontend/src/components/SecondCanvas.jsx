import { useEffect, useRef } from "react";
import Phaser from "phaser";
import secondRoomJson from "/src/assets/second_room.json";
import playerPng from "/src/assets/tiles/player.png";

export default function SecondCanvas() {
  const gameRef = useRef(null);

  useEffect(() => {
    if (!gameRef.current) return;

    let destroyed = false;

    const config = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      pixelArt: true,
      transparent: true,
      physics: { default: "arcade", arcade: { debug: false } },
      scale: { mode: Phaser.Scale.RESIZE },
      scene: {
        preload() {
          this.load.tilemapTiledJSON("second_room", secondRoomJson);
          secondRoomJson.tilesets.forEach((ts) => {
            this.load.image(`tileset_${ts.name}`, `/src/assets/${ts.image}`);
          });
          this.load.spritesheet("player", playerPng, {
            frameWidth: 32,
            frameHeight: 32,
          });
        },

        create() {
          const map = this.make.tilemap({ key: "second_room" });

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

          // ✅ init_point 기준 위치 지정 (없으면 중앙 fallback)
          let spawn = map.findObject("interactions", (o) => o.name === "init_point");
          if (!spawn) spawn = { x: map.widthInPixels / 2, y: map.heightInPixels - 64 };

          const player = this.physics.add.sprite(spawn.x, spawn.y, "player");
          player.setOrigin(0.5, 1);
          player.setCollideWorldBounds(false);

          // ✅ 카메라 세팅 (밑 중심 기준)
          const cam = this.cameras.main;
          cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
          cam.startFollow(player, true, 0.1, 0.1);
          cam.setBackgroundColor("rgba(0,0,0,0)");

          // ✅ 입력 세팅
          const cursors = this.input.keyboard.createCursorKeys();
          const moveSpeed = 150;
          let moveTarget = null;

          // ✅ 클릭 / 터치 이동
          this.input.on("pointerdown", (pointer) => {
            const world = pointer.positionToCamera(cam);
            moveTarget = { x: world.x, y: world.y };
          });

          // ✅ 반응형 중앙 정렬 (하단 기준으로 자연스럽게)
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

            // 🔹 init_point 기준 하단 중심 보정
            const spawnObj = map.findObject("interactions", (o) => o.name === "init_point");
            if (spawnObj) {
              cam.centerOn(spawnObj.x, spawnObj.y - 180); // ← 밑을 기준으로 위로 180px 띄움
            } else {
              cam.centerOn(W / 2, H - 180);
            }

            // 🔹 캔버스 중앙 고정
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

          // ✅ 애니메이션
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

          // ✅ 업데이트 루프
          this.update = () => {
            if (destroyed) return;

            player.setVelocity(0);

            // 키보드 이동
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
            // 클릭 이동
            else if (moveTarget) {
              const dx = moveTarget.x - player.x;
              const dy = moveTarget.y - player.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 5) {
                moveTarget = null;
                player.anims.stop();
              } else {
                const angle = Math.atan2(dy, dx);
                player.setVelocity(Math.cos(angle) * moveSpeed, Math.sin(angle) * moveSpeed);
                if (Math.abs(dx) > Math.abs(dy)) {
                  player.anims.play(dx > 0 ? "right" : "left", true);
                } else {
                  player.anims.play(dy > 0 ? "down" : "up", true);
                }
              }
            } else {
              player.anims.stop();
            }
          };
        },

        update() {
          this.update && this.update();
        },
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      destroyed = true;
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
