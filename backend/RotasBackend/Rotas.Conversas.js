
import express from 'express';
import controleConversas from '../controles/Controle.Conversas.js';

const router = express.Router();

// Rota para obter todas as conversas do usuário autenticado
router.get('/', controleConversas.obterConversas);

export default router;
