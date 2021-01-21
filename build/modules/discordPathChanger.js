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
const fs_1 = require("fs");
const asar = __importStar(require("asar"));
const path = __importStar(require("path"));
const logger_1 = __importDefault(require("./logger"));
const log = new logger_1.default();
exports.default = () => {
    const AppData = process.env.AppData.replace('Roaming', '');
    const version = getVersion(AppData + '/Local/Discord');
    const core_path = path.join(AppData, `Roaming/discord/${version}/modules/discord_desktop_core/core.asar`);
    const app_path = path.join(AppData, `Local/Discord/app-${version}/resources/app.asar`);
    const core_temp = path.join(AppData, `Roaming/discord/${version}/modules/discord_desktop_core/tmp`);
    const app_temp = path.join(AppData, `Local/Discord/app-${version}/resources/tmp`);
    const app_pathfile = path.join(app_temp, 'common', 'paths.js');
    const core_pathfile = path.join(core_temp, 'common', 'paths.js');
    // Verificando se o Discord está instalado.
    function getVersion(directory) {
        log.info('Verificando instalação do Discord...');
        if (fs_1.existsSync(directory)) {
            log.info('Discord instalado, verificando versão...');
            const dirFiles = fs_1.readdirSync(directory);
            let version = undefined;
            dirFiles.forEach(e => {
                if (e.includes('app-')) {
                    return version = e.replace('app-', '');
                }
                ;
            });
            if (version == undefined) {
                log.info('Não foi possível identificar a versão do Discord, programa finalizado.');
                return process.exit();
            }
            ;
            log.info(`Discord detectado com sucesso! Versão instalada: ${version}`);
            return version;
        }
        ;
    }
    ;
    function patchFiles() {
        try {
            asar.extractAll(app_path, AppData + `app-${version}/resources/tmp`);
            asar.extractAll(core_path, AppData + `Roaming'discord/${version}/modules/discord_desktop_core/tmp`);
        }
        catch (error) {
            if (error.code == 'ENOENT') {
                log.warn(`O path do Discord não foi encontrado, talvez o patch já esteja aplicado.`);
                return;
            }
            ;
        }
        rewriteFiles(core_pathfile, app_pathfile);
    }
    ;
    function rewriteFiles(_core, _app) {
        let hash = genHash(64);
        fs_1.readFile(_core, { encoding: 'utf-8' }, async (err, f_content) => {
            log.info('Aplicando patch em: "core.asar"');
            await applyPath(f_content, core_temp, core_pathfile, hash, 'core.asar');
        });
        fs_1.readFile(_app, { encoding: 'utf-8' }, async (err, f_content) => {
            log.info('Aplicando patch em: "app.asar"');
            await applyPath(f_content, app_temp, app_pathfile, hash, 'app.asar');
            fs_1.rename(path.join(AppData, 'Roaming', 'discord'), path.join(AppData, 'Roaming', hash), (error) => {
                if (error) {
                    log.warn(`O patch foi aplicado, mas não foi possível renomear seu Discord no AppData. Faça-o manualmente acessando ${path.join(AppData, 'Roaming')} e renomeando a pasta 'discord' para seu hash: ${hash}`);
                    return;
                }
                ;
                log.info('Patch aplicado com sucesso! = )');
            });
        });
    }
    ;
    async function applyPath(content, temp, pathfile, hash, filename) {
        const old_content = `return _path.default.join(userDataRoot, 'discord' + (buildInfo.releaseChannel == 'stable' ? '' : buildInfo.releaseChannel));`;
        if (!content.includes(old_content))
            return log.info('Path já aplicado ou arquivo modificado por terceiro.');
        let patch = content.replace(old_content, old_content.replace(`discord`, hash));
        fs_1.writeFileSync(pathfile, patch, { encoding: 'utf-8' });
        asar.createPackage(temp, temp.replace('tmp', filename));
        return;
    }
    ;
    function genHash(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        log.info(`Chave de criptografia gerada: ${result}`);
        return result;
    }
    patchFiles();
};
