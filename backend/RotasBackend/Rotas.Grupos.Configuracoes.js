
import express from 'express';
import gruposConfiguracoesControle from '../controles/Controles.Grupos.Configuracoes.js';

const router = express.Router();

// Rotas de Configurações Gerais
router.put('/:groupId/settings', gruposConfiguracoesControle.atualizarConfiguracoes);
router.get('/:groupId/stats', gruposConfiguracoesControle.obterEstatisticas);

// Rotas de Diretrizes
router.get('/:groupId/guidelines', gruposConfiguracoesControle.obterDiretrizes);
router.put('/:groupId/guidelines', gruposConfiguracoesControle.atualizarDiretrizes);

// Rotas de Configurações de Notificação
// Corrigido: Usando os métodos genéricos para configurações
router.get('/:groupId/notification-settings', gruposConfiguracoesControle.obterConfiguracoes);
router.put('/:groupId/notification-settings', gruposConfiguracoesControle.atualizarConfiguracoes);

export default router;
