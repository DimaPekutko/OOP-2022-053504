import { SalaryRequest } from './entities/SalaryRequest';
import { Schema, model } from 'mongoose';


const schema = new Schema<SalaryRequest>({
    bank_id: { type: Number, required: true},
    user_id: { type: Number, required: true},
    company_id: { type: String, required: true},
    monthly_sum: { type: Number, required: true}
});

const salary_request_model = model<SalaryRequest>('SalaryRequest', schema);

export default salary_request_model