import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';

// Importa os novos middlewares de log da nossa arquitetura centralizada
import logMiddleware from '../Logs/Middleware.Logs.js';
import Log from '../Logs/BK.Log.Supremo.js';

export const setupMiddlewares = (app, io) => {
    // Configurações de segurança e otimização (mantidas como estão)
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
        referrerPolicy: { policy: "no-referrer-when-downgrade" }
    }));
    app.use(cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'X-Flux-Client-ID', 'X-Flux-Trace-ID', 'X-Admin-Action', 'X-Protocol-Version'],
        exposedHeaders: ['X-Flux-Trace-ID']
    }));
    app.use(compression());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.set('trust proxy', 1);

    // --- INTEGRAÇÃO DO NOVO SISTEMA DE LOG ---
    // A ORDEM AQUI É CRUCIAL

    // 1. Middleware de Log: Gera o traceId, anexa em `req.traceId` e loga INBOUND/OUTBOUND.
    app.use(logMiddleware);

    // 2. Middleware de Contexto: Pega o `req.traceId` e o torna disponível
    // em toda a aplicação via CLS (cls-hooked) para os loggers com escopo.
    app.use(Log.contextMiddleware);

    // Middleware para anexar o 'io' do Socket.IO (se necessário)
    app.use((req, res, next) => {
        req.io = io;
        next();
    });

    // O antigo middleware de log monolítico foi completamente substituído pelos dois acima.
    // Agora, qualquer serviço/controller pode criar seu próprio logger com:
    // import Log from '../Logs/BK.Log.Supremo.js';
    // const logger = Log.createLogger('MeuServico');
    // E o traceId será injetado automaticamente.
};
