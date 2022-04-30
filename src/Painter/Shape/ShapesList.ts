import { Shape } from "./Shape";

export class ShapesList {
    private readonly _shapes: Shape[]
    private readonly _redo_shapes: Shape[]

    constructor() {
        this._shapes = []
        this._redo_shapes = []
    }

    public push(shape: Shape): void {
        this._shapes.push(shape)
    }

    public pop(): Shape | null {
        const shape = this._shapes.pop()
        if (shape !== undefined) {
            this._redo_shapes.push(shape)
            return shape
        }
        return null
    }

    public get_shapes(): Shape[] {
        return this._shapes
    }

    public redo_shape(): Shape | null {
        const shape = this._redo_shapes.pop()
        if (shape !== undefined) {
            this._shapes.push(shape)
            return shape
        }
        return null
    }

    public clear() {
        while (this._shapes.pop) {}
    }

}