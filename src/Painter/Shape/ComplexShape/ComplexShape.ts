import { Coords } from 'Painter/Coords';
import { Shape } from 'Painter/Shape/Shape';
export class ComplexShape extends Shape {
    to_fill: boolean = false
    private _internal_shapes: Shape[]

    constructor(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number, shapes_list: Shape[] = []) {
        super(pos, bg_clr, stroke_clr, stroke_size)
        this._internal_shapes = shapes_list
    }
 
    set_internal_shapes(shapes: Shape[]): void {
        this._internal_shapes = shapes
    }
    
    get_internal_shapes(): Shape[] {
        return this._internal_shapes
    }

}