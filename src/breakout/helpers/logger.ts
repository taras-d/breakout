
declare var LOG: boolean;

export class Logger {

    log(msg: any, ...args: any[]): void {
        if (LOG) {
            console.log(msg, ...args);
        }
    }

}

export const logger = new Logger();