import { UserAccount } from '../models/entities/Account';
import express from "express";
import { RequireAuth, RequireOperatorAuth, get_cookie } from "../AuthState";
import { USER_ACTIONS_MODELS } from '../models/UserActionModel';
import account_model from '../models/AccountModel';
import Roles from '../models/entities/Roles';
import { UserAction } from '../models/entities/UserAction';
import { GlobalLogger } from '../GlobalLogger';
import salary_request_model from '../models/SalaryRequestModel';
import credit_request_model from '../models/CreditRequestModel';

export default abstract class UserActionControler {
    @RequireOperatorAuth()
    static async actions (request: express.Request, response: express.Response) {
        const user_cookie = get_cookie(request)
        const user_role = user_cookie?.role
        let register_actions: UserAction[] = [], 
            transfer_actions: UserAction[] = [], 
            create_acc_actions: UserAction[] = [], 
            delete_acc_actions: UserAction[] = [], 
            salary_request_actions: UserAction[] = [],
            credit_request_actions: UserAction[] = []
        
        if (user_role === Roles.ADMIN || user_role === Roles.OPERATOR || user_role === Roles.MANAGER ) {
            transfer_actions = await USER_ACTIONS_MODELS.transfer_money.find({
                "bank_id": user_cookie.bank_id
            })
            create_acc_actions = await USER_ACTIONS_MODELS.create_acc.find({
                "bank_id": user_cookie.bank_id
            })
            delete_acc_actions = await USER_ACTIONS_MODELS.delete_acc.find({
                "bank_id": user_cookie.bank_id
            })
        }
        if (user_role === Roles.ADMIN || user_role === Roles.MANAGER) {
            register_actions = await USER_ACTIONS_MODELS.register_user.find({
                "bank_id": user_cookie.bank_id
            })
            salary_request_actions = await USER_ACTIONS_MODELS.salary_request.find({
                "bank_id": user_cookie.bank_id
            })
            credit_request_actions = await USER_ACTIONS_MODELS.credit_request.find({
                "bank_id": user_cookie.bank_id
            })
            console.log(credit_request_actions)
        }
        else if (user_role === Roles.COMPANY_SPEC) {
            salary_request_actions = await USER_ACTIONS_MODELS.salary_request.find({
                "bank_id": user_cookie.bank_id,
                "company_id": user_cookie?.company_id
            })
            console.log(salary_request_actions)
            console.log(user_cookie)
        }
        response.render("user_actions", {
            userdata: get_cookie(request),
            actions: {
                register: register_actions,
                transfer: transfer_actions,
                create_acc: create_acc_actions,
                delete_acc: delete_acc_actions,
                salary_request: salary_request_actions,
                credit_request: credit_request_actions
            }
        })
    }
    @RequireOperatorAuth()
    static async reject_create_acc(request: express.Request, response: express.Response) {
        const user_cookie = get_cookie(request)
        const action_id = request.body?.id
        const acc_id = request.body?.acc_id
        if (action_id && acc_id) {
            await account_model.findByIdAndDelete(acc_id)
            await USER_ACTIONS_MODELS.create_acc.findByIdAndDelete(action_id)
            GlobalLogger.log(`${user_cookie?.id} user reject create acc action with account id ${acc_id}.`)
        }
        response.redirect("/actions")
    }
    @RequireOperatorAuth()
    static async reject_delete_acc(request: express.Request, response: express.Response) {
        const user_cookie = get_cookie(request)
        const action_id = request.body?.id
        if (action_id) {
            const action = await USER_ACTIONS_MODELS.delete_acc.findById(action_id)
            if (action) {
                await account_model.create({
                    "bank_id": action.bank_id,
                    "user_id": action.user_id,
                    "total": action.remain_money
                })
            }
            await USER_ACTIONS_MODELS.delete_acc.findByIdAndDelete(action_id)
            GlobalLogger.log(`${user_cookie?.id} user reject delete acc action.`)
        }
        response.redirect("/actions")
    }
    @RequireOperatorAuth()
    static async reject_transfer_money(request: express.Request, response: express.Response) {
        const user_cookie = get_cookie(request)
        const action_id = request.body?.id
        if (action_id) {
            const action = await USER_ACTIONS_MODELS.transfer_money.findById(action_id)
            if (action) {
                const sender_acc = await account_model.findById(action?.sender_acc_id)
                const receiver_acc = await account_model.findById(action?.receiver_acc_id)
                if (sender_acc && receiver_acc) {
                    await account_model.findByIdAndUpdate(sender_acc.id, {
                        "total": sender_acc.total+action.total_sum
                    })
                    await account_model.findByIdAndUpdate(receiver_acc.id, {
                        "total": receiver_acc.total-action.total_sum
                    })
                }
                await USER_ACTIONS_MODELS.transfer_money.findByIdAndDelete(action_id)
                GlobalLogger.log(`${user_cookie?.id} user reject transfer money action: (from acc ${sender_acc?.id} => to acc ${receiver_acc?.id}).`)
            }
        }
        // const acc_id = request.body?.acc_id
        // if (action_id && acc_id) {
        //     await account_model.findByIdAndDelete(acc_id)
        //     await USER_ACTIONS_MODELS.create_acc.findByIdAndDelete(action_id)
        // }
        response.redirect("/actions")
    }
    static async accept_salary_request(request: express.Request, response: express.Response) {
        const action_id = request.body?.id
        if (action_id) {
            const action = await USER_ACTIONS_MODELS.salary_request.findByIdAndDelete(action_id)
            await salary_request_model.create({
                "bank_id": action?.bank_id,
                "user_id": action?.user_id,
                "company_id": action?.company_id,
                "monthly_sum": 500
            })
        }
        response.redirect("/actions")
    }
    static async accept_credit_request(request: express.Request, response: express.Response) {
        const action_id = request.body?.id
        if (action_id) {
            const action = await USER_ACTIONS_MODELS.credit_request.findByIdAndDelete(action_id)
            await credit_request_model.create({
                "bank_id": action?.bank_id,
                "user_id": action?.user_id,
                "months_duration": action?.months_duration,
                "total_sum": action?.total_sum,
                "year_percent": action?. year_percent
            })
        }
        response.redirect("/actions")
    }
}   

