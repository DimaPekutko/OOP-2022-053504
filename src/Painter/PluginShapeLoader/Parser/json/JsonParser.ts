import { ArcShape } from 'Painter/Shape/ArcShape/ArcShape';
import { VertexShape } from 'Painter/Shape/VertexShape/VertexShape';
import { ComplexShape } from './../../../Shape/ComplexShape/ComplexShape';
import { SUPPORTED_SHAPES, get_supported_class_names } from './../../PluginsConfig';
import { Shape } from "Painter/Shape/Shape";
import { Coords } from 'Painter/Coords';

export abstract class JsonParser {

    private static _parse_shape(obj: any): Shape | null {
        let shape_class: string = obj.class
        let supported_class_index = get_supported_class_names().indexOf(shape_class)
        if (supported_class_index >= 0) {
            let cls: any = SUPPORTED_SHAPES[supported_class_index]
            let pos: Coords = obj.pos
            let bg_clr: string = obj.bg_color
            let stroke_clr: string = obj.brush_color
            let stroke_size: number = obj.brush_size
            let shape = new cls(pos, bg_clr, stroke_clr, stroke_size)
            if (shape instanceof ComplexShape) {
                let internal_shapes = obj.shapes.map((el: any) => {
                    return this._parse_shape(el)
                })
                shape.set_internal_shapes(internal_shapes)
            }
            else if (shape instanceof VertexShape) {
                let vertexes: Coords[] = obj.vertexes
                shape.set_vertexes(vertexes)
            }
            else if (shape instanceof ArcShape) {
                shape.set_radii(obj.xrad, obj.yrad)
            }
            return shape
        }
        return null
    }

    public static parse(source: string): Shape | null {
        const shape = this._parse_shape(JSON.parse(source))
        return shape
    }
}