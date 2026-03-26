
// backend/ServicosBackend/Servico.Conversas.js

import repositorioConversas from '../Repositorios/Repositorio.Conversas.js';
import createServicoLogger from '../config/Log.Servicos.Backend.js';

const logger = createServicoLogger('Servico.Conversas.js');

const obterConversas = async (userId) => {
    logger.info(`Iniciando busca de conversas para o usuário ${userId}.`);
    
    if (!userId) {
        logger.error('ID do usuário não foi fornecido para buscar as conversas.');
        throw new Error('ID do usuário é necessário para buscar conversas.');
    }

    try {
        const conversas = await repositorioConversas.obterConversasPorUsuario(userId);
        logger.info(`Foram encontradas ${conversas.length} conversas para o usuário ${userId}.`);
        return conversas;
    } catch (error) {
        logger.error(`Erro ao obter conversas para o usuário ${userId} do repositório.`, { error });
        throw error;
    }
};

export default {
    obterConversas,
};
