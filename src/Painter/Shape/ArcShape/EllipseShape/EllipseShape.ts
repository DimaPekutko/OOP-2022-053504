import { Coords } from "Painter/Coords";
import { ArcShape } from "../ArcShape";

export class EllipseShape extends ArcShape {
    to_fill: boolean = true
    constructor(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number) {
        super(pos, bg_clr, stroke_clr, stroke_size)
    }
}