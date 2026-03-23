
import Log from '../Logs/BK.Log.Supremo.js';
import servicoConversas from '../ServicosBackend/Servico.Conversas.js';
import ServicoRespostaHTTP from '../ServicosBackend/Servico.HTTP.Resposta.js';

const logger = Log.createLogger('Conversas');

const obterConversas = async (req, res) => {
    const userId = req.user.id;
    logger.info('CONVERSAS_GET_START', { userId });

    try {
        const conversas = await servicoConversas.obterConversas(userId);
        
        logger.info('CONVERSAS_GET_SUCCESS', { userId, count: conversas.length });
        
        return ServicoRespostaHTTP.sucesso(res, conversas, "Conversas obtidas com sucesso");
    } catch (error) {
        logger.error('CONVERSAS_GET_ERROR', { errorMessage: error.message, userId });

        return ServicoRespostaHTTP.erro(res, 'Falha ao obter conversas.', 500, error.message);
    }
};

export default {
    obterConversas,
};
