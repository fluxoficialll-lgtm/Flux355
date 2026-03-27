
import ClienteBackend from '../../Cliente.Backend.js';
import { DadosChat } from '../../../types/Saida/Types.Estrutura.Chat';

export const api = {
  async listarConversas(): Promise<DadosChat[]> {
    try {
      const response = await ClienteBackend.get(ClienteBackend.Endpoints.Conversas.LISTAR);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar conversas:", error);
      return [];
    }
  },
};
