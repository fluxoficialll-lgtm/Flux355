
// --- IMPORTS ---
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';

import { run as runMigrations } from './scripts/executar-migracoes.js';
import { setupMiddlewares } from './backend/config/Sistema.Middleware.js';
import { db, auditorDoPostgreSQL } from './backend/database/Sistema.Banco.Dados.js';
import apiRoutes from './backend/RotasBackend/Rotas.js';
import { backendLogger, databaseLogger } from './backend/config/Sistema.Escritor.Logs.js';

// --- CONFIGURAÇÃO INICIAL ---
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// --- MANIPULADORES DE ERRO GLOBAIS ---
process.on('uncaughtException', (err, origin) => {
    backendLogger.error('Exceção Não Capturada:', { 
        message: err.message, 
        stack: err.stack, 
        origin 
    });
    // Garante que o log seja escrito antes de sair
    setTimeout(() => process.exit(1), 1000); 
});

process.on('unhandledRejection', (reason, promise) => {
    backendLogger.error('Rejeição de Promise Não Tratada:', reason);
});

// --- INICIALIZAÇÃO DA APLICAÇÃO CORE ---
backendLogger.info('--- Inicializando o Servidor ---');

if (!process.env.JWT_SECRET) {
    backendLogger.error('ERRO FATAL: A variável de ambiente JWT_SECRET não está definida. O servidor não pode iniciar.');
    process.exit(1);
}

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'X-Flux-Client-ID', 'X-Flux-Trace-ID', 'X-Admin-Action', 'X-Protocol-Version'],
    }
});

// --- CONFIGURAÇÃO DE MIDDLEWARES ---
setupMiddlewares(app, io);

// --- CONFIGURAÇÃO DE ROTAS ---
app.use('/api', apiRoutes);

const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

// Middleware para rotas de API não encontradas
app.use('/api', (req, res) => {
    backendLogger.warn('Endpoint da API não encontrado (404)', { path: req.path, method: req.method });
    res.status(404).json({ error: 'Endpoint da API não encontrado.', traceId: req.traceId });
});

// Rota para servir o frontend (deve vir depois da API)
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        backendLogger.warn('Arquivo index.html não encontrado na pasta dist', { path: req.path });
        res.status(404).send('Build do frontend não encontrado. Verifique se o arquivo index.html existe na pasta /dist.');
    }
});

// --- MANIPULADOR DE ERRO GLOBAL DO EXPRESS ---
app.use((err, req, res, next) => {
    const traceId = req.traceId || 'untraced-error';
    const errorInfo = (err instanceof Error) 
        ? { message: err.message, stack: err.stack } 
        : { message: 'Ocorreu um erro inesperado.', details: err };

    backendLogger.error('Erro não tratado em uma rota do Express', { 
        error: errorInfo, 
        path: req.path, 
        method: req.method, 
        traceId 
    });

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        error: 'Ocorreu um erro inesperado no servidor.',
        message: errorInfo.message,
        traceId
    });
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
const startApp = async () => {
    backendLogger.info("Iniciando a aplicação...");
    try {
        await runMigrations();
        databaseLogger.info('Migrações do banco de dados aplicadas com sucesso.');

        await db.init();
        databaseLogger.info('Sistema de banco de dados inicializado com sucesso.');

        setTimeout(() => {
            auditorDoPostgreSQL.inspectDatabases(databaseLogger); // Usando o logger de DB
        }, 5000);

        httpServer.listen(PORT, '0.0.0.0', () => {
            backendLogger.info(`Servidor iniciado com sucesso na porta ${PORT} no ambiente ${process.env.NODE_ENV || 'development'}.`);
        });

    } catch (error) {
        backendLogger.error('Falha crítica durante a inicialização da aplicação.', error);
        process.exit(1);
    }
};

startApp();
