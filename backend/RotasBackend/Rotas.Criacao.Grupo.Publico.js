
import express from 'express';
import ControleCriacaoGrupoPublico from '../controles/Controles.Criacao.Grupo.Publico.js';

const router = express.Router();

// @route   POST /api/groups/public
// @desc    Criar um novo grupo público
// @access  Private
router.post('/', ControleCriacaoGrupoPublico.handle);

export default router;
