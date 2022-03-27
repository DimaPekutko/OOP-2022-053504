import { RegularUser } from './../models/entities/User';
import express from "express";
import { exit } from "process";
import { RequireAuth, get_cookie } from "../AuthState";
import Roles from "../models/entities/Roles";
import user_model from "../models/UserModel";
import { GlobalLogger } from '../GlobalLogger';

export default abstract class AuthController {
    static async login (request: express.Request, response: express.Response) {
        const user_cookie = get_cookie(request)
        // console.log(await user_model.find())
        response.render("login", {
            userdata: user_cookie
        })
        
    }
    static async loginPOST (request: express.Request, response: express.Response) {
        let data = request.body
        let email = String(data.email).trim()
        let password = String(data.password)
        let bank_id = Number(data.bank_id)
        let existed_user: RegularUser | null = await user_model.findOne({
            "bank_id": bank_id,
            "email": email, 
            "password": password 
        })
        if (existed_user) {
            GlobalLogger.log(`${existed_user.id} user login to system.`)
            response.cookie("user", JSON.stringify(existed_user))
            response.redirect("/")
        }
        else {
            response.redirect("/login")
        }
    }
    static register (request: express.Request, response: express.Response) {
        const user_cookie = get_cookie(request)
        response.render("register", {
            userdata: user_cookie
        })
    }
    static async registerPOST (request: express.Request, response: express.Response) {
        let data = request.body
        let name = String(data.name).trim()
        let bank_id = Number(data.bank_id)
        let id = Number(data.id)
        let phone = Number(data.phone)
        let email = String(data.email).trim()
        let password = String(data.password)
        let existed_user = await user_model.findOne({
            "email": email,
        })
        if (existed_user === null) {
            await user_model.create({
                "id": id,
                "bank_id": bank_id,
                "name": name,
                "email": email,
                "phone": phone,
                "role": Roles.REGULAR,
                "password": password
            })
            GlobalLogger.log(`${id} user register to system.`)
            response.redirect("/")
        }
        else {
            response.redirect("/register")
        }
    }
    static async exit(request: express.Request, response: express.Response) {
        const user_cookie = get_cookie(request)
        if (user_cookie?.id) {
            GlobalLogger.log(`${user_cookie.id} user exit from system.`)
        }
        response.clearCookie("user")
        response.redirect("/login")
    }
}