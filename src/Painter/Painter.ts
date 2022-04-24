import { PolygonShapeFactory } from './Shape/VertexShape/PolygonShape/PolygonShapeFactory';
import { MultiLineShapeFactory } from './Shape/VertexShape/MultiLineShape/MultiLineShapeFactory';
import { RectShapeFactory } from './Shape/VertexShape/RectShape/RectShapeFactory';
import { LineShapeFactory } from './Shape/VertexShape/LineShape/LineShapeFactory';
import { CanvasController } from './Canvas/CanvasController';
import { PAINT_MODES } from './Canvas/CanvasState';
import { EllipseShapeFactory } from './Shape/ArcShape/EllipseShape/EllipseShapeFactory';

export class Painter {
    cnv: CanvasController | null = null
    
    public run(status: boolean = true) {
        const canvas: any = document.getElementById("paint_canvas")
        this.cnv = new CanvasController(canvas)

        const cursor_btn = document.getElementById("cnv_cursor_btn")
        const line_btn = document.getElementById("cnv_line_btn")
        const multi_line_btn = document.getElementById("cnv_multi_line_btn")
        const rect_btn = document.getElementById("cnv_rect_btn")
        const ellipse_btn = document.getElementById("cnv_ellipse_btn")
        const polygon_btn = document.getElementById("cnv_polygon_btn")

        const cnv_brush_color_input = document.getElementById("cnv_brush_color_input")
        const cnv_fill_color_input = document.getElementById("cnv_fill_color_input")
        const cnv_brush_size_input = document.getElementById("cnv_brush_size_input")

        // setup handlers
        canvas.addEventListener("mousemove", this._on_cnv_mouse_move.bind(this))
        canvas.addEventListener("mousedown", this._on_cnv_mouse_down.bind(this))
        canvas.addEventListener("mouseup", this._on_cnv_mouse_up.bind(this))

        cursor_btn?.addEventListener("click", this._on_cursor_btn_click.bind(this))
        line_btn?.addEventListener("click", this._on_line_btn_click.bind(this))
        multi_line_btn?.addEventListener("click", this._on_multi_line_btn_click.bind(this))
        rect_btn?.addEventListener("click", this._on_rect_btn_click.bind(this))
        ellipse_btn?.addEventListener("click", this._on_ellipse_btn_click.bind(this))
        polygon_btn?.addEventListener("click", this._on_polygon_btn_click.bind(this))

        cnv_brush_color_input?.addEventListener("change", this._on_cnv_brush_color_change.bind(this))
        cnv_fill_color_input?.addEventListener("change", this._on_cnv_fill_color_change.bind(this))
        cnv_brush_size_input?.addEventListener("change", this._on_cnv_brush_size_change.bind(this))

        document.addEventListener('keydown', this._on_global_keydown.bind(this))
        
    }

    private _on_cnv_mouse_move(e: MouseEvent) {
        this.cnv?.mouse_move(e.x,e.y)
        // const pos: Coords = this._global_pos_to_local({x: e.clientX, y: e.clientY})
        // if (this.state._is_mouse_pressed && this.state._paint_mode == PAINT_MODES.draw) {
        //     this._draw_figure(pos)
        // }
    }
    private _on_cnv_mouse_down(e: MouseEvent) {
        // this.cnv?.draw_shape(e.x,e.y)
        this.cnv?.mouse_down(e.x,e.y)
        // const pos: Coords = this._global_pos_to_local({x: e.clientX, y: e.clientYj})
        // if (this.state._paint_mode == PAINT_MODES.view) {
        //     this._fill_figure(pos)
        // }
        // else {
        //     // let rect = new RectShape()
        //     // rect.set_pos({x: pos.x, y: pos.y})
        //     // rect.draw(this._ctx)
        // }
        // this.state.set_mouse_pressed(true)
    }
    private _on_cnv_mouse_up(e: MouseEvent) {
        this.cnv?.state.set_mouse_pressed(false)
        this.cnv?.state.set_last_coords(null)
    }
    private _on_cursor_btn_click(e: any) {
        this.cnv?.state.set_paint_mode(PAINT_MODES.view)
    }
    private _on_line_btn_click(e: any) {
        this.cnv?.set_shape_factory(new LineShapeFactory())
    }
    private _on_multi_line_btn_click(e: any) {
        this.cnv?.set_shape_factory(new MultiLineShapeFactory())
    }
    private _on_rect_btn_click(e: any) {
        this.cnv?.set_shape_factory(new RectShapeFactory())
    }
    private _on_ellipse_btn_click(e: any) {
        this.cnv?.set_shape_factory(new EllipseShapeFactory())
    }
    private _on_polygon_btn_click(e: any) {
        this.cnv?.set_shape_factory(new PolygonShapeFactory())
    }
    private _on_cnv_brush_color_change(e: any) {
        let color = e.target.value
        if (this.cnv) {
            this.cnv.state.set_brush_color(color)
        }
    }
    private _on_cnv_fill_color_change(e: any) {
        let color = e.target.value
        if (this.cnv) {
            this.cnv.state.set_fill_color(color)
        }
    }
    private _on_cnv_brush_size_change(e: any) {
        let size: number = e.target.value
        if (this.cnv) {
            this.cnv.state.set_brush_size(size)
        }
    }
    private _on_global_keydown(e: KeyboardEvent) {
        if(e.key === "Enter") {
            this.cnv?.enter_action()
        }
        else if (e.ctrlKey && ["z", "Z"].indexOf(e.key) >= 0) {
            this.cnv?.undo_action()
        }
    }
}