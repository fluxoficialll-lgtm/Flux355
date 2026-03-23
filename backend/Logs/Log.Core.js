import { AsyncLocalStorage } from 'async_hooks';
import crypto from 'crypto';
import onFinished from 'on-finished';
import pino from 'pino';
import { Camadas } from './Log.Layers.js';

const asyncLocalStorage = new AsyncLocalStorage();

const baseLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level (label, number) {
      return { level: label }
    }
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

const createLayeredLogger = (camada) => {
  return new Proxy(baseLogger, {
    get(target, property, receiver) {
      if (typeof target[property] !== 'function') {
        return Reflect.get(target, property, receiver);
      }

      return (...args) => {
        const store = asyncLocalStorage.getStore();
        const context = {
          traceId: store?.traceId,
          camada,
        };

        if (args.length > 0 && typeof args[0] === 'object' && args[0] !== null) {
          args[0] = { ...context, ...args[0] };
        } else {
          args.unshift(context);
        }
        return target[property].apply(receiver, args);
      };
    },
  });
};

export const requestLoggerMiddleware = (req, res, next) => {
  const traceId = req.headers['x-request-id'] || crypto.randomUUID();
  
  asyncLocalStorage.run({ traceId }, () => {
    const logger = createLayeredLogger(Camadas.APPLICATION);
    req.log = logger;

    logger.info({ event: 'INBOUND', http: { request: { method: req.method, url: req.originalUrl } } }, `Requisição ${req.method} ${req.originalUrl} recebida.`);
    
    onFinished(res, (err, res) => {
        logger.info({ event: 'OUTBOUND', http: { response: { status_code: res.statusCode } } }, `Requisição ${req.method} ${req.originalUrl} finalizada com status ${res.statusCode}.`);
    });

    next();
  });
};

export const applicationLogger = createLayeredLogger(Camadas.APPLICATION);
export const controllerLogger = createLayeredLogger(Camadas.CONTROLLER);
export const serviceLogger = createLayeredLogger(Camadas.SERVICE);
export const databaseLogger = createLayeredLogger(Camadas.DATABASE);
