import { Coords } from 'Painter/Coords';
import { Shape } from 'Painter/Shape/Shape';

export abstract class ShapeFactory {
    abstract create(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number): Shape 
}