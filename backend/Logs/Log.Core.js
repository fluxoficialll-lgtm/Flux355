import { createLogger, format, transports } from 'winston';
import { v4 as uuidv4 } from 'uuid';

const { combine, timestamp, printf, colorize, errors } = format;

// Formato de log genérico
const baseLogFormat = printf(({ level, message, timestamp, traceId, ...metadata }) => {
    let msg = `${timestamp} [${level}]`;
    if (traceId) {
        msg += ` [traceId: ${traceId}]`;
    }
    msg += `: ${message}`;
    if (metadata && Object.keys(metadata).length > 0 && !(Object.keys(metadata).length === 1 && metadata.stack)) {
        // Não stringify se for apenas o stack de erro, que já é adicionado pelo `errors({ stack: true })`
        try {
            msg += ` \n${JSON.stringify(metadata, null, 2)}`;
        } catch (e) {
            // Evita erros de referência circular
            msg += ` \n[METADATA_UNSERIALIZABLE]`;
        }
    }
    return msg;
});

const commonConfig = {
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        baseLogFormat
    ),
    exitOnError: false
};

// Logger de Sistema
const systemLogger = createLogger({
    ...commonConfig,
    level: 'info',
    transports: [
        new transports.Console({
            format: combine(colorize(), baseLogFormat)
        }),
        new transports.File({ filename: 'logs/system.log' })
    ]
});

// Logger de Banco de Dados
const databaseLogger = createLogger({
    ...commonConfig,
    level: 'debug', // Habilita debug para logs de banco de dados
    transports: [
        new transports.Console({
            format: combine(colorize(), baseLogFormat)
        }),
        new transports.File({ filename: 'logs/database.log' })
    ]
});

// Logger de Serviços
const serviceLogger = createLogger({
    ...commonConfig,
    level: 'info',
    transports: [
        new transports.Console({
            format: combine(colorize(), baseLogFormat)
        }),
        new transports.File({ filename: 'logs/service.log' })
    ]
});

// Logger de Controladores
const controllerLogger = createLogger({
    ...commonConfig,
    level: 'info',
    transports: [
        new transports.Console({
            format: combine(colorize(), baseLogFormat)
        }),
        new transports.File({ filename: 'logs/controller.log' })
    ]
});


/**
 * Middleware para log de requisições.
 */
export const requestLoggerMiddleware = (req, res, next) => {
    const traceId = req.headers['x-flux-trace-id'] || uuidv4();
    req.traceId = traceId;

    req.logger = systemLogger.child({ traceId });

    res.setHeader('X-Flux-Trace-ID', traceId);

    const start = process.hrtime();
    req.logger.info(`Request Start: ${req.method} ${req.originalUrl}`);

    res.on('finish', () => {
        const durationInMilliseconds = getDurationInMilliseconds(start);
        req.logger.info(`Request End: ${req.method} ${req.originalUrl} - ${res.statusCode} [${durationInMilliseconds.toFixed(2)}ms]`);
    });

    next();
};

const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e-6;
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) * NS_TO_MS;
};

// Exportações dos loggers
export const logger = systemLogger;
export const database = databaseLogger;
export const service = serviceLogger;
export const controller = controllerLogger;
