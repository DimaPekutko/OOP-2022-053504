import { Shape } from "Painter/Shape/Shape";
import { ShapeFactory } from "Painter/Shape/ShapeFactory";
import { Coords } from 'Painter/Coords';
import { RectShape } from "./RectShape";

export class RectShapeFactory extends ShapeFactory {
    create(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number): Shape {
        return new RectShape(pos, bg_clr, stroke_clr, stroke_size)
    }

}