
import { z } from 'zod';
import { config } from '../ValidaçãoDeAmbiente/config';
import VariaveisFrontend from '../Config/Variaveis.Frontend';
import ClienteBackend from '../Cliente.Backend';
import { createApiLogger } from '../SistemaObservabilidade/Log.API';
import { ENDPOINTS_AUTH } from '../EndPoints/EndPoints.Auth';
import { mockServicoPerfilUsuario } from '../ServiçoDeSimulação/simulacoes/Simulacao.Perfil.Usuario';

// --- Zod Schemas and Types (from Contrato.Servico.Metodo.Google.ts) ---

const UsuarioSchema = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.string().email(),
  bio: z.string().nullable(),
  privado: z.boolean(),
  perfilCompleto: z.boolean(),
  contagemSeguidores: z.number(),
  contagemSeguindo: z.number(),
  seguidores: z.array(z.any()),
  seguindo: z.array(z.any()),
});

const HandleAuthCallbackRequestSchema = z.object({
  code: z.string().min(1, "O código de autorização do Google não pode estar vazio."),
  referredBy: z.string().optional(),
});

const HandleAuthCallbackResponseSchema = z.object({
  token: z.string().min(1, "O token de autenticação é inválido."),
  user: UsuarioSchema.nullable(),
  isNewUser: z.boolean(),
});

type HandleAuthCallbackRequest = z.infer<typeof HandleAuthCallbackRequestSchema>;
export type HandleAuthCallbackResponse = z.infer<typeof HandleAuthCallbackResponseSchema>;
export type UsuarioAutenticado = z.infer<typeof UsuarioSchema>;

// --- Service Interface ---

interface IServicoMetodoGoogle {
    redirectToGoogleAuth(): void;
    handleAuthCallback(code: string, referredBy?: string): Promise<HandleAuthCallbackResponse>;
}

// --- Real Implementation ---

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

class ServicoGoogleAuthReal implements IServicoMetodoGoogle {
    redirectToGoogleAuth(): void {
        console.log("SERVICE: iniciarLoginComGoogle");
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

        const dadosParaBackend: HandleAuthCallbackRequest = HandleAuthCallbackRequestSchema.parse({ code, referredBy });

        try {
            const respostaBackend = await ClienteBackend.post(ENDPOINTS_AUTH.GOOGLE_CALLBACK, dadosParaBackend);
            const dadosValidados = HandleAuthCallbackResponseSchema.parse(respostaBackend.data.dados);

            apiLogger.logSuccess('handleAuthCallback', { response: dadosValidados, traceId });
            return dadosValidados;
        } catch (error) {
            apiLogger.logFailure('handleAuthCallback', error, { code, referredBy, traceId });
            throw error;
        }
    }
}

// --- Simulated Implementation ---

class ServicoGoogleAuthSimulado implements IServicoMetodoGoogle {
    redirectToGoogleAuth(): void {
        console.log("Simulated Google Auth: Redirecionando para a página de login simulada do Google...");
        // In a real simulation, you might redirect to a local page
        // window.location.href = '/simulated-google-login';
    }

    async handleAuthCallback(code: string, referredBy?: string): Promise<HandleAuthCallbackResponse> {
        console.log("Simulated Google Auth: Lidando com o callback de autenticação...", { code, referredBy });
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = await mockServicoPerfilUsuario.getOwnProfile();
        
        const simulatedResponse: HandleAuthCallbackResponse = {
            token: 'simulated-google-jwt-token',
            user: user,
            isNewUser: Math.random() < 0.5,
        };

        console.log("Simulated Google Auth: Autenticação bem-sucedida.");
        return simulatedResponse;
    }
}

// --- Singleton/Factory ---

class ServicoMetodoGoogleSingleton {
    private static instancia: IServicoMetodoGoogle;

    private constructor() { }

    public static getInstancia(): IServicoMetodoGoogle {
        if (!ServicoMetodoGoogleSingleton.instancia) {
            if (config.VITE_APP_ENV === 'simulation') {
                console.log("INFO: [Servico.Metodo.Google] Usando MODO DE SIMULAÇÃO.");
                ServicoMetodoGoogleSingleton.instancia = new ServicoGoogleAuthSimulado();
            } else {
                console.log("INFO: [Servico.Metodo.Google] Usando API REAL.");
                ServicoMetodoGoogleSingleton.instancia = new ServicoGoogleAuthReal();
            }
        }
        return ServicoMetodoGoogleSingleton.instancia;
    }
}

export const getInstancia = () => ServicoMetodoGoogleSingleton.getInstancia();
