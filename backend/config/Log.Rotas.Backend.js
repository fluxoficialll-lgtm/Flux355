
// backend/config/Log.Rotas.Backend.js

import path from 'path';
import logger from './logger.js';

/**
 * Cria uma instância de logger para um arquivo de rota específico.
 * @param {string} filePath - O caminho do arquivo que está usando o logger.
 * @returns {object} - Um objeto com métodos de log (info, warn, error, debug).
 */
const createRotaLogger = (filePath) => {
    const fileName = path.basename(filePath);
    const moduleName = fileName.replace('.js', '');

    const log = (level, message, meta = {}) => {
        const logObject = {
            modulo: moduleName,
            arquivo: fileName,
            ...meta
        };

        // Se o meta for um erro, extrai a stack
        if (meta instanceof Error) {
            logObject.stack = meta.stack;
            logObject.errorMessage = meta.message;
        }

        logger[level](message, logObject);
    };

    return {
        info: (message, meta) => log('info', message, meta),
        warn: (message, meta) => log('warn', message, meta),
        error: (message, meta) => log('error', message, meta),
        debug: (message, meta) => log('debug', message, meta),
    };
};

export default createRotaLogger;
