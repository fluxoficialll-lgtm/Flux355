
/**
 * @file Log.Supremo.ts
 * @description Agregador central e ponto de entrada único para todos os serviços de observabilidade da aplicação.
 * Ele re-exporta módulos especializados para cada aspecto do logging, desde performance até segurança,
 * garantindo uma abordagem modular, organizada e ultra-precisa.
 */

// Módulos Fundamentais
import LogProvider from './Log.Provider';
import LogRequisicoesAPI from './Log.Requisicoes.API';
import { rastreadorDeEventos } from './Rastreador.Eventos.js';

// Módulos Especializados
import AuditoriaDB from './Auditoria.DB';
import LogErros from './Log.Erros';
import LogPerformance from './Log.Performance';
import LogEventosNegocio from './Log.Eventos.Negocio';
import LogSeguranca from './Log.Seguranca';
import LogIntegracoes from './Log.Integracoes';
import LogCache from './Log.Cache';
import Alertas from './Log.Alertas';
import SnapshotEstado from './Log.Snapshot.Estado';
import LogHook from './Log.Hook';
import LogSessaoUsuario from './Log.Hook.Sessao.Usuario';
import LogLoginEmailSenha from './Log.Hook.Login.Email.Senha';
import LogLoginGoogle from './Log.Hook.Login.Google'; // Importa o novo logger

/**
 * @object LogSupremo
 * @description Objeto consolidado que expõe todas as funcionalidades do sistema de observabilidade.
 * Cada propriedade é um módulo especializado, permitindo um logging focado e contextual.
 */
export const LogSupremo = {
  /** Log geral, estruturado e com níveis (info, erro, debug, etc.). */
  Log: LogProvider,
  
  /** Monitoramento detalhado de todas as requisições e respostas de APIs externas. */
  API: LogRequisicoesAPI,

  /** Rastreamento de eventos de interação do usuário na interface (cliques, etc.). */
  Rastreamento: rastreadorDeEventos,

  /** Registro de exceções, com stack traces e contexto completo. */
  Erros: LogErros,

  /** Medição de performance de operações críticas. */
  Performance: LogPerformance,

  /** Trilha de auditoria para operações sensíveis no banco de dados. */
  Auditoria: AuditoriaDB,

  /** Registro de eventos chave da jornada do usuário (login, compra, etc.). */
  Negocio: LogEventosNegocio,

  /** Monitoramento de atividades suspeitas (tentativas de login, etc.). */
  Seguranca: LogSeguranca,

  /** Logs de comunicação com serviços de terceiros. */
  Integracoes: LogIntegracoes,

  /** Monitoramento de acertos e falhas do cache. */
  Cache: LogCache,

  /** Sistema para disparar alertas críticos (ex: para Slack, PagerDuty). */
  Alertas: Alertas,

  /** Captura de snapshots do estado da aplicação em momentos chave. */
  Snapshot: SnapshotEstado,

  /** Módulo de logging para hooks da UI. */
  Hook: {
    ...LogHook, // Mantém os logs genéricos de hook
    Sessao: LogSessaoUsuario,
    LoginEmailSenha: LogLoginEmailSenha,
    LoginGoogle: LogLoginGoogle, // Adiciona o logger específico para login com Google
  },
};
