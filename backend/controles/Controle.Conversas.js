
import * as Log from '../Logs/BK.Log.Supremo.js';
import servicoConversas from '../ServicosBackend/Servico.Conversas.js';
import ServicoRespostaHTTP from '../ServicosBackend/Servico.HTTP.Resposta.js';

const obterConversas = async (req, res) => {
    const userId = req.user.id;
    Log.controller.info('Buscando conversas do usuário', { event: 'CONVERSAS_GET_START', userId });

    try {
        const conversas = await servicoConversas.obterConversas(userId);
        
        Log.controller.info('Conversas do usuário obtidas com sucesso', { event: 'CONVERSAS_GET_SUCCESS', userId, count: conversas.length });
        
        return ServicoRespostaHTTP.sucesso(res, conversas, "Conversas obtidas com sucesso");
    } catch (error) {
        Log.controller.error('Erro ao buscar conversas do usuário', { event: 'CONVERSAS_GET_ERROR', errorMessage: error.message, userId });

        return ServicoRespostaHTTP.erro(res, 'Falha ao obter conversas.', 500, error.message);
    }
};

export default {
    obterConversas,
};
