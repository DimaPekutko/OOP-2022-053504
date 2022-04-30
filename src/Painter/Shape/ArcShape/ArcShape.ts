import { IShapeGrid } from './../IShapeGrid';
import { Coords } from "Painter/Coords";
import { Shape } from "Painter/Shape/Shape";

export abstract class ArcShape extends Shape implements IShapeGrid {
    protected _x_radius: number = 20
    protected _y_radius: number = 20
    _grid_vertexes: Coords[] = []

    constructor(pos: Coords, bg_clr: string, stroke_clr: string, stroke_size: number) {
        super(pos, bg_clr, stroke_clr, stroke_size)
    }

    _update_grid_vertexes(): void {
        while(this._grid_vertexes.pop()) {}
        if (this._pos !== null) {
            let x = this._pos.x
            let y = this._pos.y
            let x_rad = this._x_radius
            let y_rad = this._y_radius
            this._grid_vertexes.push({x:x-x_rad-10, y:y-y_rad-10})
            this._grid_vertexes.push({x:x-x_rad-10, y:y+y_rad+10})
            this._grid_vertexes.push({x:x+x_rad+10, y:y+y_rad+10})
            this._grid_vertexes.push({x:x+x_rad+10, y:y-y_rad-10})
            this._grid_vertexes.push({x:x-x_rad-10, y:y-y_rad-10})
        }
    }
    
    get_grid_vertexes(): Coords[] {
        this._update_grid_vertexes()
        return this._grid_vertexes
    }

    set_radii(xrad: number, yrad: number): void {
        this._x_radius = xrad
        this._y_radius = yrad
    }

    set_proportions_by_pos(pos: Coords): void {
        let head_pos = this._pos
        if (head_pos) {
            this._x_radius = Math.abs(head_pos.x-pos.x)
            this._y_radius = Math.abs(head_pos.y-pos.y)
        }
    }

    get_radii(): [number, number] {
        return [this._x_radius, this._y_radius]
    }
}