import { ShapesList } from '../Shape/ShapesList';
import { LineShapeFactory } from './../Shape/VertexShape/LineShape/LineShapeFactory';
import { ShapeFactory } from 'Painter/Shape/ShapeFactory';
import { Shape } from 'Painter/Shape/Shape';
import { LineShape } from './../Shape/VertexShape/LineShape/LineShape';
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
    private _preview_shape: Shape | null = null

    constructor(cnv: any) {
        this.state = new CanvasState()        
        this._shapes = new ShapesList()
        this._shape_factory = new LineShapeFactory()
        this._ctx = cnv?.getContext("2d")
        this._cnv = cnv

        this._cnv.width = this._cnv.clientWidth
        this._cnv.height = this._cnv.clientHeight
        this.clear_canvas()
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
    
    private _draw_shape(shape: Shape, is_preview: boolean = false) {
        const c = this._ctx
        c.globalAlpha = is_preview ? 0.5 : 1
        const bg_color = shape.get_bg_color()
        c.strokeStyle = shape.get_stroke_color()
        c.lineWidth = shape.get_stroke_szie()
        c.beginPath()
        if (shape instanceof VertexShape) {
            const vertexes = shape.get_vertexes()
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
        }
        else if (shape instanceof ArcShape) {
            const pos = shape.get_pos()
            const radii = shape.get_radii()
            if (pos !== null) {
                c.beginPath()
                c.ellipse(pos.x, pos.y, radii[0], radii[1], 0, 0, 2*Math.PI);
                c.closePath()
            }
        }
        if (bg_color && shape.to_fill) {
            c.fillStyle = bg_color
            c.fill()
        }
        c.stroke()
        c.globalAlpha = 1
    }

    public mouse_down(cnv_x: number, cnv_y: number) {
        const pos = this._global_pos_to_local({x:cnv_x, y:cnv_y})
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

    public mouse_up(cnv_x: number, cnv_y: number) {
        this._render()
    }

    public mouse_move(cnv_x: number, cnv_y: number) {
        const pos = this._global_pos_to_local({x:cnv_x, y:cnv_y})
        if (this._preview_shape !== null) {
            if (this._preview_shape instanceof VertexShape) {
                this._preview_shape.pop_vertex()
                this._preview_shape.push_vertex({x: pos.x, y: pos.y})
            }
            else if (this._preview_shape instanceof ArcShape) {
                this._preview_shape.set_proportions_by_pos(pos)
            }
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
        this._shapes.pop()
        this._render()
    }

    // private _rgb_to_hex(r: number, g: number, b: number) {
    //     if (r > 255 || g > 255 || b > 255)
    //         throw "Invalid color component";
    //     return ((r << 16) | (g << 8) | b).toString(16);
    // }

    // private _draw_figure(pos: Coords) {
    //     const c = this._ctx
    //     c.strokeStyle = this.state._brush_color
    //     c.lineWidth = this.state._brush_size
    //     if (this.state._last_draw_coords) {
    //         const last_pos = this.state._last_draw_coords
    //         c.beginPath()
    //         c.moveTo(last_pos.x, last_pos.y)
    //         c.lineTo(pos.x, pos.y)
    //         c.closePath()
    //         c.stroke()
    //     }
    //     this.state.set_last_coords(pos)
    // }

    // private _get_hex_by_pixel(pos: Coords) {
    //     const c = this._ctx
    //     let p = c.getImageData(pos.x, pos.y, 1, 1).data; 
    //     let hex = "#"+this._rgb_to_hex(p[0], p[1], p[2])
    //     return hex
    // }

    // private _fill_figure(pos: Coords) {
    //     // this._recursive_fill(pos, "blue", this._get_hex_by_pixel(pos))
    //     type Pixel = {
    //         clr: string,
    //         pos: Coords
    //     }
    //     let new_clr = "blue"
    //     let hex: string = this._get_hex_by_pixel(pos)
    //     let stack: Pixel[] = []
    //     stack.push({clr:hex,pos:pos})
    //     while(stack.length > 0) {
    //         let p = stack.pop()
    //         if (p == undefined) break
    //         let left_x = p.pos.x
    //         let right_x = p.pos.x
    //         while (left_x >= 0 && this._get_hex_by_pixel({x: left_x, y: p.pos.y}) == p.clr) 
    //             left_x--
    //         while (right_x < this._cnv.width  && this._get_hex_by_pixel({x: left_x, y: p.pos.y}) == p.clr) 
    //             right_x++
    //         left_x++
    //         right_x--
    //         while (left_x < this._cnv.width && this._get_hex_by_pixel({x: left_x, y: p.pos.y}) == p.clr) {
    //             this._ctx.fillStyle = new_clr
    //             this._ctx.fillRect(left_x,p.pos.y,1,1)
    //             let new_pos_top = {x:left_x,y:p.pos.y-1}
    //             let new_pos_down = {x:left_x,y:p.pos.y+1}
    //             if (this._get_hex_by_pixel(new_pos_top) == p.clr) {
    //                 stack.push({clr: p.clr, pos:new_pos_top})
    //             }
    //             if (this._get_hex_by_pixel(new_pos_down) == p.clr) {
    //                 stack.push({clr: p.clr, pos:new_pos_down})
    //             }
    //             left_x++
    //         }
    //     }
    // }

    // private _on_mouse_move(e: MouseEvent) {
    //     const pos: Coords = this._global_pos_to_local({x: e.clientX, y: e.clientY})
    //     if (this.state._is_mouse_pressed && this.state._paint_mode == PAINT_MODES.draw) {
    //         this._draw_figure(pos)
    //     }
    // }
    // private _on_mouse_down(e: MouseEvent) {
    //     const pos: Coords = this._global_pos_to_local({x: e.clientX, y: e.clientY})
    //     if (this.state._paint_mode == PAINT_MODES.view) {
    //         this._fill_figure(pos)
    //     }
    //     else {
    //         // let rect = new RectShape()
    //         // rect.set_pos({x: pos.x, y: pos.y})
    //         // rect.draw(this._ctx)
    //     }
    //     this.state.set_mouse_pressed(true)
    // }
    // private _on_mouse_up(e: MouseEvent) {
    //     this.state.set_mouse_pressed(false)
    //     this.state.set_last_coords(null)
    // }
}