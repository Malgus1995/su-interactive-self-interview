// 📦 공용 에셋 목록
export const commonAssets = [
  { type: "tilemapTiledJSON", key: "start_map", path: "/src/assets/start_map_json.json" },
  { type: "tilemapTiledJSON", key: "second_room", path: "/src/assets/second_room.json" },
  { type: "tilemapTiledJSON", key: "third_room", path: "/src/assets/third_room.json" },
  { type: "spritesheet", key: "player", path: "/src/assets/tiles/player.png", frameWidth: 32, frameHeight: 32 },
  { type: "image", key: "tileset_floors", path: "/src/assets/floors_3_simple_S-20C-5.png" },
  { type: "image", key: "tileset_walls", path: "/src/assets/gather_exterior_walls_2.1.png" },
  { type: "spritesheet", key: "skko", path: "/src/assets/skko.png", frameWidth: 32, frameHeight: 32 },
  { type: "spritesheet", key: "sunny", path: "/src/assets/sunny.png", frameWidth: 32, frameHeight: 32 },
  // 필요한 다른 NPC, 타일셋, 맵 JSON 전부 여기에 추가
];
