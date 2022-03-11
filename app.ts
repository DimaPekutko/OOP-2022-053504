import express from 'express';
import path from 'path';
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import {main_router} from './src/routes';

const app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));


app.use("/", main_router)
app.listen(port)

// const userEmails = ["p.shaddel@gmail.com", "test@gmail.com"];
// function CheckDuplicateUser() {
//   return function (
//     target: Object,
//     key: string | symbol,
//     descriptor: PropertyDescriptor
//   ) {
//     const childFunction = descriptor.value;
//     descriptor.value = function (...args: any[]) {
//         return childFunction.apply(this, args)
//     };
//     return descriptor;
//   };
// }

// class UserService {
//   @CheckDuplicateUser()
//   createUser(user: any): void {
//     console.log("creating user in database:", user); // we have to insert user to the database.
//   }
// }

// const userService: UserService = new UserService();
// userService.createUser({ name: "Poorshad", email: "p.shaddel@gmail.com" });
// userService.createUser({ name: "John", email: "John.smith@gmail.com" });