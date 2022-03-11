import faker from "@faker-js/faker";
import { writeFileSync } from "fs";

let f = faker.internet.email()


const random_pass_id = () => {
    return Math.round(Math.random()*100000000)
}

const gen_users = () => {
    let users = []
    for (let i = 0; i < 100; i++) {
        users.push({
            id: random_pass_id(),
            role: "user",
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.random.word()
        })
    }
    writeFileSync("db/users.json",JSON.stringify({"users": users}))
}

gen_users()