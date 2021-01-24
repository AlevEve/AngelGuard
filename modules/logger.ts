import * as tkit from 'terminal-kit';

const term = tkit.terminal;

export default class Logger {
    async warn(message: string): Promise<number> {
        await term.yellow.bold('\n[Angel').white('Guard]')(' > ').red.bold.slowTyping(message, { delay: 25 });
        return 1;
    }
    async info (message: string): Promise<number> {
        await term.yellow.bold('\n[Angel').white('Guard]')(' > ').cyan.slowTyping(message, { delay: 25 });
        return 1;
    }
    async proc (message: string): Promise<number> {
       await term.yellow.bold('\n[Angel').white('Guard]')(' > ').yellow.slowTyping(message, { delay: 25 });
       return 1;
    }
}