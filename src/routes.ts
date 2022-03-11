import express from "express";
// import express from 'express';
// import UserPageController from './controllers/UserPageController';
import AuthController from "./controllers/AuthController";

const main_router = express.Router();

main_router.get("/", (request: express.Request, response: express.Response) => {
    response.send("hello from main");
});

main_router.get("/login", AuthController.login);
main_router.post("/login", AuthController.loginPOST);
main_router.get("/register", AuthController.register);

export {main_router};
