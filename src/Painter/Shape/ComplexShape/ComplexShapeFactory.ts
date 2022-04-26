import { Shape } from "Painter/Shape/Shape";
import { ShapeFactory } from "Painter/Shape/ShapeFactory";
import { Coords } from 'Painter/Coords';
import { ComplexShape } from "./ComplexShape";

export class ComplexShapeFactory extends ShapeFactory {

    private _internal_shapes: Shape[]

    constructor(internal_shapes: Shape[]) {
        super()
        this._internal_shapes = internal_shapes
    }
    
    create(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number): Shape {
        const compelex_shape = new ComplexShape(pos, bg_clr, stroke_clr, stroke_size, this._internal_shapes)
        return compelex_shape
    }
}