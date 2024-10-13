export interface IScene {
    load(obj: object): any;
    draw(t: number, dt: number, frame: number): any;
    removeObject(id: string): any;
    addObject(obj: object, id: string): any;
    updateScene(obj: {
        data: object;
        partial: object;
    }): any;
}
