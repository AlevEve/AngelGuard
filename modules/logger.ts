import * as tkit from 'terminal-kit';

const term = tkit.terminal;

export default class Logger {
    warn(message: string) {
        return term.yellow.bold('[Angel').white('Guard]')(' > ').red.bold(message + '\n');
    }
    info (message: string) {
        return term.yellow.bold('[Angel').white('Guard]')(' > ').cyan(message + '\n');
    }
}