import { USER_ACTIONS_MODELS } from './src/models/UserActionModel';
import { connect } from 'mongoose';

import user_model from './src/models/UserModel';
import account_model from './src/models/AccountModel';
import faker from '@faker-js/faker';
import Roles from './src/models/entities/Roles';
import bank_model from './src/models/BankModel';
import company_model from './src/models/CompanyModel';

import util from "util"
import { writeFileSync } from 'fs';
import credit_request_model from './src/models/CreditRequestModel';
import salary_request_model from './src/models/SalaryRequestModel';

const clear_db = async () => {
    bank_model.collection.deleteMany({})
    company_model.collection.deleteMany({})
    user_model.collection.deleteMany({})
    account_model.collection.deleteMany({})
    credit_request_model.collection.deleteMany({})
    salary_request_model.collection.deleteMany({})
    USER_ACTIONS_MODELS.create_acc.collection.deleteMany({})
    USER_ACTIONS_MODELS.delete_acc.collection.deleteMany({})
    USER_ACTIONS_MODELS.transfer_money.collection.deleteMany({})
    USER_ACTIONS_MODELS.salary_request.collection.deleteMany({})
    USER_ACTIONS_MODELS.credit_request.collection.deleteMany({})
}

const clear_logs = async () => {
    writeFileSync("logs.txt", "")
}

const get_random_passport_id = () => {
    return Math.floor(Math.random()*(9999999-1000000)+1000000)
}

const fake_data = async () => {
    // users
    clear_db()
    clear_logs()

    const BANKS_COUNT = 3
    const USERS_COUNT_PER_BANK = 30
    const COMPANIES_COUNT_PER_BANK = 8

    // banks
    for (let i = 0; i < BANKS_COUNT; i++) {
        const bank_id = i+1
        await bank_model.create({
            "id": bank_id,
            "name": faker.company.companyName() + " Bank"
        })
        // companies
        for (let j = 0; j < COMPANIES_COUNT_PER_BANK; j++) {
            const company = await company_model.create({
                "bank_id": bank_id,
                "name": faker.company.companyName(),
                "type": "OOO",
                "address": faker.address.streetAddress()
            })
            // company_spec
            await user_model.create({
                "id": get_random_passport_id(),
                "bank_id": bank_id,
                "email": faker.internet.email(),
                "role": Roles.COMPANY_SPEC,
                "company_id": company.id,
                "password": faker.word.noun()
            })
        }
        // users
        for (let j = 0; j < USERS_COUNT_PER_BANK; j++) {
            await user_model.create({
                "id": get_random_passport_id(),
                "bank_id": bank_id,
                "name": faker.name.findName(),
                "email": faker.internet.email(),
                "phone": j+10,
                "role": Roles.REGULAR,
                "password": faker.word.noun()
            })
        }
        // operator
        await user_model.create({
            "id": get_random_passport_id(),
            "bank_id": bank_id,
            "email": faker.internet.email(),
            "role": Roles.OPERATOR,
            "password": faker.word.noun()
        })
        // manager
        await user_model.create({
            "id": get_random_passport_id(),
            "bank_id": bank_id,
            "email": faker.internet.email(),
            "role": Roles.MANAGER,
            "password": faker.word.noun()
        })
        // admin
        await user_model.create({
            "id": get_random_passport_id(),
            "bank_id": bank_id,
            "email": faker.internet.email(),
            "role": Roles.ADMIN,
            "password": faker.word.noun()
        })
    }
    // accounts
    writeFileSync("data.json", JSON.stringify({
        BANKS: await bank_model.find(),
        COMPANIES: await company_model.find(),
        USERS: await user_model.find(),
        accounts: await account_model.find()
    }))
}

const main = async () => {
    await connect('mongodb://localhost:27017/fin-sys')
    fake_data()
}

main()