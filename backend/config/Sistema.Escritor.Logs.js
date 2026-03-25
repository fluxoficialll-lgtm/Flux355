
import fs from 'fs';
import path from 'path';

const logDirectory = path.resolve(process.cwd(), 'logs');

// Garante que o diretório de logs exista
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

/**
 * Cria uma instância de logger que escreve em um arquivo específico.
 * @param {string} fileName - O nome do arquivo de log (ex: 'backend.log').
 * @returns Um objeto logger com os métodos info, warn, error, log.
 */
const createLogger = (fileName) => {
    const logFile = path.join(logDirectory, fileName);

    const writeLog = (level, ...args) => {
        const timestamp = new Date().toISOString();
        const message = args.map(arg => {
            if (arg instanceof Error) return arg.stack;
            if (typeof arg === 'object' && arg !== null) return JSON.stringify(arg, null, 2);
            return String(arg);
        }).join(' ');

        const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
        fs.appendFileSync(logFile, logMessage);
    };

    return {
        info: (...args) => writeLog('info', ...args),
        warn: (...args) => writeLog('warn', ...args),
        error: (...args) => writeLog('error', ...args),
        log: (...args) => writeLog('log', ...args),
    };
};

// Cria e exporta loggers específicos
export const backendLogger = createLogger('backend.log');
export const frontendLogger = createLogger('frontend.log');
export const databaseLogger = createLogger('database.log');

// Logger de fallback ou para depuração geral
export default createLogger('application.log');
