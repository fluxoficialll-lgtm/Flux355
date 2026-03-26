
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

/**
 * Cria uma instância de logger para um componente específico do servidor a partir da URL do módulo.
 * @param {string} moduleUrl - A URL do módulo (geralmente import.meta.url).
 * @returns {object} - Um objeto com métodos de log (info, warn, error, debug).
 */
const createServerLogger = (moduleUrl) => {
    let componentName = 'Servidor'; // Valor padrão
    try {
        if (typeof moduleUrl === 'string' && moduleUrl) {
            const filePath = fileURLToPath(moduleUrl);
            componentName = path.basename(filePath, path.extname(filePath)); // Remove a extensão
        }
    } catch (e) {
        // Se a conversão falhar, usa o nome do componente padrão. 
        // Isso torna o logger mais resiliente.
        console.error('Erro ao extrair nome do componente do módulo URL:', e);
    }

    const log = (level, message, meta = {}) => {
        const logObject = {
            componente: componentName,
            ...meta,
        };

        // Lógica de erro robusta para extrair stack trace
        const errorInstance = meta instanceof Error ? meta : (meta?.error instanceof Error ? meta.error : null);
        if (errorInstance) {
            logObject.stack = errorInstance.stack;
            // Não sobrescreva a mensagem principal se já for detalhada
            if (!message.includes(errorInstance.message)) {
                 message = `${message}: ${errorInstance.message}`;
            }
            // Remove o objeto de erro duplicado do meta
            if (meta.error === errorInstance) {
                delete logObject.error;
            }
        }

        if (typeof logger[level] === 'function') {
            logger[level](message, logObject);
        } else {
            logger.warn(`[Logger] Nível de log inválido '${level}'. Usando 'info' como fallback.`, {
                originalMessage: message,
                originalMeta: logObject,
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

export default createServerLogger;
