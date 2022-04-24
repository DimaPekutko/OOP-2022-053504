import { Coords } from "Painter/Coords";
import { Shape } from "Painter/Shape/Shape";

export abstract class ArcShape extends Shape {
    protected _x_radius: number = 20
    protected _y_radius: number = 20

    constructor(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number) {
        super(pos, bg_clr, stroke_clr, stroke_size)
    }

    set_proportions_by_pos(pos: Coords) {
        let head_pos = this._pos
        if (head_pos) {
            this._x_radius = Math.abs(head_pos.x-pos.x)
            this._y_radius = Math.abs(head_pos.y-pos.y)
        }
    }

    get_radii(): [number, number] {
        return [this._x_radius, this._y_radius]
    }
}