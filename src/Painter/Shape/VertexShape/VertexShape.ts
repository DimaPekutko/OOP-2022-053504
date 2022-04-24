import { Coords } from "Painter/Coords";
import { Shape } from "../Shape";

export abstract class VertexShape extends Shape {
    abstract readonly vertexes_count: number
    protected _vertexes: Coords[] = []
    
    constructor(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number) {
        super(pos, bg_clr, stroke_clr, stroke_size)
    }
    
    push_vertex(ver: Coords): void {
        if (this._vertexes.length < this.vertexes_count) {
            this._vertexes.push(ver)
        }
    }

    pop_vertex(): Coords | null {
        const ver = this._vertexes.pop()
        return ver !== undefined ? ver : null
    }

    get_vertexes(): Coords[] {
        return this._vertexes
    }
 
}