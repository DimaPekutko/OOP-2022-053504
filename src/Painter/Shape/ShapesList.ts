import { Shape } from "./Shape";

export class ShapesList {
    private readonly _shapes: Shape[]

    constructor() {
        this._shapes = []
    }

    public push(shape: Shape): void {
        this._shapes.push(shape)
    }

    public pop(): Shape | null {
        const shape = this._shapes.pop()
        return shape !== undefined ? shape : null
    }

    public get_shapes(): Shape[] {
        return this._shapes
    }

    public clear() {
        while (this._shapes.pop) {}
    }

}