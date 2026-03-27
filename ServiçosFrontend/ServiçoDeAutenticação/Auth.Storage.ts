
import { IUsuario } from './Processo.Login';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

const logger = createServiceLogger('AuthStorage');

/**
 * @file Auth.Storage.ts
 * @description Módulo para gerenciar o armazenamento e a recuperação
 * de dados de sessão (token e usuário) no localStorage.
 */
export const AuthStorage = {
  /**
   * Salva o token de autenticação e os dados do usuário no localStorage.
   * @param token O token JWT.
   * @param usuario O objeto do usuário.
   */
  salvarSessao(token: string, usuario: IUsuario): void {
    const operation = 'salvarSessao';
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(usuario));
      logger.logInfo("Sessão salva no localStorage.", { token, usuario });
    } catch (error) {
      logger.logOperationError(operation, error, { token, usuario });
    }
  },

  /**
   * Carrega o token e os dados do usuário a partir do localStorage.
   * @returns Um objeto com token e usuário, ou null se não houver dados.
   */
  carregarSessao(): { token: string; usuario: IUsuario } | null {
    const operation = 'carregarSessao';
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const usuarioString = localStorage.getItem(AUTH_USER_KEY);

      if (token && usuarioString) {
        const usuario: IUsuario = JSON.parse(usuarioString);
        logger.logInfo("Sessão carregada do localStorage.", { token, usuario });
        return { token, usuario };
      }

      logger.logInfo("Nenhuma sessão encontrada no localStorage.");
      return null;
    } catch (error) {
      logger.logOperationError(operation, error);
      // Limpa dados potencialmente corrompidos
      this.limparSessao();
      return null;
    }
  },

  /**
   * Remove o token e os dados do usuário do localStorage.
   */
  limparSessao(): void {
    const operation = 'limparSessao';
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      logger.logInfo("Sessão removida do localStorage.");
    } catch (error) {
      logger.logOperationError(operation, error);
    }
  }
};
