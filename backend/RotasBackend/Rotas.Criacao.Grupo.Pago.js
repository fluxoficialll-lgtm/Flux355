import express from 'express';
import ControleCriacaoGrupoPago from '../controles/Controles.Criacao.Grupo.Pago.js';

const router = express.Router();

// @route   POST /api/groups/paid
// @desc    Criar um novo grupo pago (VIP)
// @access  Private
router.post('/', ControleCriacaoGrupoPago.criarGrupoPago);

export default router;