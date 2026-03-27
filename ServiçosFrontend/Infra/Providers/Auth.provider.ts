
import { servicoAutenticacao, AuthState } from '../../ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { getInstancia as getGoogleLoginInstancia } from '../../ServiçoDeAutenticação/Login.Google';
import { ILoginEmailParams } from '../../Contratos/Contrato.Autenticacao';

// Re-exporta os tipos para que a camada de aplicação não precise conhecer os serviços subjacentes.
export type { AuthState, ILoginEmailParams };

const ServicoMetodoGoogle = getGoogleLoginInstancia();

/**
 * AuthProvider fornece uma interface completa e reativa para as operações de autenticação.
 * Ele abstrai a origem dos dados e os métodos de autenticação, expondo um contrato claro para a camada de aplicação.
 * Fluxo: Hook -> Application Layer -> Provider -> Serviço API
 */
export const AuthProvider = {
  /**
   * Tenta autenticar um usuário com email e senha.
   */
  loginComEmail: (params: ILoginEmailParams) => {
    return servicoAutenticacao.login(params);
  },

  /**
   * Finaliza o processo de login usando um token de sessão (vindo do callback do Google).
   */
  finalizarLoginComToken: (token: string) => {
    return servicoAutenticacao.finalizarLoginComToken(token);
  },

  /**
   * Inicia o fluxo de autenticação com o Google (redirecionamento).
   */
  iniciarLoginComGoogle: () => {
    console.log("PROVIDER: iniciarLoginComGoogle");
    ServicoMetodoGoogle.redirectToGoogleAuth();
  },

  /**
   * Processa o código de callback do Google para obter a sessão.
   */
  processarCallbackGoogle: (code: string) => {
    return ServicoMetodoGoogle.handleAuthCallback(code);
  },

  /**
   * Realiza o logout do usuário.
   */
  logout: () => {
    return servicoAutenticacao.logout();
  },

  /**
   * Permite que a camada de aplicação se inscreva a mudanças no estado de autenticação.
   */
  subscribe: (listener: (state: AuthState) => void) => {
    return servicoAutenticacao.subscribe(listener);
  },

  /**
   * Obtém o estado de autenticação atual.
   */
  getState: (): AuthState => {
    return servicoAutenticacao.getState();
  }
};
