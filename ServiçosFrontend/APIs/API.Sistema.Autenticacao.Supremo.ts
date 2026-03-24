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
import { LogSupremo } from '../SistemaObservabilidade/Log.Supremo';

/**
 * @file Implementação concreta do serviço de autenticação que interage com o backend real.
 * Esta classe é responsável por fazer as chamadas HTTP, validando os dados de entrada
 * contra o contrato antes de enviá-los.
 */
class AutenticacaoAPISupremo implements IAutenticacaoServico {
    
    /**
     * Realiza o login do usuário.
     * 1. Valida os dados de entrada usando o schema Zod.
     * 2. Envia a requisição para o backend se os dados forem válidos.
     * 
     * @param data - Os dados de login (email e senha).
     * @returns Uma promessa que resolve para a resposta de login da API.
     * @throws {ZodError} Se a validação dos dados de entrada falhar.
     */
    async login(data: LoginRequest): Promise<LoginResponse> {
        LogSupremo.API.Autenticacao.inicioLogin(data.email);
        try {
            // 1. Validar os dados de entrada ANTES de fazer a chamada de rede.
            // O .parse() joga um erro se os dados não corresponderem ao schema.
            const dadosValidados = LoginRequestSchema.parse(data);
            
            // 2. Enviar a requisição para o backend com os dados já validados.
            const resposta: AxiosResponse<LoginResponse> = await ClienteBackend.post('/auth/login', dadosValidados);

            LogSupremo.API.Autenticacao.sucessoLogin(data.email, resposta.data);

            // Retorna apenas os dados da resposta, conforme o contrato.
            return resposta.data;
        } catch (error) {
            LogSupremo.API.Autenticacao.falhaLogin(data.email, error);
            throw error;
        }
    }

    async resolverSessaoLogin(data: GoogleLoginRequest): Promise<GoogleLoginResponse> {
        LogSupremo.API.Autenticacao.inicioLoginGoogle(data.token);
        try {
            const resposta: AxiosResponse<GoogleLoginResponse> = await ClienteBackend.post('/auth/google/callback', data);
            const dadosValidados = GoogleLoginResponseSchema.parse(resposta.data);
            LogSupremo.API.Autenticacao.sucessoLoginGoogle(dadosValidados);
            return dadosValidados;
        } catch (error) {
            LogSupremo.API.Autenticacao.falhaLoginGoogle(error);
            throw error;
        }
    }
}

// Exportamos uma instância única da classe para ser usada em toda a aplicação.
export default new AutenticacaoAPISupremo();
