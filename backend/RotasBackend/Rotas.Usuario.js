
// backend/RotasBackend/Rotas.Usuario.js

import express from 'express';
import controleUsuario from '../controles/Controle.Usuario.js';

const router = express.Router();

// Rota pública para obter o perfil de um usuário
router.get('/:id', controleUsuario.obterPerfil);

// Rota protegida para atualizar o próprio perfil
router.put('/perfil', controleUsuario.atualizarPerfil);

export default router;
