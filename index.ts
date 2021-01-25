import * as os from 'os';
import * as tkit from 'terminal-kit';
import Logger from './modules/logger';
import patchIt from './modules/discordPathChanger';

const logger = new Logger();

if(os.platform() !== 'win32') {
    logger.warn('Esta aplicação não é feita pro seu sistema operacional.');
    process.exit();
}

const term = tkit.terminal;

term.windowTitle('Dopple v0.1');

process.on('unhandledRejection', () => { return });

const question = async () => {

    await logger.warn("Oi, tudo bom?");
    await logger.warn("Este patch aqui vai modificar o seu Discord permanentemente...");
    await logger.info(`Então se não souber o que tá fazendo e tal, é melhor fechar o programa enquanto ainda dá.`);
    await logger.info(`Mas se você sabe, e LEU A DOCUMENTAÇÃO >:) então pode prosseguir.`);
    await logger.info(`Como funciona? Bom... Nós vamos modificar o Discord no seu PC`);
    await logger.info(`Pra que ele se camufle contra ameaças de todos os tipos tipo roubar sua conta`);
    await logger.info(`Mas é sério, nada disso substitui o uso consciente do seu computador`);
    await logger.info(`Então siga o senso comum e não abra nadinha que você não sabe o que é`);
    await logger.info(`Mesmo que venha de algum amigo seu`);

    term.cyan(`\n\n               Pressione [S ou ENTER] para iniciar e [N] para sair`);
    
    term.yesOrNo({ yes: ['S', 'ENTER', 's'], no: ['n', 'N'] }, async (err, result) => {''
        if (result) {
            term.clear();
            await logger.proc('O código-fonte e atualizações deste programa podem ser encontrados em: https://github.com/AlevEve/Dopple');
            await logger.proc("Créditos: Chinês // Banca Lab's.");

            term.clear();

            logger.proc("Você já aplicou o patch antes? ('S' para SIM e 'N' para NÃO).");
            term.yesOrNo({ yes: [ 's', 'S' ], no: [ 'N', 'n' ] }, async (err, _result) => {

            if(_result) {
                logger.proc('Informe sua chave de criptografia anterior: ');
                const load_hash = await term.inputField({}).promise;


                patchIt(load_hash);

            } else {
                logger.proc("Assumindo caminho do cliente como: 'discord'");
                
                patchIt('discord');
            
            }
        }); 
        } else {
            process.exit();
        }
    });
};

question();
