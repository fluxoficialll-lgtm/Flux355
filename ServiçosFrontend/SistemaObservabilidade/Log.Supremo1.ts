/**
 * @file Log.Supremo.ts
 * @description Agregador central para todos os serviços de observabilidade e registro de logs.
 *
 * Este arquivo serve como um ponto de entrada único para o sistema de observabilidade,
 * importando e re-exportando todos os serviços relacionados, como rastreamento de eventos,
 * auditoria e logging geral. A centralização facilita a manutenção e o uso consistente
 * das ferramentas de observabilidade em toda a aplicação.
 */

import { rastreadorDeEventos } from './Rastreador.Eventos.js';
import  ServicoLog  from './ServicoDeLog.js';

/**
 * @object LogSupremo
 * @description Objeto consolidado que expõe todas as funcionalidades do sistema de observabilidade.
 *
 * @property {object} Rastreamento - Módulo de rastreamento de eventos do usuário.
 * @property {object} Auditoria - Módulo de auditoria para ações críticas.
 * @property {object} Log - Módulo de logging geral da aplicação.
 */
export const LogSupremo = {
  Rastreamento: rastreadorDeEventos,
  Auditoria: {},
  Log: ServicoLog,
};
