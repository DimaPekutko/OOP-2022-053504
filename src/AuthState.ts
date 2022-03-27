import express from 'express';
import Controller from './controllers/Controller';
import Roles from './models/entities/Roles';

const get_cookie = (request: express.Request) => {
    let cookie = request.cookies?.user
    if (cookie) {
        return JSON.parse(cookie)
    }
    return null
}

const check_regular_user_auth = (request: express.Request, response: express.Response, for_company_spec: boolean): any => {
    const cookie = get_cookie(request)
    if (!cookie) {
        response.redirect("/login")
        return null
    }
    if (for_company_spec) {
        if (cookie?.role === Roles.REGULAR || cookie?.role === Roles.COMPANY_SPEC) {
            return cookie
        }
        response.redirect("/login")
        return null
    }
    if (cookie?.role !== Roles.REGULAR) {
        response.redirect("/login")
        return null
    }
    return cookie
}

const check_operator_auth = (request: express.Request, response: express.Response): any => {
    const cookie = get_cookie(request)
    if (!cookie) {
        response.redirect("/login")
        return null
    }
    if (cookie?.role === Roles.OPERATOR || cookie?.role === Roles.COMPANY_SPEC || cookie?.role === Roles.ADMIN || cookie?.role === Roles.MANAGER) {
        return cookie
    }
    response.redirect("/login")
    return null
}

const check_admin_auth = (request: express.Request, response: express.Response): any => {
    const cookie = get_cookie(request)
    if (!cookie) {
        response.redirect("/login")
        return null
    }
    if (cookie?.role === Roles.ADMIN) {
        return cookie
    }
    response.redirect("/login")
    return null
}

function RequireAuth(for_company_spec: boolean = false) {
    return function (
        target: Controller,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const childFunction = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const req = args[0]
            const res = args[1]
            if (check_regular_user_auth(req,res,for_company_spec)) {
                return childFunction.apply(this, args)
            }
            return null
        };
        return descriptor
    }
}

function RequireOperatorAuth() {
    return function (
        target: Controller,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const childFunction = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const req = args[0]
            const res = args[1]
            if (check_operator_auth(req,res)) {
                return childFunction.apply(this, args)
            }
            return null
        };
        return descriptor
    }
}

function RequireAdminAuth() {
    return function (
        target: Controller,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const childFunction = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const req = args[0]
            const res = args[1]
            if (check_admin_auth(req,res)) {
                return childFunction.apply(this, args)
            }
            return null
        };
        return descriptor
    }
}

export {RequireAuth, RequireOperatorAuth, RequireAdminAuth, get_cookie}