import { Coords } from "Painter/Coords";
import { VertexShape } from "../VertexShape";

export class MultiLineShape extends VertexShape {
    to_fill: boolean = false
    vertexes_count: number = Infinity
    constructor(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number) {
        super(pos, bg_clr, stroke_clr, stroke_size)
    }
}