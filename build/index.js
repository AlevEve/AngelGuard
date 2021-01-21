"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(require("os"));
const logger_1 = __importDefault(require("./modules/logger"));
const tkit = __importStar(require("terminal-kit"));
const discordPathChanger_1 = __importDefault(require("./modules/discordPathChanger"));
const logger = new logger_1.default();
if (os.platform() !== 'win32') {
    logger.warn('Esta aplicação não é feita pro seu sistema operacional.');
    process.exit();
}
;
const term = tkit.terminal;
const question = () => {
    logger.warn("This patch will change your discord client files. If you don't know what you're doing here, please close this program.\n");
    logger.info("[Q]: But how does it works?\n");
    logger.info("[R]: The patch consists in change your discord folder location or name and inject this information inside of the discord client.\n");
    logger.info("Then, the client can find itself in your drive, but, third-party programs not. It prevents your auth token - or simply token - from being robbed. =)\n");
    logger.info(`\n\n\n Press [Y] or [ENTER] to install or [N] to quit`);
    term.yesOrNo({ yes: ['y', 'ENTER'], no: ['n', 'N'] }, async (err, result) => {
        if (result) {
            term.clear();
            await term.drawImage('./assets/sky.png', {
                shrink: {
                    width: 120,
                    height: 120
                }
            });
            await term.slowTyping('This program free and open-source and can be found at: https://github.com/AlevEve/Dishield\n');
            await term.slowTyping("Credits: @Chinês (AlevEve) - @BancaLab's / 2021");
            term.clear();
            return discordPathChanger_1.default();
        }
        else {
            process.exit();
        }
        ;
    });
};
question();
