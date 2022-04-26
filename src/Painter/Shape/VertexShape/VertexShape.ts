import { Coords } from "Painter/Coords";
import { IShapeGrid } from "../IShapeGrid";
import { Shape } from "../Shape";

export abstract class VertexShape extends Shape implements IShapeGrid {
    abstract readonly vertexes_count: number
    protected _vertexes: Coords[] = []
    _grid_vertexes: Coords[] = []
    
    constructor(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number) {
        super(pos, bg_clr, stroke_clr, stroke_size)
        this._vertexes = []
    }

    _update_grid_vertexes(): void {
        let max_x = 0, min_x = Infinity
        let max_y = 0, min_y = Infinity
        for (let ver of this._vertexes) {
            let x = ver.x, y = ver.y
            if (x > max_x) max_x = x
            if (x < min_x) min_x = x
            if (y > max_y) max_y = y
            if (y < min_y) min_y = y
        }
        while (this._grid_vertexes.pop()) {}
        this._grid_vertexes.push({x:min_x-10, y:min_y-10})
        this._grid_vertexes.push({x:max_x+10, y:min_y-10})
        this._grid_vertexes.push({x:max_x+10, y:max_y+10})
        this._grid_vertexes.push({x:min_x-10, y:max_y+10})
        this._grid_vertexes.push({x:min_x-10, y:min_y-10})
    }
    
    get_grid_vertexes(): Coords[] {
        this._update_grid_vertexes()
        return this._grid_vertexes
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

    _update_vertexes(new_pos: Coords) {
        if (this._pos !== null) {
            let x_offset = this._pos.x-new_pos.x
            let y_offset = this._pos.y-new_pos.y
            for (let i = 0; i < this._vertexes.length; i++) {
                this._vertexes[i].x -= x_offset
                this._vertexes[i].y -= y_offset
            }
        }
    }

    set_pos(coords: Coords) {
        if (this._vertexes !== undefined) {
            if (this._vertexes.length > 0) {
                this._update_vertexes(coords)
            }
        }
        this._pos = coords
    }
 
}