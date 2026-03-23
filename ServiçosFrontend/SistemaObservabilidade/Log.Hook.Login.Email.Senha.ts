
/**
 * @file Log.Hook.Login.Email.Senha.ts
 * @description Módulo de logging especializado para o hook `useLoginEmailSenha`.
 * Centraliza todos os logs relacionados ao processo de autenticação via email e senha.
 */

import LogProvider from './Log.Provider';

const CONTEXTO = 'Hook.Login.Email.Senha';

/**
 * @namespace LogLoginEmailSenha
 * @description Agrupa funções de log para o fluxo de login com email e senha.
 */
const LogLoginEmailSenha = {
  /**
   * Registra o início da tentativa de login.
   * @param {string} email - O email utilizado na tentativa de login.
   */
  inicioLogin: (email: string) => {
    LogProvider.info(`Tentativa de login iniciada para o email: ${email}`, { contexto: CONTEXTO, email });
  },

  /**
   * Registra o sucesso do login.
   * @param {string} userId - O ID do usuário que realizou o login.
   * @param {string} email - O email do usuário.
   */
  loginSucesso: (userId: string, email: string) => {
    LogProvider.success('Login com email e senha realizado com sucesso.', {
      contexto: CONTEXTO,
      userId,
      email,
    });
  },

  /**
   * Registra a falha no login.
   * @param {string} email - O email utilizado na tentativa de login.
   * @param {Error} error - O objeto de erro capturado.
   */
  loginFalha: (email: string, error: Error) => {
    LogProvider.error('Falha no login com email e senha.', {
      contexto: CONTEXTO,
      email,
      errorMessage: error.message,
      stack: error.stack,
    });
  },
};

export default LogLoginEmailSenha;
