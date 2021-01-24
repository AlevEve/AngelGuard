import { readdirSync, existsSync, readFile, writeFileSync, rename } from 'fs-extra';
import * as asar from 'asar';
import * as path from 'path';
import Logger from './logger';

const log = new Logger();

export default async (hashed_path: string): Promise<void> => {

const AppData:       string      = process.env.AppData.replace('Roaming', '');
const version:       string      = await getVersion(AppData + '/Local/Discord');

const core_path:     string      = path.join(AppData, `Roaming/${hashed_path}/${version}/modules/discord_desktop_core/core.asar`);
const app_path:      string      = path.join(AppData, `Local/Discord/app-${version}/resources/app.asar`);

const core_temp:     string      = path.join(AppData, `Roaming/${hashed_path}/${version}/modules/discord_desktop_core/tmp`);
const app_temp:      string      = path.join(AppData, `Local/Discord/app-${version}/resources/tmp`);

const app_pathfile:  string      = path.join(app_temp, 'common', 'paths.js');
const core_pathfile: string      = path.join(core_temp, 'common', 'paths.js');


async function getVersion (directory: string): Promise<string> {
    await log.proc('Verificando instalação do Discord...');
    if (existsSync(directory)) {
        await log.warn('Discord instalado, verificando versão...');
        const dirFiles: string[] = readdirSync(directory);
        
        let version;
        
        dirFiles.forEach(e => {
            if (e.includes('app-')) {
                return version = e.replace('app-', '');
            }
        });

        if (!version) {
            await log.warn('Não foi possível identificar a versão do Discord, programa finalizado.');
            return process.exit();
        }

        await log.warn(`Discord detectado com sucesso! Versão instalada: ${version}`);
        return version;
    }
}

async function patchFiles (): Promise<void> {
    try {
        asar.extractAll(app_path, path.join(AppData, 'Local', 'Discord', `app-${version}`, 'resources', 'tmp'))
        asar.extractAll(core_path, path.join(AppData,'Roaming', hashed_path, `${version}`,'modules','discord_desktop_core','tmp'));
    } catch (error) {
        
        if(error.code == 'ENOENT') {
            await log.warn(error);
            await log.warn(`O path do Discord não foi encontrado, talvez o patch já esteja aplicado.`);
            return;
        }
    }

    rewriteFiles(core_pathfile, app_pathfile);
}


async function rewriteFiles(_core: string, _app: string): Promise<void> { 
    
    const hash = await genHash();
    readFile(_core, 'utf-8', async (err, f_content) => {
        
        if (err) {
            console.log(err, 1)
        }

        await log.proc('Aplicando patch em: "core.asar"');
        await applyPath(f_content, core_temp, core_pathfile, hash, 'core.asar');
    });

    readFile(_app, 'utf-8', async (err, f_content) => {
        await log.proc('Aplicando patch em: "app.asar"');
        await applyPath(f_content, app_temp, app_pathfile, hash, 'app.asar');
        rename(path.join(AppData, 'Roaming', hashed_path), path.join(AppData, 'Roaming', hash), async (error) => {
            if (error) {
                await log.warn(`O patch foi aplicado, mas não foi possível renomear seu Discord no AppData. Faça-o manualmente acessando ${path.join(AppData, 'Roaming')} e renomeando a pasta 'discord' para seu hash: ${hash}`);
                return;
            }
    
            await log.warn('Patch aplicado com sucesso! O programa pode ser fechado.');
        });
    });
}

async function applyPath (content: string, temp: string, pathfile: string, hash: string, filename: string) {
    const old_content = `return _path.default.join(userDataRoot, '${hashed_path}' + (buildInfo.releaseChannel == 'stable' ? '' : buildInfo.releaseChannel));`
    if (!content.includes(old_content)) 
        return await log.warn ('Path já aplicado ou arquivo modificado por terceiro.');

    const patch = content.replace(old_content, old_content.replace(hashed_path, hash));
    writeFileSync(pathfile, patch, { encoding: 'utf-8' });

    asar.createPackage(temp, temp.replace('tmp', filename));

    return;
}

async function genHash(): Promise<string> {
    
    const length: number = Math.floor(Math.random() * (16 - 64) ) + 16;
    
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength: number = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    await log.warn(`Chave de criptografia gerada: ${result}`);
    return result;
 }
 patchFiles();
}