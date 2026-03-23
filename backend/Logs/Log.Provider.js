/**
 * @file Log.Provider.js
 * @description Motor principal do sistema de logging do backend. Responsável por
 * formatar e emitir os logs para a saída padrão (console) em formato JSON.
 */

import { VariaveisBackend } from '../config/Variaveis.Backend.js';

const { NODE_ENV } = VariaveisBackend;

/**
 * Formata e emite um log para o console.
 * @param {string} level - O nível do log (ex: 'INFO', 'ERROR').
 * @param {string} scope - O escopo/módulo onde o log foi originado.
 * @param {string} event - O nome do evento ou da mensagem de log.
 * @param {object | null} data - Dados adicionais para incluir no log.
 * @param {string | null} traceId - O ID de rastreamento da requisição.
 */
function log(level, scope, event, data, traceId) {
  // Não logar em ambiente de teste para manter a saída limpa
  if (NODE_ENV === 'test') {
    return;
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    scope,
    event,
    data: data || {},
    traceId: traceId || 'N/A',
    ambiente: NODE_ENV || 'development',
  };

  // Usa console.error para erros, console.warn para avisos, e console.log para os demais
  switch (level) {
    case 'ERROR':
      console.error(JSON.stringify(logEntry, null, 2));
      break;
    case 'WARN':
      console.warn(JSON.stringify(logEntry, null, 2));
      break;
    default:
      console.log(JSON.stringify(logEntry, null, 2));
  }
}

// Funções exportadas para cada nível de log

const info = (scope, event, data, traceId) => log('INFO', scope, event, data, traceId);
const warn = (scope, event, data, traceId) => log('WARN', scope, event, data, traceId);
const erro = (scope, event, data, traceId) => log('ERROR', scope, event, data, traceId);
const debug = (scope, event, data, traceId) => {
  // Logs de debug só devem aparecer em ambiente de desenvolvimento
  if (NODE_ENV === 'development') {
    log('DEBUG', scope, event, data, traceId);
  }
};

export default { info, warn, erro, debug };
