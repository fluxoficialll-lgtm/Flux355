
/**
 * @file Log.Hook.Login.Google.ts
 * @description Módulo de logging especializado para o hook `useLoginGoogle`.
 * Centraliza todos os logs relacionados ao processo de autenticação via Google.
 */

import LogProvider from './Log.Provider';

const CONTEXTO = 'Hook.Login.Google';

/**
 * @namespace LogLoginGoogle
 * @description Agrupa funções de log para o fluxo de login com Google.
 */
const LogLoginGoogle = {
  /**
   * Registra o início do fluxo de autenticação com Google.
   */
  inicioFluxo: () => {
    LogProvider.info('Início do fluxo de autenticação com Google.', { contexto: CONTEXTO });
  },

  /**
   * Registra o recebimento do callback do Google após a autenticação.
   * @param {string} code - O código de autorização recebido.
   */
  callbackRecebido: (code: string) => {
    LogProvider.info('Callback do Google recebido com sucesso.', { contexto: CONTEXTO, code });
  },

  /**
   * Registra o sucesso do login via Google.
   * @param {string} userId - O ID do usuário que realizou o login.
   * @param {boolean} isNewUser - Indica se é um novo usuário.
   */
  loginSucesso: (userId: string, isNewUser: boolean) => {
    LogProvider.success('Login com Google realizado com sucesso.', {
      contexto: CONTEXTO,
      userId,
      novoUsuario: isNewUser,
    });
  },

  /**
   * Registra a falha no processo de login via Google.
   * @param {Error} error - O objeto de erro capturado.
   * @param {string} [stage='desconhecido'] - O estágio em que a falha ocorreu (ex: 'callback', 'redirect').
   */
  loginFalha: (error: Error, stage: string = 'desconhecido') => {
    LogProvider.error('Falha no processo de login com Google.', {
      contexto: CONTEXTO,
      estagio: stage,
      errorMessage: error.message,
      stack: error.stack,
    });
  },
};

export default LogLoginGoogle;
