import { UserAccount } from './../models/entities/Account';
import express from "express";
import { RequireAuth, get_cookie } from "../AuthState";
import account_model from "../models/AccountModel";

import { USER_ACTIONS_MODELS } from '../models/UserActionModel';
import user_model from '../models/UserModel';
import { GlobalLogger } from '../GlobalLogger';

export default abstract class AccountController {
    @RequireAuth(true)
    static async accounts (request: express.Request, response: express.Response) {
        const user_cookie = get_cookie(request)
        const accounts = await account_model.find({
            "bank_id": user_cookie?.bank_id,
            "user_id": user_cookie?.id
        })

        // const credits = await 

        response.render("accounts", {
            "userdata": user_cookie,
            "accounts": accounts
        })
    }
    @RequireAuth(true)
    static async create (request: express.Request, response: express.Response) {
        const user_cookie = get_cookie(request)
        const new_acc = await account_model.create({
            "bank_id": user_cookie?.bank_id,
            "user_id": user_cookie?.id,
            "total": 200
        })
        await USER_ACTIONS_MODELS.create_acc.create({
            "bank_id": user_cookie?.bank_id,
            "user_id": user_cookie?.id,
            "acc_id": new_acc._id
        })
        GlobalLogger.log(`${user_cookie?.id} user create account ${new_acc._id}.`)
        response.redirect("/accounts")
    }
    @RequireAuth(true)
    static async delete (request: express.Request, response: express.Response) {
        const user_cookie = get_cookie(request)
        const data = request.body
        if (data?.id) {
            const account = await account_model.findByIdAndRemove(data.id)
            await USER_ACTIONS_MODELS.delete_acc.create({
                "bank_id": user_cookie?.bank_id,
                "user_id": user_cookie?.id,
                "acc_id": data.id,
                "remain_money": account?.total
            })
            GlobalLogger.log(`${user_cookie?.id} user delete account ${account?.id}.`)
        }
        response.redirect("/accounts")
    }
    @RequireAuth(true)
    static async send (request: express.Request, response: express.Response) {
        const user_cookie = get_cookie(request)
        const data = request.body
        let sender_acc_id = String(data?.sender_id).trim()
        let receiver_acc_id = String(data?.receiver_id).trim()
        let total_sum = Number(data?.total_sum)
        if (sender_acc_id && receiver_acc_id && total_sum && sender_acc_id !== receiver_acc_id) {
            const sender_acc : UserAccount | null = await account_model.findById(sender_acc_id)
            const receiver_acc : UserAccount | null = await account_model.findById(receiver_acc_id)
            if (sender_acc && receiver_acc) {
                if (sender_acc.total >= total_sum) {
                    await account_model.findByIdAndUpdate(sender_acc_id, {
                        "total": sender_acc.total-total_sum
                    })
                    await account_model.findByIdAndUpdate(receiver_acc, {
                        "total": receiver_acc.total+total_sum
                    })
                    await USER_ACTIONS_MODELS.transfer_money.create({
                        "bank_id": user_cookie?.bank_id,
                        "user_id": user_cookie?.id,
                        "sender_acc_id": sender_acc_id,
                        "receiver_acc_id": receiver_acc_id,
                        "total_sum": total_sum
                    }) 
                    GlobalLogger.log(`${user_cookie?.id} user send ${total_sum}$ to user ${receiver_acc.user_id}.`)
                }
            } 
        }
        response.redirect("/accounts")
    }
}