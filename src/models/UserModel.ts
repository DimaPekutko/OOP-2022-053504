import { Schema, model } from 'mongoose';

import {User, RegularUser} from './entities/User';

const schema = new Schema<RegularUser>({
    id: { type: Number, required: true}, 
    bank_id: { type: Number, required: true},
    role: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    name: { type: String, required: false},
    phone: { type: Number, required: false},
    company_id: {type: String, required: false}
});

const user_model = model<RegularUser>('User', schema);

export default user_model