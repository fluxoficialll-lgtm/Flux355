
// backend/config/Log.Queries.js

import path from 'path';
import logger from './logger.js';

/**
 * Cria uma instância de logger para uma consulta específica.
 * @param {string} filePath - O caminho do arquivo que está usando o logger.
 * @returns {object} - Um objeto com métodos de log (info, warn, error, debug).
 */
const createQueryLogger = (filePath) => {
    const fileName = path.basename(filePath);
    const moduleName = fileName.replace('.js', '');

    const log = (level, message, meta = {}) => {
        const logObject = {
            modulo: moduleName,
            arquivo: fileName,
            ...meta
        };

        // Lógica de erro robusta
        if (meta instanceof Error) {
            logObject.stack = meta.stack;
            logObject.errorMessage = meta.message;
        } else if (meta?.error instanceof Error) {
            logObject.stack = meta.error.stack;
            logObject.errorMessage = meta.error.message;
        }

        // Fallback para nível de log inválido
        if (typeof logger[level] === 'function') {
            logger[level](message, logObject);
        } else {
            logger.warn(`[Logger] Nível de log inválido '${level}' utilizado. Usando 'info' como fallback.`, {
                originalMessage: message,
                originalMeta: logObject
            });
            logger.info(message, logObject);
        }
    };

    return {
        info: (message, meta) => log('info', message, meta),
        warn: (message, meta) => log('warn', message, meta),
        error: (message, meta) => log('error', message, meta),
        debug: (message, meta) => log('debug', message, meta),
    };
};

export default createQueryLogger;
