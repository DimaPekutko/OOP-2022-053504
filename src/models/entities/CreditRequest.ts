export class CreditRequest {
    constructor(
        public bank_id: number,
        public user_id: number,
        public months_duration: number,
        public total_sum: number,
        public year_percent: number
    ) {}
}