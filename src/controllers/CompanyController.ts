import { USER_ACTIONS_MODELS } from './../models/UserActionModel';
import { Bank } from './../models/entities/Bank';
import express from "express";
import { get_cookie, RequireAuth } from "../AuthState";
import Roles from "../models/entities/Roles";
import { User } from "../models/entities/User";
import bank_model from '../models/BankModel';
import company_model from '../models/CompanyModel';
import { GlobalLogger } from '../GlobalLogger';

export default abstract class CompanyController {
    static async companies(request: express.Request, response: express.Response) {
        const user_cookie: User = get_cookie(request)
        const banks: Bank[] = await bank_model.find()
        const companies_with_banks = []
        for (let i = 0; i < banks.length; i++) {
            if (user_cookie?.bank_id === banks[i].id || !user_cookie) {
                let companies = await company_model.find({
                    "bank_id": banks[i].id
                })
                companies_with_banks.push({
                    bank: banks[i],
                    companies: companies
                })
            }
        }
        response.render("companies", {
            "userdata": user_cookie,
            "companies": companies_with_banks,
            "is_regular_user": user_cookie?.role === Roles.REGULAR
        })
    }
    @RequireAuth()
    static async salary_request(request: express.Request, response: express.Response) {
        const user_cookie: User = get_cookie(request)
        const data = request.body
        const user_id = user_cookie.id
        const bank_id = user_cookie.bank_id
        const company_id = String(data.company_id).trim()
        await USER_ACTIONS_MODELS.salary_request.create({
            "user_id": user_id,
            "bank_id": bank_id,
            "company_id": company_id,
        })
        GlobalLogger.log(`${user_cookie?.id} user create salary request to company ${company_id}.`)
        response.redirect("/companies")
    }
}   

