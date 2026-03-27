
import VariaveisFrontend from '../Config/Variaveis.Frontend.js';

// Interface para o retorno padronizado dos dados do usuário de um provedor social.
export interface IUsuarioSocial {
  id: string;
  nome: string;
  email: string;
  tokenProvider: string; // Token específico do provedor (Google, Apple, etc.)
}

/**
 * Login.Google.ts
 * Módulo isolado e dedicado para tratar o fluxo de autenticação com o Google.
 */
class LoginGoogle {

  constructor() {
    console.log("Módulo Login.Google.ts inicializado.");
  }

  /**
   * Inicia o fluxo de autenticação, construindo a URL correta e redirecionando o usuário para o Google.
   */
  public iniciarLogin(): void {
    const googleClientId = VariaveisFrontend.googleClientId;

    if (!googleClientId || googleClientId === 'CHAVE_NAO_DEFINIDA') {
      console.error("Google Login: A 'googleClientId' não está configurada. Verifique o arquivo .env e a variável VITE_GOOGLE_CLIENT_ID.");
      alert("A autenticação com Google não está configurada corretamente.");
      return;
    }

    console.log("Google Login: Redirecionando para a tela de login do Google...");

    // A URI de redirecionamento que deve estar cadastrada no seu painel do Google Cloud.
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    
    const scope = 'openid profile email';

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', googleClientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');

    // Executa o redirecionamento para a página de login do Google.
    window.location.href = authUrl.toString();
  }

  /**
   * Processa o código de autorização retornado pelo Google após o consentimento do usuário.
   * @param codigo - O código de autorização vindo da URL de callback.
   * @returns Uma promessa que resolve com os dados padronizados do usuário.
   */
  public async processarCallback(codigo: string): Promise<IUsuarioSocial> {
    console.log(`Google Login: Processando código de callback recebido: ${codigo}`);
    
    // Em um cenário real, você faria uma chamada ao seu backend aqui,
    // enviando o 'codigo' para que o backend o troque por um token de acesso junto ao Google.
    // Por enquanto, a simulação permanece para não quebrar outras partes do fluxo.
    const usuarioSimulado: IUsuarioSocial = {
      id: `google_${new Date().getTime()}`,
      nome: "Usuário Simulado do Google",
      email: "usuario.google.simulado@example.com",
      tokenProvider: codigo, // Usando o código como token simulado
    };

    console.log("Google Login: Dados do usuário simulado foram gerados.");
    return Promise.resolve(usuarioSimulado);
  }
}

// Exportamos uma instância única (singleton) da classe.
export const loginGoogle = new LoginGoogle();
