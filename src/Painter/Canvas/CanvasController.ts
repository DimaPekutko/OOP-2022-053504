import { ComplexShape } from './../Shape/ComplexShape/ComplexShape';
import { IShapeGrid } from './../Shape/IShapeGrid';
import { ShapesList } from '../Shape/ShapesList';
import { LineShapeFactory } from './../Shape/VertexShape/LineShape/LineShapeFactory';
import { ShapeFactory } from 'Painter/Shape/ShapeFactory';
import { Shape } from 'Painter/Shape/Shape';
import { Coords } from '../Coords';
import { CanvasState, PAINT_MODES } from './CanvasState';
import { VertexShape } from 'Painter/Shape/VertexShape/VertexShape';
import { ArcShape } from 'Painter/Shape/ArcShape/ArcShape';

export class CanvasController {
    
    readonly state: CanvasState
    private _cnv: HTMLCanvasElement
    private _ctx: CanvasRenderingContext2D
    private _shape_factory: ShapeFactory
    private _shapes: ShapesList
    private _selected_shapes: ShapesList
    private _preview_shape: Shape | null = null

    constructor(cnv: any) {
        this.state = new CanvasState()        
        this._shapes = new ShapesList()
        this._selected_shapes = new ShapesList()
        this._shape_factory = new LineShapeFactory()
        this._ctx = cnv?.getContext("2d")
        this._cnv = cnv

        this._cnv.width = this._cnv.clientWidth
        this._cnv.height = this._cnv.clientHeight
        this.clear_canvas()
    }

    public get_selected_shapes(): Shape[] {
        let ret = this._selected_shapes.get_shapes()
        return ret
    }

    public gen_complex_shape_from_selected(): ComplexShape {
        let shapes = this._selected_shapes.get_shapes()
        const shape = new ComplexShape(
            {x: 0, y: 0},
            this.state._fill_color,
            this.state._brush_color,
            this.state._brush_size,
        )
        shape.set_internal_shapes(shapes)
        return shape
    }

    public set_shape_factory(factory: ShapeFactory) {
        this._shape_factory = factory
        this._preview_shape = null
    }
    
    public clear_canvas() {
        this._ctx.fillStyle = "white"
        this._ctx.fillRect(0,0,this._cnv.width,this._cnv.height)
    }

    private _global_pos_to_local(coords: Coords): Coords {
        let x = Math.abs(coords.x - this._cnv.offsetLeft)
        let y = Math.abs(coords.y - this._cnv.offsetTop)
        return {x: x, y: y}
    }

    private _render() {
        this.clear_canvas()
        // shapes list render
        for (let shape of this._shapes.get_shapes()) {
            this._draw_shape(shape)
        }
        // preview shape render
        if (this._preview_shape !== null) {
            this._draw_shape(this._preview_shape, true)
        }
    }
    
    private _draw_shape_grid(shape: IShapeGrid, is_selected: boolean = false) {
        const c = this._ctx
        const vertexes = shape.get_grid_vertexes()
        c.strokeStyle = is_selected ? "red" : "blue"
        c.lineWidth = 3
        c.setLineDash([10])
        c.beginPath()
        let ver: Coords = {x:0,y:0}
        for (let i = 0; i < vertexes.length; i++) {
            ver = vertexes[i]
            if (i == 0) {
                c.moveTo(ver.x, ver.y)
            }
            else {
                c.lineTo(ver.x, ver.y)
            }
        }
        c.moveTo(ver.x, ver.y)
        c.closePath()
        c.stroke()
        c.setLineDash([])
    }

    private _draw_vertex_shape(shape: VertexShape, is_preview: boolean = false) {
        const c = this._ctx
        const bg_color = shape.get_bg_color()
        const vertexes = shape.get_vertexes()
        let ver: Coords = {x:0,y:0}
        c.globalAlpha = is_preview ? 0.5 : 1
        c.strokeStyle = shape.get_stroke_color()
        c.lineWidth = shape.get_stroke_size()
        c.beginPath()
        for (let i = 0; i < vertexes.length; i++) {
            ver = vertexes[i]
            if (i == 0) {
                c.moveTo(ver.x, ver.y)
            }
            else {
                c.lineTo(ver.x, ver.y)
            }
        }
        c.moveTo(ver.x, ver.y)
        c.closePath()
        if (bg_color && shape.to_fill) {
            c.fillStyle = bg_color
            c.fill()
        }
        c.stroke()
        c.globalAlpha = 1
    }

