import { RequireAdminAuth } from "../AuthState";
import express from "express"
import { readFileSync } from "fs";

export default abstract class LogsController {
    @RequireAdminAuth()
    static async logs(request: express.Request, response: express.Response) {
        const logs_str: string = readFileSync("logs.txt", "utf-8")
        response.send(logs_str.split("\n").join("<br>"))
    }
}