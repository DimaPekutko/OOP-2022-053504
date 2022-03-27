import fs from "fs"

const get_date_time = (): string => {
    const today = new Date()
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    const dateTime = date+' '+time
    return dateTime
}

export abstract class GlobalLogger {
    private static file_name = "./logs.txt"
    static log(msg: string) {
        fs.appendFileSync(this.file_name, "["+get_date_time()+"] "+msg+"\n")
    }
}