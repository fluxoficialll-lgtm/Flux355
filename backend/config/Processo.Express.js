
import express from 'express';
import path from 'path';
import fs from 'fs';
import apiRoutes from '../RotasBackend/Rotas.js';
import { setupMiddlewares } from './Sistema.Middleware.js';
import createServerLogger from './Log.Servidor.js';

export function configureExpress(app, io) {
    const logger = createServerLogger(import.meta.url);

    setupMiddlewares(app, io);

    app.use('/api', apiRoutes);

    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));

    app.use('/api', (req, res) => {
        logger.warn('Endpoint da API não encontrado (404)', {
            componente: 'API',
            dados: { path: req.path, method: req.method, traceId: req.traceId }
        });
        res.status(404).json({ error: 'Endpoint da API não encontrado.', traceId: req.traceId });
    });

    app.get('*', (req, res) => {
        const indexPath = path.join(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            logger.warn('Arquivo index.html não encontrado na pasta dist', {
                componente: 'Servidor Web',
                dados: { path: req.path }
            });
            res.status(404).send('Build do frontend não encontrado. Verifique se o arquivo index.html existe na pasta /dist.');
        }
    });

    app.use((err, req, res, next) => {
        const traceId = req.traceId || 'untraced-error';
        let publicMessage = 'Ocorreu um erro inesperado no servidor.';
        let logMessage = (err instanceof Error) ? err.message : 'Ocorreu um erro inesperado.';
        let statusCode = 500;

        if (err.code === '23502' || (err.message && err.message.includes('violates not-null constraint'))) {
            statusCode = 400; // Bad Request
            publicMessage = 'Falha ao processar a requisição: um campo obrigatório não foi preenchido.';
            logMessage = `Violação de NOT NULL na coluna '${err.column}' da tabela '${err.table}'.`;
        }

        logger.error(`Erro não tratado em uma rota do Express: ${logMessage}`, {
            componente: 'API',
            dados: { path: req.path, method: req.method, traceId },
            error: err
        });

        if (res.headersSent) {
            return next(err);
        }

        res.status(statusCode).json({
            error: publicMessage,
            traceId
        });
    });
}
