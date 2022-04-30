import { EllipseShape } from './../Shape/ArcShape/EllipseShape/EllipseShape';
import { PolygonShape } from './../Shape/VertexShape/PolygonShape/PolygonShape';
import { RectShape } from './../Shape/VertexShape/RectShape/RectShape';
import { MultiLineShape } from './../Shape/VertexShape/MultiLineShape/MultiLineShape';
import { LineShape } from './../Shape/VertexShape/LineShape/LineShape';
import { ComplexShape } from 'Painter/Shape/ComplexShape/ComplexShape';
import { Shape } from 'Painter/Shape/Shape';

export const SUPPORTED_SHAPES: [Object, Object, Object, Object, Object, Object] = [
    LineShape,
    MultiLineShape,
    RectShape,
    PolygonShape,
    EllipseShape,
    ComplexShape
]

export const get_supported_class_names = (): string[] => {
    let class_names = SUPPORTED_SHAPES.map((element)=>{
        let cls: any = element
        return cls.name
    })
    return class_names
}

export const is_shape_supported = (shape: Shape): boolean => {
    let construct: any = shape.constructor
    let class_names = get_supported_class_names()
    let ret = class_names.indexOf(construct.name) >= 0 || shape instanceof ComplexShape
    return ret
}