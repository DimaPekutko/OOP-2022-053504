import { Coords } from "Painter/Coords";
import { VertexShape } from "../VertexShape";

export class LineShape extends VertexShape {
    to_fill: boolean = false
    vertexes_count: number = 2
    constructor(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number) {
        super(pos, bg_clr, stroke_clr, stroke_size)
    }
}