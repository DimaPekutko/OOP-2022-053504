import { EllipseShape } from './../Shape/ArcShape/EllipseShape/EllipseShape';
import { PolygonShape } from './../Shape/VertexShape/PolygonShape/PolygonShape';
import { RectShape } from './../Shape/VertexShape/RectShape/RectShape';
import { MultiLineShape } from './../Shape/VertexShape/MultiLineShape/MultiLineShape';
import { LineShape } from './../Shape/VertexShape/LineShape/LineShape';

export const SUPPORTED_SHAPES: [Object, Object, Object, Object, Object] = [
    LineShape,
    MultiLineShape,
    RectShape,
    PolygonShape,
    EllipseShape
]