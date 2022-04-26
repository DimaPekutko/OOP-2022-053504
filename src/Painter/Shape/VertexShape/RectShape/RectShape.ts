import { Coords } from "Painter/Coords";
import { VertexShape } from "../VertexShape";

export class RectShape extends VertexShape {
    to_fill: boolean = true
    vertexes_count: number = 4
    constructor(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number) {
        super(pos, bg_clr, stroke_clr, stroke_size)
    }

    push_vertex(ver: Coords): void {
        if (this._vertexes.length == 0) {
            this._vertexes.push(ver)
        }
        else if (this._vertexes.length >= 1 && this._vertexes.length <= 4) {
            while (this._vertexes.length !== 1) {
                this._vertexes.pop()
            }
            let head_ver = this._vertexes[0]
            this._vertexes.push({x:head_ver.x, y: ver.y})
            this._vertexes.push(ver)
            this._vertexes.push({x:ver.x, y:head_ver.y})
            this._vertexes.push({x: head_ver.x, y: head_ver.y})
        }
    }
}