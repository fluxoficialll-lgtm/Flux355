
import ClienteBackend from '../Cliente.Backend.js';
import { AxiosResponse } from 'axios';
import { createApiLogger } from '../SistemaObservabilidade/Log.API';
import { ENDPOINTS_AUTH } from '../EndPoints/EndPoints.Auth';
import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';
import { LoginUsuarioDTO as CriarContaDTO } from '../../../types/Entrada/Dto.Estrutura.Usuario';
import { PerfilUsuario } from '../Contratos/Contrato.Perfil.Usuario';

const apiLogger = createApiLogger('UsuarioAPI');

class UsuarioAPI {

    async updateProfile(profileData: Partial<Usuario>): Promise<{ user: Usuario }> {
        apiLogger.logRequest('updateProfile', profileData);
        try {
            const response: AxiosResponse<{ user: Usuario }> = await ClienteBackend.patch(ENDPOINTS_AUTH.PROFILE, profileData);
            apiLogger.logSuccess('updateProfile', response.data);
            return response.data;
        } catch (error) {
            apiLogger.logFailure('updateProfile', error, profileData);
            throw error;
        }
    }

    async criarConta(dados: CriarContaDTO): Promise<{ user: Usuario, token: string }> {
        apiLogger.logRequest('criarConta', dados);
        try {
            const response: AxiosResponse<{ user: Usuario, token: string }> = await ClienteBackend.post(ENDPOINTS_AUTH.REGISTER, dados);
            apiLogger.logSuccess('criarConta', response.data);
            return response.data;
        } catch (error) {
            apiLogger.logFailure('criarConta', error, dados);
            throw error;
        }
    }

    async excluirConta(): Promise<void> {
        apiLogger.logRequest('excluirConta');
        try {
            await ClienteBackend.delete(ENDPOINTS_AUTH.ACCOUNT);
            apiLogger.logSuccess('excluirConta');
        } catch (error) {
            apiLogger.logFailure('excluirConta', error);
            throw error;
        }
    }

    async alterarSenha(dados: {senhaAtual: string, novaSenha: string}): Promise<void> {
        apiLogger.logRequest('alterarSenha');
        try {
            await ClienteBackend.patch(ENDPOINTS_AUTH.CHANGE_PASSWORD, dados);
            apiLogger.logSuccess('alterarSenha');
        } catch (error) {
            apiLogger.logFailure('alterarSenha', error);
            throw error;
        }
    }

    async solicitarRedefinicaoSenha(email: string): Promise<void> {
        apiLogger.logRequest('solicitarRedefinicaoSenha', { email });
        try {
            await ClienteBackend.post(ENDPOINTS_AUTH.FORGOT_PASSWORD, { email });
            apiLogger.logSuccess('solicitarRedefinicaoSenha');
        } catch (error) {
            apiLogger.logFailure('solicitarRedefinicaoSenha', error, { email });
            throw error;
        }
    }

    async redefinirSenha(dados: {token: string, novaSenha: string}): Promise<void> {
        apiLogger.logRequest('redefinirSenha');
        try {
            await ClienteBackend.post(ENDPOINTS_AUTH.RESET_PASSWORD, dados);
            apiLogger.logSuccess('redefinirSenha');
        } catch (error) {
            apiLogger.logFailure('redefinirSenha', error);
            throw error;
        }
    }

    async getOwnProfile(): Promise<PerfilUsuario> {
        apiLogger.logRequest('getOwnProfile');
        try {
            const response = await ClienteBackend.get(ENDPOINTS_AUTH.ME);
            apiLogger.logSuccess('getOwnProfile', response.data);
            return response.data;
        } catch (error) {
            apiLogger.logFailure('getOwnProfile', error);
            throw error;
        }
    }

    async getProfileByUsername(username: string): Promise<PerfilUsuario> {
        apiLogger.logRequest('getProfileByUsername', { username });
        try {
            const response = await ClienteBackend.get(ENDPOINTS_AUTH.USER_BY_USERNAME(username));
            apiLogger.logSuccess('getProfileByUsername', response.data);
            return response.data;
        } catch (error) {
            apiLogger.logFailure('getProfileByUsername', error, { username });
            throw error;
        }
    }
}

export default new UsuarioAPI();
