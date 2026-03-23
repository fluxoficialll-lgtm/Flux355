/**
 * @file Middleware.Logs.js
 * @description Middleware do Express para logar todas as requisições HTTP de entrada e saída,
 * utilizando o novo sistema de log estruturado.
 */

import { nanoid } from 'nanoid';
import Log from './BK.Log.Supremo.js'; // Importação centralizada

/**
 * Middleware que adiciona um ID de rastreamento (traceId) a cada requisição
 * e loga o início e o fim de cada ciclo de requisição/resposta.
 */
function logMiddleware(req, res, next) {
  // 1. Gera um ID único para rastrear a requisição do início ao fim.
  const traceId = nanoid();
  req.traceId = traceId; // Anexa ao objeto `req` para uso em outros lugares.

  // 2. Registra o momento de início da requisição.
  const startTime = process.hrtime();

  // 3. Loga a requisição de entrada usando o Log Supremo.
  Log.Requisicoes.inbound(req, traceId);

  // 4. Adiciona um listener para quando a resposta for finalizada.
  res.on('finish', () => {
    // Calcula a duração da requisição em milissegundos.
    const diff = process.hrtime(startTime);
    const durationMs = Math.round(diff[0] * 1e3 + diff[1] * 1e-6);

    // Loga a resposta de saída usando o Log Supremo.
    Log.Requisicoes.outbound(res, durationMs, traceId);
  });

  // 5. Passa para o próximo middleware na cadeia.
  next();
}

export default logMiddleware;
