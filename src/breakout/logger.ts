
export class Logger {

    log(msg: any, ...args: any[]): void {
        console.log(msg, ...args);
    }

}

export const logger = new Logger();