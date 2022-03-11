import USER_ROLES from './entities/Roles';
import { readFileSync } from "fs"
import User from "./entities/User"

class UserModel {
    public users: User[] = [] 
    constructor() {
        let data = JSON.parse(String(readFileSync(__dirname+"/../../db/users.json")))
        let users = data?.users
        if (users?.length) {
            let ctx = this
            users.forEach((user: any) => {
                ctx.users.push(new User(
                    user.id,
                    user.name,
                    user.email,
                    user.password
                ))
            });
        }
    }
    get(email: string, password: string): User | null {
        for (let user of this.users) {
            if (user.email === email && user.password === password) {
                return user
            }
        }
        return null
    }
    find_one(id: number, role: string = USER_ROLES.USER){
    } 
}

export default new UserModel()