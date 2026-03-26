
// backend/RotasBackend/Rotas.Sessao.js

import express from 'express';
import controleSessao from '../controles/Controle.Sessao.js';
import createRotaLogger from '../config/Log.Rotas.Backend.js';

const logger = createRotaLogger('Rotas.Sessao.js');
const router = express.Router();

logger.info('Configurando rotas de sessão...');

// Rotas públicas
router.post('/registrar', controleSessao.registrar);
router.post('/login', controleSessao.login);
router.post('/google/callback', controleSessao.googleAuth);

// Rota protegida
router.post('/logout', controleSessao.logout);

logger.info('Rotas de sessão configuradas.');

export default router;
