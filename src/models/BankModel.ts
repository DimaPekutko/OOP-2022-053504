import { Schema, model } from 'mongoose';

import { Bank } from './entities/Bank';

const schema = new Schema<Bank>({
    id: { type: Number, required: true}, 
    name: { type: String, required: true},
})

const bank_model = model<Bank>('Bank', schema);

export default bank_model