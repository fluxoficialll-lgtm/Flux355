/**
 * @file Log.Requisicoes.API.js
 * @description Módulo especializado para logging de requisições HTTP (API).
 */

import LogProvider from './Log.Provider.js';

/**
 * Loga uma requisição de entrada.
 * @param {object} req - O objeto de requisição do Express.
 * @param {string} traceId - O ID de rastreamento da requisição.
 */
const logRequest = (req, traceId) => {
  const { method, path, ip, headers } = req;

  const requestData = {
    method,
    path,
    ip,
    clientId: headers['x-client-id'] || undefined, // Exemplo de header customizado
  };

  LogProvider.info('API-Middleware', 'INBOUND_REQUEST', requestData, traceId);
};

/**
 * Loga uma resposta de saída.
 * @param {object} res - O objeto de resposta do Express.
 * @param {number} durationMs - A duração da requisição em milissegundos.
 * @param {string} traceId - O ID de rastreamento da requisição.
 */
const logResponse = (res, durationMs, traceId) => {
  const { req, statusCode } = res;
  const { method, path } = req;

  const responseData = {
    method,
    path,
    statusCode,
    duration_ms: durationMs,
  };

  const level = statusCode >= 400 ? 'WARN' : 'INFO'; // Avisos para erros do cliente/servidor

  if (level === 'WARN') {
    LogProvider.warn('API-Middleware', 'OUTBOUND_RESPONSE', responseData, traceId);
  } else {
    LogProvider.info('API-Middleware', 'OUTBOUND_RESPONSE', responseData, traceId);
  }
};

export default {
  inbound: logRequest,
  outbound: logResponse,
};
