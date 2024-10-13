export declare const RMSpritesheet: (framesWidth: number, framesHeight: number, frameStand?: number) => {
    textures: {
        stand: {
            animations: (direction: any) => {
                time: number;
                frameX: number;
                frameY: any;
            }[][];
        };
        walk: {
            animations: (direction: any) => any[];
        };
    };
    framesHeight: number;
    framesWidth: number;
};
