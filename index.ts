import * as os from 'os';
import Logger from './modules/logger';
import * as tkit from 'terminal-kit';

import patchIt from './modules/discordPathChanger';

const logger = new Logger();

if(os.platform() !== 'win32') {
    logger.warn('Esta aplicação não é feita pro seu sistema operacional.');
    process.exit();
};

const term = tkit.terminal

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
            await term.slowTyping('This program is free and open-source and can be found at: https://github.com/AlevEve/Dishield\n');
            await term.slowTyping("Credits: @Chinês (AlevEve) - @BancaLab's / 2021");
            
            term.clear();
            
            return patchIt();
        } else {
            process.exit();
        };
    });
};

question();
