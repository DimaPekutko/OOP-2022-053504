import { ComplexShape } from './../Shape/ComplexShape/ComplexShape';
import { JsonSerializer } from './Serializer/json/JsonSerializer';
export enum PLUGIN_EXT {
    json = 1
}

export class PluginShapeLoader {
    private _format: PLUGIN_EXT

    constructor(format: PLUGIN_EXT) {
        this._format = format
    }

    set_format(format: PLUGIN_EXT) {
        this._format = format
    }

    download(filename: string, data: string): void {

    }

    dumps(shape: ComplexShape): string {
        if (this._format == PLUGIN_EXT.json) {
            return JsonSerializer.serialize(shape)
        }
        else {
            alert("Error, undefined format '"+this._format+"'")
        }
        return ""
    }

    // loads(str: string): ComplexShape {

    // }

}