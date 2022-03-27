import { USER_ACTIONS_MODELS } from './../models/UserActionModel';
import { Bank } from './../models/entities/Bank';
import express from "express";
import { get_cookie, RequireAuth } from "../AuthState";
import Roles from "../models/entities/Roles";
import { User } from "../models/entities/User";
import bank_model from '../models/BankModel';
import company_model from '../models/CompanyModel';
import { GlobalLogger } from '../GlobalLogger';

export default abstract class BankController {
    @RequireAuth()
    static async credit_request(request: express.Request, response: express.Response) {
        const user_cookie: User = get_cookie(request)
        const data = request.body
        const sum = Number(data?.sum)
        const months_duration = Number(data?.duration)
        const year_percent = 5
        if (sum && months_duration) {
            console.log()
            await USER_ACTIONS_MODELS.credit_request.create({
                "user_id": user_cookie.id,
                "bank_id": user_cookie.bank_id,
                "months_duration": months_duration,
                "total_sum": sum,
                "year_percent": year_percent
            })
            GlobalLogger.log(`${user_cookie?.id} user reject create credit request.`)
        }
        response.redirect("/companies")
    }
}   

