import { Coords } from 'Painter/Coords';
export interface IShapeGrid {
    readonly _grid_vertexes: Coords[]
    get_grid_vertexes(): Coords[]
    _update_grid_vertexes(): void
}