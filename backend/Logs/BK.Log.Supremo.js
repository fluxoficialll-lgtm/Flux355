/**
 * BK.Log.Supremo.js
 * 
 * Módulo central de logs. Agrega e re-exporta todas as funcionalidades de log
 * da aplicação para garantir um ponto de entrada único e consistente.
 */

// Importa e re-exporta as funcionalidades principais de logging (criação de logger, logger de sistema)
export * from './Log.Core.js';

// Importa e re-exporta as funcionalidades de auditoria de endpoints
export * from './Log.Auditoria.EndPoint.js';

console.log('Módulo Supremo de Log (BK.Log.Supremo.js) carregado. Todos os submódulos de log foram agregados.');
