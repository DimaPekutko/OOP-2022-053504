import { CreditRequest } from './entities/CreditRequest';
import { Schema, model } from 'mongoose';


const schema = new Schema<CreditRequest>({
    bank_id: { type: Number, required: true},
    user_id: { type: Number, required: true},
    months_duration: { type: Number, required: true},
    total_sum: { type: Number, required: true},
    year_percent: { type: Number, required: true}
});

const credit_request_model = model<CreditRequest>('CreditRequest', schema);

export default credit_request_model