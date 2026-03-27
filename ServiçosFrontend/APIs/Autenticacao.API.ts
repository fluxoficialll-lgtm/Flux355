
import clienteBackend from '../Cliente.Backend.js';
import { ILoginEmailParams } from '../Contratos/Contrato.Autenticacao';
import { IRegistroParams } from '../ServiçoDeAutenticação/Processo.Registrar';
import { IPerfilParaCompletar } from '../ServiçoDeAutenticação/Processo.Completar.Perfil';
import { createApiLogger } from '../SistemaObservabilidade/Log.API';
import { validateUsuario, IUsuario } from '../Contratos/Contrato.Usuario';

const logger = createApiLogger('AutenticacaoAPI');

export const AutenticacaoAPI = {

  loginComEmail: async (params: ILoginEmailParams): Promise<IUsuario> => {
    const method = 'loginComEmail';
    logger.logRequest(method, params);
    try {
      const response = await clienteBackend.post(clienteBackend.Endpoints.Auth.LOGIN, params);
      logger.logSuccess(method, response);
      return validateUsuario(response.data);
    } catch (error) {
      logger.logFailure(method, error, params);
      throw error;
    }
  },

  registrar: async (params: IRegistroParams): Promise<IUsuario> => {
    const method = 'registrar';
    logger.logRequest(method, params);
    try {
      const response = await clienteBackend.post(clienteBackend.Endpoints.Auth.REGISTER, params);
      logger.logSuccess(method, response);
      return validateUsuario(response.data);
    } catch (error) {
      logger.logFailure(method, error, params);
      throw error;
    }
  },

  completarPerfil: async (usuarioId: string, dadosPerfil: IPerfilParaCompletar): Promise<IUsuario> => {
    const method = 'completarPerfil';
    const requestData = { usuarioId, ...dadosPerfil };
    logger.logRequest(method, requestData);
    try {
      const response = await clienteBackend.post(clienteBackend.Endpoints.Auth.ME, requestData);
      logger.logSuccess(method, response);
      return validateUsuario(response.data);
    } catch (error) {
      logger.logFailure(method, error, requestData);
      throw error;
    }
  },

  loginComProvedorSocial: async (params: { provedor: string, token: string, email: string, nome: string }): Promise<IUsuario> => {
    const method = 'loginComProvedorSocial';
    logger.logRequest(method, params);
    try {
      const response = await clienteBackend.post(clienteBackend.Endpoints.Auth.GOOGLE, params);
      logger.logSuccess(method, response);
      return validateUsuario(response.data);
    } catch (error) {
      logger.logFailure(method, error, params);
      throw error;
    }
  }
};
