import { ShapeFactory } from 'Painter/Shape/ShapeFactory';
import { ComplexShapeFactory } from './Shape/ComplexShape/ComplexShapeFactory';
import { ComplexShape } from './Shape/ComplexShape/ComplexShape';
import { PluginShapeLoader, PLUGIN_EXT } from './PluginShapeLoader/PluginShapeLoader';
import { PolygonShapeFactory } from './Shape/VertexShape/PolygonShape/PolygonShapeFactory';
import { MultiLineShapeFactory } from './Shape/VertexShape/MultiLineShape/MultiLineShapeFactory';
import { RectShapeFactory } from './Shape/VertexShape/RectShape/RectShapeFactory';
import { LineShapeFactory } from './Shape/VertexShape/LineShape/LineShapeFactory';
import { CanvasController } from './Canvas/CanvasController';
import { PAINT_MODES } from './Canvas/CanvasState';
import { EllipseShapeFactory } from './Shape/ArcShape/EllipseShape/EllipseShapeFactory';

export class Painter {
    private cnv: CanvasController | null = null
    private _plugin_loader: PluginShapeLoader | null = null
    private _plugin_btn_handlers: any = {}

    public run(status: boolean = true) {
        const canvas: any = document.getElementById("paint_canvas")
        this.cnv = new CanvasController(canvas)
        this._plugin_loader = new PluginShapeLoader(PLUGIN_EXT.json)

        canvas.addEventListener("mousemove", this._on_cnv_mouse_move.bind(this))
        canvas.addEventListener("mousedown", this._on_cnv_mouse_down.bind(this))
        canvas.addEventListener("mouseup", this._on_cnv_mouse_up.bind(this))
        
        this._setup_ui_handlers()
        
    }

    private _setup_ui_handlers() {
        const cursor_btn = document.getElementById("cnv_cursor_btn")
        const line_btn = document.getElementById("cnv_line_btn")
        const multi_line_btn = document.getElementById("cnv_multi_line_btn")
        const rect_btn = document.getElementById("cnv_rect_btn")
        const ellipse_btn = document.getElementById("cnv_ellipse_btn")
        const polygon_btn = document.getElementById("cnv_polygon_btn")

        const new_shape_btn = document.getElementById("cnv_new_shape_btn")

        const cnv_brush_color_input = document.getElementById("cnv_brush_color_input")
        const cnv_fill_color_input = document.getElementById("cnv_fill_color_input")
        const cnv_brush_size_input = document.getElementById("cnv_brush_size_input")

        const plugin_file_input = document.getElementById("plugin_load_input")

        cursor_btn?.addEventListener("click", this._on_cursor_btn_click.bind(this))
        line_btn?.addEventListener("click", this._on_line_btn_click.bind(this))
        multi_line_btn?.addEventListener("click", this._on_multi_line_btn_click.bind(this))
        rect_btn?.addEventListener("click", this._on_rect_btn_click.bind(this))
        ellipse_btn?.addEventListener("click", this._on_ellipse_btn_click.bind(this))
        polygon_btn?.addEventListener("click", this._on_polygon_btn_click.bind(this))

        new_shape_btn?.addEventListener("click", this._on_new_shape_btn.bind(this))


        cnv_brush_color_input?.addEventListener("change", this._on_cnv_brush_color_change.bind(this))
        cnv_fill_color_input?.addEventListener("change", this._on_cnv_fill_color_change.bind(this))
        cnv_brush_size_input?.addEventListener("change", this._on_cnv_brush_size_change.bind(this))

        plugin_file_input?.addEventListener("change", this._on_load_plugin_btn.bind(this))
        

        document.addEventListener('keydown', this._on_global_keydown.bind(this))
        document.addEventListener('keyup', this._on_global_keyup.bind(this))
    }

