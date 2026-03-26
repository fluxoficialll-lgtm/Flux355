import VariaveisFrontend from '../../Config/Variaveis.Frontend';
import ClienteBackend from '../../Cliente.Backend';
import {
    HandleAuthCallbackRequest, HandleAuthCallbackRequestSchema,
    HandleAuthCallbackResponse, HandleAuthCallbackResponseSchema,
    IServicoMetodoGoogle
} from '../../Contratos/Contrato.Servico.Metodo.Google';
import { createApiLogger } from '../../SistemaObservabilidade/Log.API';

/**
 * @file Implementação da API para autenticação com Google, utilizando contratos e observabilidade.
 */

const apiLogger = createApiLogger('ServicoMetodoGoogle');

const criarTraceIdAuth = (): string => {
    const traceId = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('authTraceId', traceId);
    return traceId;
};

const obterTraceIdAuth = (): string | undefined => {
    const traceId = sessionStorage.getItem('authTraceId');
    sessionStorage.removeItem('authTraceId');
    return traceId || undefined;
}

class ServicoMetodoGoogle implements IServicoMetodoGoogle {

    redirectToGoogleAuth(): void {
        const traceId = criarTraceIdAuth();
        apiLogger.logRequest('redirectToGoogleAuth', { traceId });

        const googleClientId = VariaveisFrontend.googleClientId;

        if (!googleClientId || googleClientId === 'CHAVE_NAO_DEFINIDA') {
            const error = new Error("O login com Google não está configurado: Client ID não definido.");
            apiLogger.logFailure('redirectToGoogleAuth', error, { traceId });
            throw error;
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
        
        apiLogger.logSuccess('redirectToGoogleAuth', { authUrl });
        window.location.href = authUrl;
    }

    async handleAuthCallback(code: string, referredBy?: string): Promise<HandleAuthCallbackResponse> {
        const traceId = obterTraceIdAuth();
        apiLogger.logRequest('handleAuthCallback', { code, referredBy, traceId });

        // 1. Validar os dados de entrada com o schema
        const dadosParaBackend: HandleAuthCallbackRequest = HandleAuthCallbackRequestSchema.parse({ code, referredBy });

        try {
            const respostaBackend = await ClienteBackend.post('/auth/google', dadosParaBackend);
            
            // 2. Validar a resposta do backend com o schema
            const dadosValidados = HandleAuthCallbackResponseSchema.parse(respostaBackend.data);

            apiLogger.logSuccess('handleAuthCallback', { response: dadosValidados, traceId });

            return dadosValidados;
        } catch (error) {
            apiLogger.logFailure('handleAuthCallback', error, { code, referredBy, traceId });
            
            throw error;
        }
    }
}

export default new ServicoMetodoGoogle();
