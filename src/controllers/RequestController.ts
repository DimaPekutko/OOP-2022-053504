import { UserAccount } from './../models/entities/Account';
import express from "express";
import { RequireAuth, get_cookie } from "../AuthState";
import account_model from "../models/AccountModel";
import credit_request_model from '../models/CreditRequestModel';
import salary_request_model from '../models/SalaryRequestModel';

export default abstract class RequestController {
    @RequireAuth()
    static async requests (request: express.Request, response: express.Response) {
        const user_cookie = get_cookie(request)
        const credit_requests = await credit_request_model.find({
            "bank_id": user_cookie?.bank_id,
            "user_id": user_cookie?.id
        })
        const salary_requests = await salary_request_model.find({
            "bank_id": user_cookie?.bank_id,
            "user_id": user_cookie?.id
        })
        response.render("requests", {
            "userdata": user_cookie,
            "credit_requests": credit_requests,
            "salary_requests": salary_requests,
        })
    }
}