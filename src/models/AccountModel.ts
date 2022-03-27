import { Schema, model } from 'mongoose';

import {UserAccount} from './entities/Account';

const schema = new Schema<UserAccount>({
    bank_id: { type: Number, required: true}, 
    user_id: { type: Number, required: true},
    total: { type: Number, required: true}
});

const account_model = model<UserAccount>('Account', schema);

export default account_model