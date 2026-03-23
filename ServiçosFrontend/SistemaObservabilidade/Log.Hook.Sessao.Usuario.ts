
/**
 * @file Log.Hook.Sessao.Usuario.ts
 * @description Módulo de logging especializado para o hook `useUsuarioSessao`.
 * Centraliza todos os logs relacionados ao ciclo de vida da sessão do usuário, 
 * desde a verificação inicial até o estabelecimento ou falha da sessão.
 */

import LogProvider from './Log.Provider';

const CONTEXTO = 'Hook.Usuario.Sessao';

/**
 * @namespace LogSessaoUsuario
 * @description Agrupa funções de log para o gerenciamento da sessão do usuário.
 */
const LogSessaoUsuario = {
  /**
   * Registra o início da verificação da sessão do usuário.
   */
  inicioVerificacao: () => {
    LogProvider.info('Verificando sessão do usuário...', { contexto: CONTEXTO });
  },

  /**
   * Registra o sucesso no estabelecimento da sessão de um usuário autenticado.
   * @param {object} dadosUsuario - Dados do usuário para enriquecer o log.
   * @param {string} dadosUsuario.id - O ID do usuário.
   * @param {string} dadosUsuario.nome_usuario - O nome de usuário.
   * @param {string} dadosUsuario.email - O email do usuário.
   */
  sessaoEstabelecida: (dadosUsuario: { id: string; nome_usuario: string; email: string; }) => {
    LogProvider.success('Sessão do usuário estabelecida com sucesso.', {
      contexto: CONTEXTO,
      ...dadosUsuario,
    });
  },

  /**
   * Registra que a sessão é anônima (nenhum usuário logado).
   */
  sessaoAnonima: () => {
    LogProvider.warn('Nenhuma sessão de usuário encontrada (sessão anônima).', { contexto: CONTEXTO });
  },

  /**
   * Registra um erro ocorrido durante o carregamento da sessão.
   * @param {Error} error - O objeto de erro capturado.
   */
  erroAoCarregar: (error: Error) => {
    LogProvider.error('Erro ao carregar a sessão do usuário.', {
      contexto: CONTEXTO,
      errorMessage: error.message,
      stack: error.stack,
    });
  },
};

export default LogSessaoUsuario;
