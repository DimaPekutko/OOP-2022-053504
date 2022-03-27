export class SalaryRequest {
    constructor(
        public bank_id: number,
        public user_id: number,
        public company_id: string,
        public monthly_sum: number
    ) {}
}