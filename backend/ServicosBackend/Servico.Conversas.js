
import * as Log from '../Logs/BK.Log.Supremo.js';
import repositorioConversas from '../Repositorios/Repositorio.Conversas.js';

const obterConversas = async (userId) => {
    Log.service.info('Iniciando busca de conversas para o usuário', { event: 'OBTER_CONVERSAS_START', userId });
    // Validação básica do ID do usuário
    if (!userId) {
        Log.service.error('ID do usuário não fornecido para buscar conversas', { event: 'OBTER_CONVERSAS_VALIDATION_ERROR', userId });
        throw new Error('ID do usuário é necessário para buscar conversas.');
    }

    try {
        // Chama o repositório para obter os dados das conversas
        const conversas = await repositorioConversas.obterConversasPorUsuario(userId);

        Log.service.info('Conversas obtidas com sucesso', { event: 'OBTER_CONVERSAS_SUCCESS', userId, count: conversas.length });

        // Pode-se adicionar mais lógica de negócios aqui, se necessário
        // Por exemplo, formatar os dados antes de enviá-los de volta

        return conversas;
    } catch (error) {
        Log.service.error('Erro ao obter conversas do repositório', { event: 'OBTER_CONVERSAS_REPO_ERROR', userId, errorMessage: error.message });
        throw error;
    }
};

export default {
    obterConversas,
};
