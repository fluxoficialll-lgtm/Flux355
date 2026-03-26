
/**
 * @file Log.Supremo.ts
 * @description Agregador central e ponto de entrada único para todos os serviços de observabilidade da aplicação.
 * Ele re-exporta módulos especializados para cada aspecto do logging, garantindo uma abordagem modular e organizada.
 */

// Módulos Fundamentais
import LogProvider from './Sistema.Mensageiro.Cliente.Backend.ts';
import { rastreadorDeEventos } from './Rastreador.Eventos.js';
import { createApiLogger } from './Log.API.ts';
import * as LogHook from './Log.Hook.ts';

/**
 * @object LogSupremo
 * @description Objeto consolidado que expõe todas as funcionalidades do sistema de observabilidade.
 * Cada propriedade é um módulo especializado, permitindo um logging focado e contextual.
 */
export const LogSupremo = {
  /** Log geral, estruturado e com níveis (info, erro, debug, etc.). */
  Log: LogProvider,
  
  /** Monitoramento detalhado de todas as requisições e respostas de APIs externas. */
  API: {
    Autenticacao: createApiLogger('AutenticacaoSupremo'),
  },

  /** Rastreamento de eventos de interação do usuário na interface (cliques, etc.). */
  Rastreamento: rastreadorDeEventos,

  /** Módulo de logging para hooks da UI. */
  Hook: {
    ...LogHook,
  },
};
