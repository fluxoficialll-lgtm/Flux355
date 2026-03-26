
import ClienteBackend from '../Cliente.Backend.js';
import {
    IAutenticacaoServico,
    LoginRequest,
    LoginResponse,
    LoginRequestSchema, 
    GoogleLoginRequest,
    GoogleLoginResponse,
    GoogleLoginResponseSchema,
} from '../Contratos/Contrato.Autenticacao';
import { AxiosResponse } from 'axios';
import { createApiLogger } from '../SistemaObservabilidade/Log.API';

// Cria um logger específico para este serviço de API.
const apiLogger = createApiLogger('AutenticacaoSupremo');

/**
 * @file Implementação concreta do serviço de autenticação que interage com o backend real.
 * Esta classe é responsável por fazer as chamadas HTTP, validando os dados de entrada
 * contra o contrato antes de enviá-los.
 */
class AutenticacaoAPISupremo implements IAutenticacaoServico {
    
    /**
     * Realiza o login do usuário.
     * @param data - Os dados de login (email e senha).
     * @returns Uma promessa que resolve para a resposta de login da API.
     * @throws {ZodError} Se a validação dos dados de entrada falhar.
     */
    async login(data: LoginRequest): Promise<LoginResponse> {
        apiLogger.logRequest('login', { email: data.email }); // Log do início da requisição
        try {
            const dadosValidados = LoginRequestSchema.parse(data);
            
            const resposta: AxiosResponse<LoginResponse> = await ClienteBackend.post('/auth/login', dadosValidados);

            apiLogger.logSuccess('login', resposta.data); // Log de sucesso

            return resposta.data;
        } catch (error) {
            apiLogger.logFailure('login', error, { email: data.email }); // Log de falha
            throw error;
        }
    }

    /**
     * Realiza o login ou criação de conta via Google.
     * @param data - O token de credencial do Google.
     * @returns Uma promessa que resolve para a resposta da API, contendo dados do usuário e token.
     */
    async resolverSessaoLogin(data: GoogleLoginRequest): Promise<GoogleLoginResponse> {
        apiLogger.logRequest('resolverSessaoLogin', { token: '[TOKEN OMITIDO]' }); // Log do início
        try {
            const resposta: AxiosResponse<GoogleLoginResponse> = await ClienteBackend.post('/auth/google/callback', data);
            const dadosValidados = GoogleLoginResponseSchema.parse(resposta.data);
            
            apiLogger.logSuccess('resolverSessaoLogin', dadosValidados); // Log de sucesso
            
            return dadosValidados;
        } catch (error) {
            apiLogger.logFailure('resolverSessaoLogin', error); // Log de falha
            throw error;
        }
    }
}

// Exportamos uma instância única da classe para ser usada em toda a aplicação.
export default new AutenticacaoAPISupremo();
