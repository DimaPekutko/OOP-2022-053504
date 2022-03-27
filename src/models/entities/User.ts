import Roles from "./Roles"

export abstract class User {
    constructor(
        public id: number, 
        public bank_id: number,
        public role: string, 
        public email: string,
        public password: string
    ) {}
}
export class RegularUser extends User {
    constructor(
        id: number, 
        bank_id: number,
        role: string, 
        email: string,
        password: string,
        public name: string,
        public phone: number,
        public company_id: string = ""
    ) {
        super(id,bank_id,role,email,password)
    }
}

export class ManagerUser extends User {
    constructor(
        id: number, 
        bank_id: number,
        role: string = Roles.MANAGER, 
        email: string,
        password: string,
    ) {
        super(id,bank_id,role,email,password)
    }
}

export class OperatorUser extends User {
    constructor(
        id: number, 
        bank_id: number,
        role: string = Roles.OPERATOR, 
        email: string,
        password: string,
    ) {
        super(id,bank_id,role,email,password)
    }
}

export class AdminUser extends User {
    constructor(
        id: number, 
        bank_id: number,
        role: string = Roles.ADMIN, 
        email: string,
        password: string,
    ) {
        super(id,bank_id,role,email,password)
    }
}