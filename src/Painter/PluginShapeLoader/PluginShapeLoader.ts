import { Shape } from 'Painter/Shape/Shape';
import { ComplexShape } from './../Shape/ComplexShape/ComplexShape';
import { JsonParser } from './Parser/json/JsonParser';
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

    download_file(filename: string, data: string): void {
        let element = document.createElement('a');
        if (this._format == PLUGIN_EXT.json) {
            element.setAttribute('href', 'data:json/json;charset=utf-8,' + encodeURIComponent(data));
            element.setAttribute('download', filename+".json");
        }
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
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

    load(filename: string, source: string): Shape | null {
        if (filename.split(".").pop() === "json") {
            return JsonParser.parse(source)
        }
        else {
            alert("Error, undefined format '"+this._format+"'")
        }
        return null
    }

    // loads(str: string): ComplexShape {

    // }

}