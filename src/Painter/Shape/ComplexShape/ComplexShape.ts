import { Coords } from 'Painter/Coords';
import { Shape } from 'Painter/Shape/Shape';

export class ComplexShape extends Shape {
    to_fill: boolean = false
    private _internal_shapes: Shape[]

    constructor(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number) {
        super(pos, bg_clr, stroke_clr, stroke_size)
        this._internal_shapes = []
    }
 
    _update_grid_vertexes(): void {
        let max_x = 0, min_x = Infinity
        let max_y = 0, min_y = Infinity

        for (let i = 0; i < this._internal_shapes.length; i++) {
            let shape = this._internal_shapes[i]
            let _max_x = 0, _min_x = Infinity
            let _max_y = 0, _min_y = Infinity
            for (let ver of shape.get_grid_vertexes()) {
                let x = ver.x, y = ver.y
                if (x > _max_x) _max_x = x
                if (x < _min_x) _min_x = x
                if (y > _max_y) _max_y = y
                if (y < _min_y) _min_y = y
            }
            if (_max_x > max_x) max_x = _max_x
            if (_min_x < min_x) min_x = _min_x
            if (_max_y > max_y) max_y = _max_y
            if (_min_y < min_y) min_y = _min_y
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

    get_internal_shapes(): Shape[] {
        return this._internal_shapes
    }

    set_internal_shapes(shapes: Shape[]) {
        if (shapes.length > 0) {
            let first_shape_pos = shapes[0].get_pos()
            if (first_shape_pos) {
                this._pos = {x: first_shape_pos.x, y: first_shape_pos.y}
            }
            this._internal_shapes = shapes
        }
    }
    

    set_stroke_size(size: number) {
        if (size > 0) {
            for (let i = 0; i < this._internal_shapes.length; i++) {
                this._internal_shapes[i].set_stroke_size(size)
            }
        }
    }

    set_pos(coords: Coords): void {
        for (let i = 0; i < this._internal_shapes.length; i++) {
            let last_pos = this._internal_shapes[i].get_pos()
            let x_offset = 0
            let y_offset = 0
            if (last_pos && this._pos) {
                x_offset = last_pos.x-this._pos.x
                y_offset = last_pos.y-this._pos.y
            }
            this._internal_shapes[i].set_pos({x: coords.x+x_offset, y: coords.y+y_offset})
        }
        this._pos = coords
    }
}