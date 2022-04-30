import { SUPPORTED_SHAPES, is_shape_supported } from './../../PluginsConfig';
import { ArcShape } from 'Painter/Shape/ArcShape/ArcShape';
import { VertexShape } from 'Painter/Shape/VertexShape/VertexShape';
import { Shape } from 'Painter/Shape/Shape';
import { ComplexShape } from './../../../Shape/ComplexShape/ComplexShape';
export abstract class JsonSerializer {

    private static _set_shape_fields(obj: any, shape: Shape) {
        let construct: any = shape.constructor
        obj.class = construct.name
        obj.pos = shape.get_pos()
        obj.bg_color = shape.get_bg_color()
        obj.to_fill = shape.to_fill
        obj.brush_color = shape.get_stroke_color()
        obj.brush_size = shape.get_stroke_size()
    }

    private static _visit_arc_shape(shape: ArcShape): object {
        const radii = shape.get_radii()
        const obj: any = {}
        this._set_shape_fields(obj, shape)
        obj.xrad = radii[0]
        obj.yrad = radii[1]
        return obj
    }

    private static _visit_vertex_shape(shape: VertexShape): object {
        const obj: any = {}
        this._set_shape_fields(obj, shape)
        obj.vertexes = []

        const vertexes = shape.get_vertexes()
        for (let i = 0; i < vertexes.length; i++) {
            obj.vertexes.push(vertexes[i])
        }
        return obj
    }

    private static _visit_complex_shape(shape: ComplexShape): object  {
        const obj: any = {}
        this._set_shape_fields(obj, shape)
        obj.shapes = []
        
        const internal_shapes = shape.get_internal_shapes()
        for (let i = 0; i < internal_shapes.length; i++) {
            let serialized = this._visit_shape(internal_shapes[i])
            obj.shapes.push(serialized)
        }
        return obj
    }

    private static _visit_shape(shape: Shape): object {
        if (is_shape_supported(shape)) {
            if (shape instanceof ComplexShape) {
                return this._visit_complex_shape(shape)
            }
            else if (shape instanceof VertexShape) {
                return this._visit_vertex_shape(shape)
            }
            else if (shape instanceof ArcShape) {
                return this._visit_arc_shape(shape)
            }
        }
        throw new Error("Undefined serialization shape type (_visit_shape method).")
    }

    public static serialize(shape: ComplexShape): string {
        const obj = this._visit_shape(shape)

        return JSON.stringify(obj)
    }
}