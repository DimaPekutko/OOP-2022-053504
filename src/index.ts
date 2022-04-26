import { Painter } from './Painter/Painter';


const main = () => {
    const app = new Painter()
    app.run()
}


// function download(filename: string, text: string) {
//     var element = document.createElement('a');
//     element.setAttribute('href', 'data:json/json;charset=utf-8,' + encodeURIComponent(text));
//     element.setAttribute('download', filename);
  
//     element.style.display = 'none';
//     document.body.appendChild(element);
  
//     element.click();
  
//     document.body.removeChild(element);
// }

// // download("some.json", '{"hello": 2}')


let last_x: any = null, last_y: any = null
let deg = 45
const background_blur = (e: MouseEvent) => {
    if (last_x && last_y) {
        // let offset = Math.abs(last_x-e.x)
        // last_x < e.x ? deg++ : deg--
        // const colors = ["black", "purple", "brown", "green", "red"]
        // document.body.style.background = `linear-gradient(${deg}deg, ${colors.join(",")})`
    }
    // }
    last_x = e.x
    last_y = e.y
    
}


document.addEventListener("mousemove", background_blur)
document.addEventListener("DOMContentLoaded", main)