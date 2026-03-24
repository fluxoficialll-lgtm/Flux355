// backend/config/middleware.js

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';

// Importa o nosso novo e centralizado sistema de log
import * as Log from '../Logs/BK.Log.Supremo.js'; // Corrigido para importação nomeada

export const setupMiddlewares = (app, io) => {
    // Configurações de segurança e otimização
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

    // --- INTEGRAÇÃO DO NOVO SISTEMA DE LOG SUPREMO ---
    // Este único middleware cuida da criação do traceId, do contexto e do log de requisições.
    app.use(Log.requestLoggerMiddleware);

    // Middleware para anexar o 'io' do Socket.IO
    app.use((req, res, next) => {
        req.io = io;
        next();
    });
};
