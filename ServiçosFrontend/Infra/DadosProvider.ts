
import backend from '../Cliente.Backend.js';
import { ENDPOINTS_AUTH } from '../EndPoints/EndPoints.Auth';
import LoggerParaInfra from '../SistemaObservabilidade/Log.Infra';
import { IPerfilParaCompletar } from '../ServiçoDeAutenticação/Processo.Completar.Perfil';
import { infraProvider as infraProviderUsuario } from './Infra.Provider.Usuario';

const logger = new LoggerParaInfra('DadosProvider.Autenticacao');

// A interface ILoginSocialData é interna e não causa dependência externa.
interface ILoginSocialData {
  nome: string;
  email: string;
  googleId: string;
  avatarUrl?: string;
  tokenProvider: string;
}

class C_DadosProvider {
  // --- DEFINIÇÕES DA ESTRUTURA DE DADOS ---
  camposPerfilObrigatorio = () => [
    { campo: 'id', tipo: 'string', obrigatorio: true },
    { campo: 'nome', tipo: 'string', obrigatorio: true },
    { campo: 'nickname', tipo: 'string', obrigatorio: true },
    { campo: 'email', tipo: 'string', obrigatorio: true },
    { campo: 'dataNascimento', tipo: 'date', obrigatorio: true },
  ];

  camposLoginSocial = () => [
    { campo: 'nome', tipo: 'string', obrigatorio: true },
    { campo: 'email', tipo: 'string', obrigatorio: true },
    { campo: 'googleId', tipo: 'string', obrigatorio: true },
    { campo: 'avatarUrl', tipo: 'string', obrigatorio: false },
  ];

  // --- MÉTODOS DE AUTENTICAÇÃO ---

  async login(email: string, senha: string): Promise<any> {
    try {
      const response = await backend.post(ENDPOINTS_AUTH.LOGIN, { email, senha });
      return response.data; // Retorna diretamente os dados do backend (usuario, token, etc)
    } catch (error: any) {
      logger.error("Erro no login", error);
      throw error;
    }
  }

  async completarPerfil(perfilData: IPerfilParaCompletar): Promise<any> {
    for (const campo of this.camposPerfilObrigatorio()) {
      if (campo.campo === 'id') continue;
      if (!(campo.campo in perfilData) || !perfilData[campo.campo as keyof any]) {
        return { sucesso: false, mensagem: `O campo '${campo.campo}' é obrigatório.` };
      }
    }
    try {
      const response = await backend.put(ENDPOINTS_AUTH.PROFILE, perfilData);
      return { sucesso: true, mensagem: "Perfil completado com sucesso!", usuarioAtualizado: response.data };
    } catch (error: any) {
      logger.error("Erro ao completar o perfil", error);
      return { sucesso: false, mensagem: error.response?.data?.message || "Falha na comunicação com o servidor." };
    }
  }

  async lidarComLoginSocial(dadosLogin: ILoginSocialData): Promise<any> {
    for (const campo of this.camposLoginSocial()) {
      if (campo.obrigatorio && (!dadosLogin.hasOwnProperty(campo.campo) || !dadosLogin[campo.campo as keyof ILoginSocialData])) {
        throw new Error(`Dado obrigatório '${campo.campo}' não recebido do provedor social.`);
      }
    }
    try {
      const response = await backend.post(ENDPOINTS_AUTH.LOGIN_GOOGLE, dadosLogin);
      return response.data; // Retorna os dados do backend (usuário, token, etc.)
    } catch (error) {
      logger.error("Erro ao lidar com login social", error);
      throw error;
    }
  }

  // --- MÉTODOS DE USUÁRIO ---

  async buscarUsuarioPorId(id: string): Promise<any> {
    try {
      const response = await infraProviderUsuario.get(`/api/v1/users/${id}`);
      return { sucesso: true, dados: response.data };
    } catch (error: any) {
      return { sucesso: false, mensagem: error.response?.data?.message || "Falha ao buscar usuário." };
    }
  }

  async buscarUsuarioPorEmail(email: string): Promise<any> {
    try {
      const response = await infraProviderUsuario.get(`/api/v1/users?email=${email}`);
      const usuario = response.data && response.data.length > 0 ? response.data[0] : null;
      return { sucesso: true, dados: usuario };
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
          return { sucesso: true, dados: null };
      }
      return { sucesso: false, mensagem: error.response?.data?.message || "Falha ao buscar usuário por e-mail." };
    }
  }

  async criarUsuario(dadosUsuario: any): Promise<any> {
    try {
      const response = await infraProviderUsuario.post('/api/v1/users', dadosUsuario);
      return response;
    } catch (error: any) {
      return { sucesso: false, mensagem: error.response?.data?.message || "Falha ao criar usuário." };
    }
  }
}

export const DadosProvider = new C_DadosProvider();
