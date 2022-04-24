import { Painter } from './Painter/Painter';


const main = () => {
    const app = new Painter()
    app.run()
}





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