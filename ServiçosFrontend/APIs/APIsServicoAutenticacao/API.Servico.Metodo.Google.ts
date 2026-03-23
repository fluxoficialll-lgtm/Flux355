
import VariaveisFrontend from '../../Config/Variaveis.Frontend';
import ClienteBackend from '../../Cliente.Backend';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';

/**
 * @file Implementação real da API para autenticação com Google.
 */

/**
 * Redireciona o navegador do usuário para a página de autenticação do Google.
 * A página de consentimento do Google fará o redirecionamento de volta para a URI especificada.
 */
export const redirectToGoogleAuth = (): void => {
    console.log("API Real Google: Redirecionando para autenticação Google...");

    const googleClientId = VariaveisFrontend.googleClientId;

    if (!googleClientId || googleClientId === 'CHAVE_NAO_DEFINIDA') {
        console.error("Client ID do Google não configurado. Abortando autenticação.");
        throw new Error("O login com Google não está configurado.");
    }

    const redirectUri = `${window.location.origin}/auth/google/callback`;

    const params = new URLSearchParams({
        client_id: googleClientId,
        redirect_uri: redirectUri,
        scope: 'openid email profile',
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    window.location.href = authUrl;
};

/**
 * Lida com o callback do Google, enviando o código de autorização para o backend.
 * @param code O código de autorização retornado pelo Google.
 * @param referredBy O código de referência de afiliado (opcional).
 * @returns Uma promessa que resolve com o token JWT, os dados do usuário e um booleano indicando se é um novo usuário.
 */
export const handleAuthCallback = async (code: string, referredBy?: string): Promise<{ token: string; user: Usuario | null, isNewUser?: boolean }> => {
    if (!code) {
        throw new Error('O código de autorização do Google não foi recebido.');
    }
    console.log("API Real Google: Enviando código para o backend...", { code, referredBy });
    const response = await ClienteBackend.post('/auth/google', { code, referredBy });
    return response.data;
};
