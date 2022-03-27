import { Schema, model } from 'mongoose';

import { Company } from './entities/Company';

const schema = new Schema<Company>({
    bank_id: { type: Number, required: true},
    name: { type: String, required: true},
    type: { type: String, required: true},
    address: { type: String, required: true},
})

const company_model = model<Company>('Company', schema);

export default company_model