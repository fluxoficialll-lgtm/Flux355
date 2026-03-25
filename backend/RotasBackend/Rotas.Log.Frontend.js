import express from 'express';
import logger from '../config/logger.js';

const router = express.Router();

// Lista de níveis de log permitidos para segurança
const allowedLevels = ['error', 'warn', 'info', 'http', 'debug'];

const frontendLogger = logger.child({
    modulo: 'FRONTEND',
    arquivo: 'logs.frontend.route.js'
});

router.post('/', (req, res) => {
    const logData = req.body;

    // Garante que o nível é válido, usando 'info' como padrão caso contrário.
    const level = 
        logData.level && allowedLevels.includes(logData.level.toLowerCase())
            ? logData.level.toLowerCase()
            : 'info';

    // O objeto original do frontend é aninhado em 'dados' para evitar conflitos.
    frontendLogger.log({
        level: level,
        message: logData.mensagem || 'Log do frontend recebido',
        dados: logData 
    });

    res.status(202).send({ status: 'Log recebido' });
});

export default router;
