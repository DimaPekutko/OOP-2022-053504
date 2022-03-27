import { CreateAccUserAction, DeleteAccUserAction, TransferMoneyUserAction, RegisterUserAction, SalaryRequestUserAction, CreditRequestUserAction } from './entities/UserAction';
import { Schema, model } from 'mongoose';

import {UserAccount} from './entities/Account';


export const USER_ACTIONS_MODELS = {
    "create_acc": model<CreateAccUserAction>('CreateAccUA', new Schema<CreateAccUserAction>({
        bank_id: { type: String, required: true},
        user_id: { type: String, required: true},
        acc_id: { type: String, required: true} 
    })),
    "delete_acc": model<DeleteAccUserAction>('DeleteAccUA', new Schema<DeleteAccUserAction>({
        bank_id: { type: String, required: true},
        user_id: { type: String, required: true},
        acc_id: { type: String, required: true},
        remain_money: { type: Number, required: true}
    })),
    "transfer_money": model<TransferMoneyUserAction>('TranferMoneyAccUA', new Schema<TransferMoneyUserAction>({
        bank_id: { type: String, required: true},
        user_id: { type: String, required: true},
        sender_acc_id: { type: String, required: true},
        receiver_acc_id: { type: String, required: true},
        total_sum: { type: Number, required: true}
    })),
    "register_user": model<RegisterUserAction>('RegisterUA', new Schema<RegisterUserAction>({
        bank_id: { type: String, required: true},
        user_id: { type: String, required: true}
    })),
    "salary_request": model<SalaryRequestUserAction>('SalaryRequestUA', new Schema<SalaryRequestUserAction>({
        bank_id: { type: String, required: true},
        user_id: { type: String, required: true},
        company_id: { type: String, required: true}
    })),
    "credit_request": model<CreditRequestUserAction>('CreditRequestUA', new Schema<CreditRequestUserAction>({
        bank_id: { type: String, required: true},
        user_id: { type: String, required: true},
        months_duration: { type: Number, required: true},
        total_sum: { type: Number, required: true},
        year_percent: { type: Number, required: true}
    }))
}