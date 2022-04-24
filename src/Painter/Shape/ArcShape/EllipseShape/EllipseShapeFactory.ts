import { EllipseShape } from './EllipseShape';
import { Shape } from "Painter/Shape/Shape";
import { ShapeFactory } from "Painter/Shape/ShapeFactory";
import { Coords } from 'Painter/Coords';

export class EllipseShapeFactory extends ShapeFactory {
    create(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number): Shape {
        return new EllipseShape(pos, bg_clr, stroke_clr, stroke_size)
    }

}