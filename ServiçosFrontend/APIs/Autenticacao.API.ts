
import { clienteBackend } from '../Cliente.Backend.js'; 
import { ILoginEmailParams } from '../Contratos/Contrato.Autenticacao';
import { IRegistroParams } from '../ServiçoDeAutenticação/Processo.Registrar';
import { IPerfilParaCompletar } from '../ServiçoDeAutenticação/Processo.Completar.Perfil';
import { EndpointsAuth } from '../EndPoints/EndPoints.Auth';
import { createApiLogger } from '../SistemaObservabilidade/Log.API';

const logger = createApiLogger('AutenticacaoAPI');

export const AutenticacaoAPI = {

  loginComEmail: async (params: ILoginEmailParams): Promise<any> => {
    const method = 'loginComEmail';
    logger.logRequest(method, params);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      if (params.email === "teste@gmail.com" && params.senha === "12345678") {
        const response = {
          token: "jwt.token.simulado",
          usuario: { id: "usr_123", email: "teste@gmail.com", apelido: "Testador", precisaCompletarPerfil: false }
        };
        logger.logSuccess(method, response);
        return response;
      }
      throw new Error("Credenciais inválidas");
    } catch (error) {
      logger.logFailure(method, error, params);
      throw error;
    }
  },

  registrar: async (params: IRegistroParams): Promise<any> => {
    const method = 'registrar';
    logger.logRequest(method, params);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const response = {
        usuario: { id: `usr_${new Date().getTime()}`, email: params.email },
        mensagem: "Usuário registrado com sucesso!"
      };
      logger.logSuccess(method, response);
      return response;
    } catch (error) {
      logger.logFailure(method, error, params);
      throw error;
    }
  },

  completarPerfil: async (usuarioId: string, dadosPerfil: IPerfilParaCompletar): Promise<any> => {
    const method = 'completarPerfil';
    const requestData = { usuarioId, dadosPerfil };
    logger.logRequest(method, requestData);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const response = {
        id: usuarioId,
        email: "exemplo@email.com",
        ...dadosPerfil,
      };
      logger.logSuccess(method, response);
      return response;
    } catch (error) {
      logger.logFailure(method, error, requestData);
      throw error;
    }
  },

  loginComProvedorSocial: async (params: { provedor: string, token: string, email: string, nome: string }): Promise<any> => {
    const method = 'loginComProvedorSocial';
    logger.logRequest(method, params);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const response = {
        token: "jwt.token.simulado.social",
        usuario: { 
          id: `usr_social_${new Date().getTime()}`, 
          email: params.email, 
          apelido: params.nome, 
          precisaCompletarPerfil: true
        }
      };
      logger.logSuccess(method, response);
      return response;
    } catch (error) {
      logger.logFailure(method, error, params);
      throw error;
    }
  }
};
