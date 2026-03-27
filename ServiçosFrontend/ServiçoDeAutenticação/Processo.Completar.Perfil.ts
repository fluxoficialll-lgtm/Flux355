
import { IPerfilParaCompletar, IResultadoCompletarPerfil } from './Processo.Completar.Perfil';
import ClienteBackend from '../Cliente.Backend.js'; 
import { ENDPOINTS_AUTH } from '../EndPoints/EndPoints.Auth';

class ProcessoCompletarPerfil {
  
  async executar(perfilData: IPerfilParaCompletar): Promise<IResultadoCompletarPerfil> {
    try {
      // Corrigido para usar ENDPOINTS_AUTH.PROFILE, que é o endpoint correto para atualizar o perfil
      const response = await ClienteBackend.post(ENDPOINTS_AUTH.PROFILE, perfilData);
      
      if (response.status === 200) {
        return {
          sucesso: true,
          mensagem: "Perfil completado com sucesso!",
          usuarioAtualizado: response.data,
        };
      } else {
        const mensagemErro = response.data.message || "Ocorreu um erro desconhecido no servidor.";
        return {
          sucesso: false,
          mensagem: mensagemErro,
        };
      }
    } catch (error: any) {
      console.error("Erro ao completar o perfil:", error);
      
      const mensagemErroApi = error.response?.data?.message || "Não foi possível conectar ao servidor. Tente novamente mais tarde.";
      
      return {
        sucesso: false,
        mensagem: mensagemErroApi,
      };
    }
  }
}

export const processoCompletarPerfil = new ProcessoCompletarPerfil();
