import express from 'express';
import ControleCriacaoGrupoPrivado from '../controles/Controles.Criacao.Grupo.Privado.js';

const router = express.Router();

// @route   POST /api/groups/private
// @desc    Criar um novo grupo privado
// @access  Private
router.post('/', ControleCriacaoGrupoPrivado.criarGrupoPrivado);

export default router;