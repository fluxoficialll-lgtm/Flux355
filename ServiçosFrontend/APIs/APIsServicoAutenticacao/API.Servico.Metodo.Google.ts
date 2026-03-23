
import VariaveisFrontend from '../../Config/Variaveis.Frontend';
import ClienteBackend from '../../Cliente.Backend';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import { LogSupremo } from '../../SistemaObservabilidade/Log.Supremo';

/**
 * @file Implementação real da API para autenticação com Google.
 */

/**
 * Redireciona o navegador do usuário para a página de autenticação do Google.
 */
export const redirectToGoogleAuth = (): void => {
    LogSupremo.Depuracao.log("API Real Google: Redirecionando para autenticação Google...");

    const googleClientId = VariaveisFrontend.googleClientId;

    if (!googleClientId || googleClientId === 'CHAVE_NAO_DEFINIDA') {
        LogSupremo.Depuracao.error("Client ID do Google não configurado. Abortando autenticação.");
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
 */
export const handleAuthCallback = async (code: string, referredBy?: string): Promise<{ token: string; user: Usuario | null, isNewUser?: boolean }> => {
    if (!code) {
        LogSupremo.Depuracao.error("handleAuthCallback falhou: código de autorização do Google não recebido.");
        throw new Error('O código de autorização do Google não foi recebido.');
    }

    LogSupremo.Depuracao.log("API Real Google: Enviando código para o backend...", { code, referredBy });

    try {
        const response = await ClienteBackend.post('/auth/google', { code, referredBy });
        LogSupremo.Depuracao.log("Resposta recebida do backend:", response.data);
        return response.data;
    } catch (error) {
        LogSupremo.Depuracao.error("Erro ao enviar código para o backend:", error);
        throw error;
    }
};
