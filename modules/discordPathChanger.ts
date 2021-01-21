import { readdirSync, existsSync, readFile, writeFileSync, rename } from 'fs';
import * as asar from 'asar';
import * as path from 'path';
import Logger from './logger';

const log = new Logger();

export default () => {

const AppData:       string      = process.env.AppData!.replace('Roaming', '');
const version:       string      = getVersion(AppData + '/Local/Discord');

const core_path:     string      = path.join(AppData, `Roaming/discord/${version}/modules/discord_desktop_core/core.asar`);
const app_path:      string      = path.join(AppData, `Local/Discord/app-${version}/resources/app.asar`);

const core_temp:     string      = path.join(AppData, `Roaming/discord/${version}/modules/discord_desktop_core/tmp`);
const app_temp:      string      = path.join(AppData, `Local/Discord/app-${version}/resources/tmp`);

const app_pathfile:  string      = path.join(app_temp, 'common', 'paths.js');
const core_pathfile: string      = path.join(core_temp, 'common', 'paths.js');


function getVersion (directory: string) {
    log.info('Verificando instalação do Discord...');
    if (existsSync(directory)) {
        log.info('Discord instalado, verificando versão...');
        const dirFiles: string[] = readdirSync(directory);
        
        let version: any = undefined;
        
        dirFiles.forEach(e => {
            if (e.includes('app-')) {
                return version = e.replace('app-', '');
            };
        });

        if (version == undefined) {
            log.info('Não foi possível identificar a versão do Discord, programa finalizado.');
            return process.exit();
        };

        log.info(`Discord detectado com sucesso! Versão instalada: ${version}`);
        return version;
    };
};

function patchFiles (): void {
    try {
        asar.extractAll(app_path, AppData + `app-${version}/resources/tmp`);
        asar.extractAll(core_path, AppData + `Roaming'discord/${version}/modules/discord_desktop_core/tmp`);   
    } catch (error) {
        
        if(error.code == 'ENOENT') {
            log.warn(`O path do Discord não foi encontrado, talvez o patch já esteja aplicado.`);
            return;
        };
    }

    rewriteFiles(core_pathfile, app_pathfile);
};


function rewriteFiles(_core: string, _app: string): void { 
    
    let hash = genHash(64);
     
    readFile(_core, { encoding: 'utf-8' }, async (err, f_content) => {
        log.info('Aplicando patch em: "core.asar"');
        await applyPath(f_content, core_temp, core_pathfile, hash, 'core.asar');
    });

    readFile(_app, { encoding: 'utf-8' }, async (err, f_content) => {
        log.info('Aplicando patch em: "app.asar"');
        await applyPath(f_content, app_temp, app_pathfile, hash, 'app.asar');
        rename(path.join(AppData, 'Roaming', 'discord'), path.join(AppData, 'Roaming', hash), (error) => {
            if (error) {
                log.warn(`O patch foi aplicado, mas não foi possível renomear seu Discord no AppData. Faça-o manualmente acessando ${path.join(AppData, 'Roaming')} e renomeando a pasta 'discord' para seu hash: ${hash}`);
                return;
            };
    
            log.info('Patch aplicado com sucesso! = )');
        });
    });
};

async function applyPath (content: string, temp: string, pathfile: string, hash: string, filename: string) {
    const old_content = `return _path.default.join(userDataRoot, 'discord' + (buildInfo.releaseChannel == 'stable' ? '' : buildInfo.releaseChannel));`
    if (!content.includes(old_content)) 
        return log.info ('Path já aplicado ou arquivo modificado por terceiro.');

    let patch = content.replace(old_content, old_content.replace(`discord`, hash));
    writeFileSync(pathfile, patch, { encoding: 'utf-8' });

    asar.createPackage(temp, temp.replace('tmp', filename));

    return;
};

function genHash(length: number): string {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    log.info(`Chave de criptografia gerada: ${result}`);
    return result;
 }
 patchFiles();
}