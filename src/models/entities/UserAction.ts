export abstract class UserAction {
  constructor(public bank_id: string, public user_id: string) {}
}
export class TransferMoneyUserAction extends UserAction {
  constructor(
    bank_id: string,
    user_id: string,
    public sender_acc_id: string,
    public receiver_acc_id: string,
    public total_sum: number
  ) {
    super(bank_id, user_id);
  }
}
export class CreateAccUserAction extends UserAction {
  constructor(bank_id: string, user_id: string, public acc_id: string) {
    super(bank_id, user_id);
  }
}
export class DeleteAccUserAction extends UserAction {
  constructor(
    bank_id: string,
    user_id: string,
    public acc_id: string,
    public remain_money: number
  ) {
    super(bank_id, user_id);
  }
}
export class RegisterUserAction extends UserAction {
  constructor(bank_id: string, user_id: string) {
    super(bank_id, user_id);
  }
}
export class SalaryRequestUserAction extends UserAction {
  constructor(bank_id: string, user_id: string, public company_id: string) {
    super(bank_id, user_id);
  }
}
export class CreditRequestUserAction extends UserAction {
  constructor(
    bank_id: string,
    user_id: string,
    public months_duration: number,
    public total_sum: number,
    public year_percent: number
  ) {
    super(bank_id, user_id);
  }
}
