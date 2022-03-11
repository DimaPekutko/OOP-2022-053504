import express from "express";
import RequireAuth from "../AuthState";
import user_model from "../models/UserModel";

export default abstract class AuthController {
    static login (request: express.Request, response: express.Response) {        
        response.render("login")
    }
    static loginPOST (request: express.Request, response: express.Response) {
        let data = request.body
        let email = String(data.email).trim()
        let password = String(data.password)
        let existed_user = user_model.get(email, password)
        if (existed_user !== null) {
            response.cookie("user", JSON.stringify({email: email, password: password}))
            response.redirect("/")
        }
        else {
            response.redirect("/login")
        }
    }
    @RequireAuth()
    static register (request: express.Request, response: express.Response) {
        response.render("login")
    }
}