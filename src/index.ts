import { Painter } from './Painter/Painter';


const main = () => {
    const app = new Painter()
    app.run()
}

document.addEventListener("DOMContentLoaded", main)