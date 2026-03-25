import { createLogger, format, transports } from 'winston';
import { v4 as uuidv4 } from 'uuid';

const { combine, timestamp, printf, errors, colorize } = format;

const visualLogFormat = printf(({ level, message, timestamp, camada, componente, arquivo, dados }) => {
    const statusEmoji = level === 'error' ? '❌' : '✅';
    const header = `${statusEmoji} ${camada || 'Backend'} | ${componente || '-'} | ${arquivo || '-'}`;
    const resumo = dados ? `IP: ${dados.ip ?? '-'} | Duração: ${dados.durationMs ?? '-'}ms` : '';
    return `${header}\n${message}\n${resumo}`;
});

const commonConfig = {
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        visualLogFormat
    ),
    exitOnError: false
};

// Logger principal
export const logger = createLogger({
    ...commonConfig,
    level: 'info',
    transports: [
        new transports.Console({ format: combine(colorize(), visualLogFormat) }),
        new transports.File({ filename: 'logs/system.log' })
    ]
});

// Middleware de requisição
export const requestLoggerMiddleware = (req, res, next) => {
    const traceId = req.headers['x-flux-trace-id'] || uuidv4();
    req.traceId = traceId;
    req.logger = logger.child({ traceId, camada: 'Backend', componente: 'API', arquivo: 'Middleware.Log.js' });

    const start = process.hrtime();
    req.logger.info(`Request Start: ${req.method} ${req.originalUrl}`, { dados: { ip: req.ip } });

    res.on('finish', () => {
        const durationInMilliseconds = getDurationInMilliseconds(start);
        req.logger.info(`Request End: ${req.method} ${req.originalUrl} - ${res.statusCode}`, {
            dados: { ip: req.ip, durationMs: durationInMilliseconds }
        });
    });

    next();
};

const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e-6;
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) * NS_TO_MS;
};
