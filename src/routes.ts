import express from "express";
import AccountController from "./controllers/AccountController";
// import express from 'express';
// import UserPageController from './controllers/UserPageController';
import AuthController from "./controllers/AuthController";
import BankController from "./controllers/BankController";
import CompanyController from "./controllers/CompanyController";
import LogsController from "./controllers/LogsController";
import RequestController from "./controllers/RequestController";
import UserActionControler from "./controllers/UserActionController";

const main_router = express.Router();

main_router.get("/", (request: express.Request, response: express.Response) => {
    response.redirect("/companies")
});


main_router.get("/login", AuthController.login);
main_router.post("/login", AuthController.loginPOST);
main_router.get("/register", AuthController.register);
main_router.post("/register", AuthController.registerPOST);
main_router.get("/exit", AuthController.exit);

main_router.post("/bank/credit_request", BankController.credit_request)

main_router.get("/companies", CompanyController.companies)
main_router.post("/companies/salary_request", CompanyController.salary_request)

main_router.get("/requests", RequestController.requests)
main_router.get("/accounts", AccountController.accounts);
main_router.post("/accounts/create", AccountController.create);
main_router.post("/accounts/delete", AccountController.delete);
main_router.post("/accounts/send", AccountController.send);

main_router.get("/actions", UserActionControler.actions);
main_router.post("/actions/reject/create_acc", UserActionControler.reject_create_acc);
main_router.post("/actions/reject/delete_acc", UserActionControler.reject_delete_acc);
main_router.post("/actions/reject/tranfer_money", UserActionControler.reject_transfer_money);
main_router.post("/actions/accept/salary_request", UserActionControler.accept_salary_request);
main_router.post("/actions/accept/credit_request", UserActionControler.accept_credit_request);

main_router.get("/logs", LogsController.logs);

export {main_router};
