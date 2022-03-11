import express from 'express';

const check_auth = (request: express.Request, response: express.Response): boolean => {
    const user_cookie = request.cookies?.user
    if (user_cookie == undefined) {
        response.redirect("/login")
        return false
    }
    console.log(user_cookie)
    return true
}

function RequireAuth() {
    return function (
        target: Object,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
            const childFunction = descriptor.value;
            descriptor.value = function (...args: any[]) {
            const req = args[0]
            const res = args[1]
            if (check_auth(req,res)) {
                return childFunction.apply(this, args)
            }
            else {
                return null
            }
        };
        return descriptor
    }
}

export default RequireAuth