    private _draw_arc_shape(shape: ArcShape, is_preview: boolean = false) {
        const c = this._ctx
        const bg_color = shape.get_bg_color()
        c.globalAlpha = is_preview ? 0.5 : 1
        c.strokeStyle = shape.get_stroke_color()
        c.lineWidth = shape.get_stroke_size()
        const pos = shape.get_pos()
        const radii = shape.get_radii()
        if (pos !== null) {
            c.beginPath()
            c.ellipse(pos.x, pos.y, radii[0], radii[1], 0, 0, 2*Math.PI);
            c.closePath()
        }
        if (bg_color && shape.to_fill) {
            c.fillStyle = bg_color
            c.fill()
        }
        c.stroke()
        c.globalAlpha = 1
    } 

    private _draw_shape(shape: Shape, is_preview: boolean = false) {
        if (shape instanceof VertexShape) {
            this._draw_vertex_shape(shape, is_preview)
        }
        else if (shape instanceof ArcShape) {
            this._draw_arc_shape(shape, is_preview)
        }
        
        let is_selected = false
        if (this._selected_shapes.get_shapes().indexOf(shape) >= 0) {
            is_selected = true
        }
        this.state._paint_mode == PAINT_MODES.view ? this._draw_shape_grid(shape, is_selected) : null

    }

    private _new_shape(pos: Coords) {
        // generate new preview shape
        if (this._preview_shape === null) {
            this._preview_shape = this._shape_factory.create(
                {x: pos.x, y: pos.y},
                this.state._fill_color,
                this.state._brush_color,
                this.state._brush_size
            )
            if (this._preview_shape instanceof VertexShape) {
                this._preview_shape.push_vertex({x:pos.x, y:pos.y})
                this._preview_shape.push_vertex({x:pos.x, y:pos.y})
            }
        }
        // adding preview shape to shapes list (draw preview shape)
        else {
            if (this._preview_shape instanceof VertexShape) {
                if (this._preview_shape.vertexes_count <= this._preview_shape.get_vertexes().length) {
                    this._shapes.push(this._preview_shape)
                    this._preview_shape = null
                }
                else {
                    this._preview_shape.push_vertex({x: pos.x, y: pos.y})
                }
            }
            else {
                this._shapes.push(this._preview_shape)
                this._preview_shape = null
            }
        }
        // combined shape
        this._render()
    }

    private _hit_shape(pos: Coords): Shape | null {
        let shapes = this._shapes.get_shapes()
        for (let i = shapes.length-1; i >= 0; i--) {
            this._draw_shape_grid(shapes[i])
            if (this._ctx.isPointInPath(pos.x, pos.y)) {
                return shapes[i]
            }
        }
        return null
    }

    public mouse_down(cnv_x: number, cnv_y: number) {
        const pos = this._global_pos_to_local({x:cnv_x, y:cnv_y})
        const paint_mode = this.state._paint_mode
        if (paint_mode == PAINT_MODES.draw) {
            this._new_shape(pos)
        }
        else if (paint_mode == PAINT_MODES.view) {
            const hitted_shape = this._hit_shape(pos)
            if (hitted_shape !== null) {
                this._selected_shapes.push(hitted_shape)
            } 
        }
    }

    public mouse_up(cnv_x: number, cnv_y: number) {
        const paint_mode = this.state._paint_mode
        if (paint_mode == PAINT_MODES.view && !this.state._is_selection_now) {
            while(this._selected_shapes.pop()) {} 
        }
        this._render()
    }

    public mouse_move(cnv_x: number, cnv_y: number) {
        const pos = this._global_pos_to_local({x:cnv_x, y:cnv_y})
        const paint_mode = this.state._paint_mode
        if (paint_mode == PAINT_MODES.draw) {
            if (this._preview_shape !== null) {
                if (this._preview_shape instanceof VertexShape) {
                    this._preview_shape.pop_vertex()
                    this._preview_shape.push_vertex({x: pos.x, y: pos.y})
                }
                else if (this._preview_shape instanceof ArcShape) {
                    this._preview_shape.set_proportions_by_pos(pos)
                }
            }
        }
        else if (
            paint_mode == PAINT_MODES.view && 
            this._selected_shapes.get_shapes().length > 0 &&
            !this.state._is_selection_now
        ) {
            let shapes = this._selected_shapes.get_shapes()
            shapes[0].set_pos({
                x: pos.x,
                y: pos.y
            })
        }
        this._render()
    }

    public enter_action() {
        if (this._preview_shape instanceof VertexShape) {
            this._shapes.push(this._preview_shape)
            this._preview_shape = null
        }
        this._render()
    }

    public undo_action() {
        if (this.state._paint_mode == PAINT_MODES.draw) {
            this._shapes.pop()
            this._render()
        }
    }
}