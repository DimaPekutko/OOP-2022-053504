import { Shape } from "Painter/Shape/Shape";
import { ShapeFactory } from "Painter/Shape/ShapeFactory";
import { Coords } from 'Painter/Coords';
import { PolygonShape } from "./PolygonShape";

export class PolygonShapeFactory extends ShapeFactory {
    create(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number): Shape {
        return new PolygonShape(pos, bg_clr, stroke_clr, stroke_size)
    }

}