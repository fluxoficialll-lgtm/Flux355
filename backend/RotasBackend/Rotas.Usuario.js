
// backend/RotasBackend/Rotas.Usuario.js

import express from 'express';
import controleUsuario from '../controles/Controle.Usuario.js';
import createRotaLogger from '../config/Log.Rotas.Backend.js';

const logger = createRotaLogger('Rotas.Usuario.js');
const router = express.Router();

logger.info('Configurando rotas de usuário...');

// Rota pública para obter o perfil de um usuário
router.get('/:id', controleUsuario.obterPerfil);

// Rota protegida para atualizar o próprio perfil
router.put('/perfil', controleUsuario.atualizarPerfil);

logger.info('Rotas de usuário configuradas.');

export default router;
