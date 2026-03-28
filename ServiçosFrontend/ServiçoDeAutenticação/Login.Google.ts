
import VariaveisFrontend from '../Config/Variaveis.Frontend.js';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';

// Interface para o retorno padronizado dos dados do usuário de um provedor social.
export interface IUsuarioSocial {
  id: string;
  nome: string;
  email: string;
  tokenProvider: string; // Token específico do provedor (Google, Apple, etc.)
}

const logger = createServiceLogger('LoginGoogle');

/**
 * Login.Google.ts
 * Módulo isolado e dedicado para tratar o fluxo de autenticação com o Google.
 */
class LoginGoogle {

  constructor() {
    logger.logInfo("Módulo inicializado.");
  }

  /**
   * Inicia o fluxo de autenticação, construindo a URL correta e redirecionando o usuário para o Google.
   */
  public iniciarLogin(): void {
    const operation = 'iniciarLogin';
    logger.logOperationStart(operation);
    const googleClientId = VariaveisFrontend.googleClientId;

    if (!googleClientId || googleClientId === 'CHAVE_NAO_DEFINIDA') {
      const error = new Error("A 'googleClientId' não está configurada. Verifique o arquivo .env e a variável VITE_GOOGLE_CLIENT_ID.");
      logger.logOperationError(operation, error);
      alert("A autenticação com Google não está configurada corretamente.");
      return;
    }

    logger.logInfo("Redirecionando para a tela de login do Google...");

    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const scope = 'openid profile email';
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    const nonce = Math.random().toString(36).substring(2, 15);

    authUrl.searchParams.append('client_id', googleClientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('response_type', 'id_token');
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('nonce', nonce);

    window.location.href = authUrl.toString();
  }

  /**
   * Processa o token de ID retornado pelo Google após o consentimento do usuário.
   * @param idToken - O token de ID vindo do fragmento da URL de callback.
   * @returns Uma promessa que resolve com os dados padronizados do usuário.
   */
  public async processarCallback(idToken: string): Promise<IUsuarioSocial> {
    const operation = 'processarCallback';
    logger.logOperationStart(operation, { idToken: idToken.substring(0, 10) + '...' }); // Log truncated token
    
    // ATENÇÃO: Esta é uma implementação simulada.
    // Em um ambiente de produção, você deve validar o idToken no backend
    // e então usar as informações decodificadas do token.
    const usuarioSimulado: IUsuarioSocial = {
      id: `google_${new Date().getTime()}`,
      nome: "Usuário Simulado do Google",
      email: "usuario.google.simulado@example.com",
      tokenProvider: idToken, // Em um caso real, você poderia não querer expor o token inteiro aqui.
    };

    logger.logOperationSuccess(operation, { usuario: usuarioSimulado });
    return Promise.resolve(usuarioSimulado);
  }
}

export const loginGoogle = new LoginGoogle();
