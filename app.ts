import express from 'express';
import { connect } from 'mongoose';
import path from 'path';
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import {main_router} from './src/routes';
import user_model from './src/models/UserModel';

const main = async () => {
    const app = express();
    const port = process.env.PORT || 3000
    
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser())    
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '/src/views'));
    
    await connect('mongodb://localhost:27017/fin-sys')
    
    app.use("/", main_router)
    app.listen(port)    
}

main()