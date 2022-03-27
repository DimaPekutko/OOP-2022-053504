export abstract class Account {
    constructor(
        public bank_id: number,
        public user_id: number,
        public total: number 
    ) {}
}

export class UserAccount extends Account {
    constructor(
        bank_id: number,
        user_id: number,
        total: number = 0 
    ) {
        super(bank_id, user_id, total)
    }
}