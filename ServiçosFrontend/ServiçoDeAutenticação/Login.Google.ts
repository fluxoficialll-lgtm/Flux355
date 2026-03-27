
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
    authUrl.searchParams.append('client_id', googleClientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');

    window.location.href = authUrl.toString();
  }

  /**
   * Processa o código de autorização retornado pelo Google após o consentimento do usuário.
   * @param codigo - O código de autorização vindo da URL de callback.
   * @returns Uma promessa que resolve com os dados padronizados do usuário.
   */
  public async processarCallback(codigo: string): Promise<IUsuarioSocial> {
    const operation = 'processarCallback';
    logger.logOperationStart(operation, { codigo });
    
    const usuarioSimulado: IUsuarioSocial = {
      id: `google_${new Date().getTime()}`,
      nome: "Usuário Simulado do Google",
      email: "usuario.google.simulado@example.com",
      tokenProvider: codigo,
    };

    logger.logOperationSuccess(operation, { usuario: usuarioSimulado });
    return Promise.resolve(usuarioSimulado);
  }
}

export const loginGoogle = new LoginGoogle();