    private _on_cnv_mouse_move(e: MouseEvent) {
        this.cnv?.mouse_move(e.x,e.y)
    }
    private _on_cnv_mouse_down(e: MouseEvent) {
        this.cnv?.mouse_down(e.x,e.y)
    }
    private _on_cnv_mouse_up(e: MouseEvent) {
        this.cnv?.state.set_mouse_pressed(false)
        this.cnv?.state.set_last_coords(null)
        this.cnv?.mouse_up(e.x,e.y)
    }
    private _on_cursor_btn_click(e: any) {
        this.cnv?.state.set_paint_mode(PAINT_MODES.view)
        this.cnv?.mouse_move(0,0)
    }
    private _on_line_btn_click(e: any) {
        this.cnv?.state.set_paint_mode(PAINT_MODES.draw)
        this.cnv?.set_shape_factory(new LineShapeFactory())
    }
    private _on_multi_line_btn_click(e: any) {
        this.cnv?.state.set_paint_mode(PAINT_MODES.draw)
        this.cnv?.set_shape_factory(new MultiLineShapeFactory())
    }
    private _on_rect_btn_click(e: any) {
        this.cnv?.state.set_paint_mode(PAINT_MODES.draw)
        this.cnv?.set_shape_factory(new RectShapeFactory())
    }
    private _on_ellipse_btn_click(e: any) {
        this.cnv?.state.set_paint_mode(PAINT_MODES.draw)
        this.cnv?.set_shape_factory(new EllipseShapeFactory())
    }
    private _on_polygon_btn_click(e: any) {
        this.cnv?.state.set_paint_mode(PAINT_MODES.draw)
        this.cnv?.set_shape_factory(new PolygonShapeFactory())
    }
    private _on_new_shape_btn(e: any) {
        const complex_shape = this.cnv?.gen_complex_shape_from_selected()
        if (
            this._plugin_loader &&
            complex_shape &&
            complex_shape.get_internal_shapes().length > 0
        ) {
            this._plugin_loader?.set_format(PLUGIN_EXT.json)
            const shape_source: string = this._plugin_loader?.dumps(complex_shape)
            this._plugin_loader?.download_file("painter_plugin"+Date.now(), shape_source)
        }
    }
    private _on_cnv_brush_color_change(e: any) {
        this.cnv?.state.set_paint_mode(PAINT_MODES.draw)
        let color = e.target.value
        if (this.cnv) {
            this.cnv.state.set_brush_color(color)
        }
    }
    private _on_cnv_fill_color_change(e: any) {
        this.cnv?.state.set_paint_mode(PAINT_MODES.draw)
        let color = e.target.value
        if (this.cnv) {
            this.cnv.state.set_fill_color(color)
        }
    }
    private _on_cnv_brush_size_change(e: any) {
        this.cnv?.state.set_paint_mode(PAINT_MODES.draw)
        let size: number = e.target.value
        if (this.cnv) {
            this.cnv.state.set_brush_size(size)
        }
    }
    private _create_plugin_shape_btn_handler(name: string, factory: ShapeFactory) {
        this._plugin_btn_handlers[name] = factory
        let shapes_btn_list = document.getElementById("shapes_btn_list")
        if (shapes_btn_list) {
            const last_btn_classes: any = shapes_btn_list.lastElementChild?.className
            const btn = document.createElement("button")
            btn.className = last_btn_classes
            btn.textContent = "External plugin"
            btn.name = name
            btn.addEventListener("click", this._on_plugin_shape_btn_click.bind(this))
            shapes_btn_list.appendChild(btn)
        }
        
    }
    private _on_plugin_shape_btn_click(e: any) {
        this.cnv?.state.set_paint_mode(PAINT_MODES.draw)
        let name = e.target.name
        let factory: ComplexShapeFactory = this._plugin_btn_handlers[name]
        this.cnv?.set_shape_factory(factory)
    }
    private _on_load_plugin_btn(e: any) {
        let plugin = e.target.files[0]
        let plugin_name = plugin.name.split(".").shift()
        plugin.text().then((source: string) => {
            let shape = this._plugin_loader?.load(plugin.name, source)
            if (shape instanceof ComplexShape) {
                let complex_factory = new ComplexShapeFactory(shape.get_internal_shapes())
                this._create_plugin_shape_btn_handler(plugin_name+Date.now(), complex_factory)
            }
        })
    }
    private _on_global_keydown(e: KeyboardEvent) {
        if(e.key === "Enter") {
            this.cnv?.enter_action()
        }
        else if (e.ctrlKey && ["z", "Z"].indexOf(e.key) >= 0) {
            this.cnv?.undo_action()
        }
        else if (e.ctrlKey && ["y", "Y"].indexOf(e.key) >= 0) {
            this.cnv?.redo_action()
        }
        else if (e.key == "Control") {
            this.cnv?.state.set_selection(true)
        }
    }
    private _on_global_keyup(e: KeyboardEvent) {
        if (e.key == "Control") {
            this.cnv?.state.set_selection(false)
        }
    }
}