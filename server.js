import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath as fileURLToPath_log } from 'url';

// --- Início do Código de Log Personalizado ---
const __filename_log = fileURLToPath_log(import.meta.url);
const __dirname_log = path.dirname(__filename_log);
const logDir = path.join(__dirname_log, 'logs');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logFile = fs.createWriteStream(path.join(logDir, 'app.log'), { flags: 'a' });

const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;
const originalInfo = console.info;

const logTimestamp = () => `[${new Date().toISOString()}]`;

console.log = (...args) => {
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
    logFile.write(`${logTimestamp()} [LOG] ${message}\n`);
    originalLog.apply(console, args);
};

console.error = (...args) => {
    const message = args.map(arg => arg instanceof Error ? arg.stack : (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg)).join(' ');
    logFile.write(`${logTimestamp()} [ERROR] ${message}\n`);
    originalError.apply(console, args);
};

console.warn = (...args) => {
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
    logFile.write(`${logTimestamp()} [WARN] ${message}\n`);
    originalWarn.apply(console, args);
};

console.info = (...args) => {
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
    logFile.write(`${logTimestamp()} [INFO] ${message}\n`);
    originalInfo.apply(console, args);
};

process.on('uncaughtException', (err, origin) => {
    console.error(`Exceção Não Capturada: ${err.message}`, { stack: err.stack, origin });
    fs.writeSync(logFile.fd, `${logTimestamp()} [FATAL] Uncaught Exception: ${err.stack}\n`);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Rejeição de Promise Não Tratada:', reason);
    fs.writeSync(logFile.fd, `${logTimestamp()} [FATAL] Unhandled Rejection: ${reason}\n`);
});

console.log('--- Sistema de Log em Arquivo Inicializado. Saída será gravada em logs/app.log ---');

// VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE CRÍTICAS
if (!process.env.JWT_SECRET) {
    console.error('ERRO FATAL: A variável de ambiente JWT_SECRET não está definida.');
    console.error('O servidor não pode iniciar sem esta chave de segurança.');
    process.exit(1); // Encerra o processo com um código de erro.
}

import express from 'express';
import http from 'http';
import { fileURLToPath } from 'url';
import { run as runMigrations } from './scripts/executar-migracoes.js';
import { initSocket } from './backend/config/socket.js';
import { setupMiddlewares } from './backend/config/middleware.js';
import { upload } from './backend/config/storage.js';
import { db } from './backend/database/InicializacaoDoPostgreSQL.js';
import apiRoutes from './backend/RotasBackend/Rotas.js';
import { auditorDoPostgreSQL } from './backend/database/AuditoresDeBancos/AuditorDoPostgreSQL.js';

// --- [INÍCIO] LÓGICA DE AUDITORIA DE ENDPOINTS ---
import { extrairTodasAsRotas } from './backend/util/rota-extractor.js';
import { registrarRotas as registrarRotasDeAuditoria } from './backend/Logs/BK.Log.Supremo.js';
// --- [FIM] LÓGICA DE AUDITORIA DE ENDPOINTS ---

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);

const io = initSocket(httpServer);
setupMiddlewares(app, io);

app.use('/api', apiRoutes);

// --- [INÍCIO] LÓGICA DE AUDITORIA DE ENDPOINTS ---
const rotasDoApp = extrairTodasAsRotas(app);
registrarRotasDeAuditoria(rotasDoApp);
console.log(`[AUDITORIA] ${rotasDoApp.length} endpoints registrados para auditoria.`);
// --- [FIM] LÓGICA DE AUDITORIA DE ENDPOINTS ---

app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        req.logger.warn('UPLOAD_FAILURE', { reason: 'No file uploaded' });
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    res.status(501).json({ error: 'A funcionalidade de upload está temporariamente desativada.' });
});

const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.use('/api', (req, res) => {
    req.logger.warn('NOT_FOUND', { path: req.path, method: req.method });
    res.status(404).json({ error: 'Endpoint não encontrado.', traceId: req.traceId });
});

// --- TRATAMENTO DE ERRO GLOBAL (REVISADO) ---
app.use((err, req, res, next) => {
    const logger = req.logger || console;
    const traceId = req.traceId || 'untraced-error';

    // Garante que o log seja informativo, mesmo que 'err' não seja um objeto Error padrão.
    let errorInfo = {};
    if (err instanceof Error) {
        errorInfo = { message: err.message, stack: err.stack };
    } else if (typeof err === 'object' && err !== null) {
        errorInfo = { message: 'Ocorreu um erro com um objeto não-Error.', details: err };
    } else {
        errorInfo = { message: 'Ocorreu um erro com um tipo primitivo.', details: err };
    }

    logger.error('GLOBAL_UNHANDLED_ERROR', {
        error: errorInfo,
        path: req.path,
        method: req.method,
        traceId: traceId
    });

    if (res.headersSent) {
        return next(err); // Se a resposta já foi enviada, passa o erro para o próximo manipulador do Express.
    }

    // Responde apenas para rotas de API. Outras rotas (como de arquivos estáticos)
    // podem ter seu próprio tratamento ou deixar o Express lidar com elas.
    if (req.path.startsWith('/api')) {
        return res.status(500).json({
            error: 'Ocorreu um erro inesperado no servidor.',
            message: errorInfo.message, // Fornece uma mensagem mais específica em desenvolvimento
            traceId: traceId
        });
    }

    // Para erros fora da API, podemos ter uma página de erro genérica ou apenas passar adiante
    next(err);
});

app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.warn('FRONTEND_BUILD_MISSING', { path: req.path });
        res.status(404).send('Frontend build not found.');
    }
});


const startApp = async () => {
    try {
        await runMigrations();
        console.log('MIGRATION_SUCCESS', { message: 'Migrações do banco de dados aplicadas com sucesso.' });

        await db.init();
        console.log('DB_INIT', { message: 'Database system initialized successfully.' });

        setTimeout(() => {
            auditorDoPostgreSQL.inspectDatabases();
        }, 5000);

        httpServer.listen(PORT, '0.0.0.0', () => {
            console.log('SERVER_START', { port: PORT, env: process.env.NODE_ENV });
        });

    } catch (error) {
        console.error('APP_STARTUP_FAILURE', {
            error: { message: error.message, stack: error.stack },
            reason: 'Falha crítica durante a inicialização da aplicação.'
        });
        process.exit(1);
    }
};

startApp();
