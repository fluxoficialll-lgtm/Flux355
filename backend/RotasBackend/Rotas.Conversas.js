
import express from 'express';
import controleConversas from '../controles/Controle.Conversas.js';
import createRotaLogger from '../config/Log.Rotas.Backend.js';

const logger = createRotaLogger('Rotas.Conversas.js');
const router = express.Router();

logger.info('Configurando rotas de conversas...');

// Rota para obter todas as conversas do usuário autenticado
router.get('/', controleConversas.obterConversas);

logger.info('Rotas de conversas configuradas.');

export default router;
