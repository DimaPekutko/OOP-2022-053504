import { IShapeGrid } from './IShapeGrid';
import { Coords } from './../Coords';
export abstract class Shape implements IShapeGrid {
    protected _pos: Coords | null = null
    protected _bg_color: string = ""
    protected _stroke_color: string = ""
    protected _stroke_size: number = 0
    abstract readonly to_fill: boolean
    _grid_vertexes: Coords[] = []

    constructor(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number) {
        this.set_pos(pos)
        this.set_bg_color(bg_clr)
        this.set_stroke_color(stroke_clr)
        this.set_stroke_size(stroke_size)
    }
    get_grid_vertexes(): Coords[] {
        return [{x: 0, y: 0}]
    }
    _update_grid_vertexes(): void {}

    get_pos(): Coords | null {
        return this._pos
    }
    get_bg_color(): string {
        return this._bg_color
    }

    get_stroke_color(): string {
        return this._stroke_color
    }

    get_stroke_size(): number {
        return this._stroke_size
    }

    set_pos(coords: Coords) {
        this._pos = coords
    }

    set_bg_color(bg: string) {
        this._bg_color = bg
    }

    set_stroke_color(clr: string) {
        this._stroke_color = clr
    }

    set_stroke_size(size: number) {
        if (size > 0) {
            this._stroke_size = size
        }
    }

}