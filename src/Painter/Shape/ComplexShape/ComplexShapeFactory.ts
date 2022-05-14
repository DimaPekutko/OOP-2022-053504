import { ArcShape } from 'Painter/Shape/ArcShape/ArcShape';
import { SUPPORTED_SHAPES } from './../../PluginShapeLoader/PluginsConfig';
import { VertexShape } from 'Painter/Shape/VertexShape/VertexShape';
import { Shape } from "Painter/Shape/Shape";
import { ShapeFactory } from "Painter/Shape/ShapeFactory";
import { Coords } from 'Painter/Coords';
import { ComplexShape } from "./ComplexShape";
import { get_supported_class_names } from 'Painter/PluginShapeLoader/PluginsConfig';



export class ComplexShapeFactory extends ShapeFactory {

    private _internal_shapes: Shape[]

    constructor(internal_shapes: Shape[]) {
        super()
        this._internal_shapes = internal_shapes
    }

    private _copy_coord(coord: Coords): Coords {
        return {x: coord.x, y: coord.y}
    }

    private _clone_shapes(shapes: Shape[]): Shape[] {
        let res: Shape[] = []
        for (let shape of shapes) {
            let new_pos = shape.get_pos()
            if (new_pos) {
                let shape_construct: any = shape.constructor
                let supported_class_index = get_supported_class_names().indexOf(shape_construct.name)
                let new_cls: any = SUPPORTED_SHAPES[supported_class_index]
                let new_shape = new new_cls(
                    this._copy_coord(new_pos),
                    shape.get_bg_color(),
                    shape.get_stroke_color(),
                    shape.get_stroke_size()
                )
                if (new_shape instanceof VertexShape && shape instanceof VertexShape) {
                    let old_vertexes = shape.get_vertexes()
                    let new_vertexes = []
                    for (let i = 0; i < old_vertexes.length; i++) {
                        new_vertexes.push(this._copy_coord(old_vertexes[i]))
                    }
                    new_shape.set_vertexes(new_vertexes)
                }
                else if (new_shape instanceof ArcShape && shape instanceof ArcShape) {
                    let radii = shape.get_radii()
                    new_shape.set_radii(radii[0], radii[1])
                }
                else if (new_shape instanceof ComplexShape && shape instanceof ComplexShape) {
                    const copyed_shapes = this._clone_shapes(shape.get_internal_shapes())
                    new_shape.set_internal_shapes(copyed_shapes)
                }
                res.push(new_shape)
            }
        }
        return res
    }

    create(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number): Shape {
        const compelex_shape = new ComplexShape(pos, bg_clr, stroke_clr, stroke_size)
        const copyed_shapes = this._clone_shapes(this._internal_shapes)
        compelex_shape.set_internal_shapes(copyed_shapes)
        // compelex_shape.set_internal_shapes(this._internal_shapes)
        return compelex_shape
    }
}