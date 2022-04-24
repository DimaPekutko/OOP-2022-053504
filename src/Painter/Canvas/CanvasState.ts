import { Coords } from '../Coords';

export enum PAINT_MODES {
  view = 1,
  draw,
  filling
}

export class CanvasState {
  _brush_color: string = "black";
  _brush_size: number = 5;

  _fill_color: string = ""

  _is_mouse_pressed: boolean = false;
  _last_draw_coords: Coords | null = null

  _paint_mode: PAINT_MODES = PAINT_MODES.draw

  public set_brush_color(clr: string) {
    this._brush_color = clr;
  }

  public set_brush_size(size: number) {
    if (size > 0 && size < 30) {
      this._brush_size = size;
    }
  }

  public set_fill_color(clr: string) {
    this._fill_color = clr
  }

  public set_mouse_pressed(status: boolean) {
    this._is_mouse_pressed = status;
  }

  public set_last_coords(coords: Coords | null) {
      this._last_draw_coords = coords
  }

  public set_paint_mode(mode: PAINT_MODES) {
    this._paint_mode = mode
  }
}
