import { Coords } from "Painter/Coords";
import { VertexShape } from "../VertexShape";

export class PolygonShape extends VertexShape {
    to_fill: boolean = true
    vertexes_count: number = Infinity
    constructor(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number) {
        super(pos, bg_clr, stroke_clr, stroke_size)
    }

    push_vertex(ver: Coords): void {
        let head_ver = null
        if (this._vertexes.length == 0) {
            head_ver = ver
        }
        else {
            this._vertexes.pop()
            head_ver = {x: this._vertexes[0].x, y: this._vertexes[0].y}
        }
        this._vertexes.push(ver)
        this._vertexes.push(head_ver)
    }
}