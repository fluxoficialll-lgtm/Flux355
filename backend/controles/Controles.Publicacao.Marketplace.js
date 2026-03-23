
// backend/controles/Controles.Publicacao.Marketplace.js
import Log from '../Logs/BK.Log.Supremo.js';
import ServicoMarketplace from '../ServicosBackend/Servicos.Publicacao.Marketplace.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import { validarItemMarketplace } from '../validators/Validator.Estrutura.Publicacao.Marketplace.js';

const logger = Log.createLogger('Marketplace');

const criarItem = async (req, res) => {
    const userId = req.user.id;
    logger.info('ITEM_CREATE_START', { userId, body: req.body });
    try {
        // 1. Validar a entrada
        const dadosParaValidar = { ...req.body, autorId: userId };
        const dadosValidados = validarItemMarketplace(dadosParaValidar);

        // 2. Chamar o serviço com os dados validados
        const item = await ServicoMarketplace.criarItem(dadosValidados, req.user);

        logger.info('ITEM_CREATE_SUCCESS', { itemId: item.id, userId });
        
        // 3. Enviar a resposta
        ServicoHTTPResposta.criado(res, item);

    } catch (error) {
        logger.error('ITEM_CREATE_ERROR', { 
            errorMessage: error.message,
            userId, 
            data: req.body 
        });
        ServicoHTTPResposta.erro(res, error.message, 400);
    }
};

const obterTodosItens = async (req, res) => {
    logger.info('ITEMS_GET_ALL_START');
    try {
        const items = await ServicoMarketplace.obterTodosItens(req.query);
        logger.info('ITEMS_GET_ALL_SUCCESS', { count: items.length });
        ServicoHTTPResposta.sucesso(res, items);
    } catch (error) {
        logger.error('ITEMS_GET_ALL_ERROR', { errorMessage: error.message });
        ServicoHTTPResposta.erro(res, error.message, 500, error.message);
    }
};

const obterItemPorId = async (req, res) => {
    const { itemId } = req.params;
    logger.info('ITEM_GET_BY_ID_START', { itemId });
    try {
        const item = await ServicoMarketplace.obterItemPorId(itemId);
        if (!item) {
            logger.warn('ITEM_GET_BY_ID_NOT_FOUND', { itemId });
            return ServicoHTTPResposta.naoEncontrado(res, 'Item não encontrado.');
        }
        logger.info('ITEM_GET_BY_ID_SUCCESS', { itemId });
        ServicoHTTPResposta.sucesso(res, item);
    } catch (error) {
        logger.error('ITEM_GET_BY_ID_ERROR', { errorMessage: error.message, itemId });
        ServicoHTTPResposta.erro(res, error.message, 500, error.message);
    }
};

const atualizarItem = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user.id;
    logger.info('ITEM_UPDATE_START', { itemId, userId });
    try {
        const updatedItem = await ServicoMarketplace.atualizarItem(itemId, req.body, userId);
        logger.info('ITEM_UPDATE_SUCCESS', { itemId, userId });
        ServicoHTTPResposta.sucesso(res, updatedItem);
    } catch (error) {
        logger.error('ITEM_UPDATE_ERROR', { errorMessage: error.message, itemId, userId, data: req.body });
        ServicoHTTPResposta.erro(res, error.message, 400, error.message);
    }
};

const deletarItem = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user.id;
    logger.info('ITEM_DELETE_START', { itemId, userId });
    try {
        await ServicoMarketplace.deletarItem(itemId, userId);
        logger.info('ITEM_DELETE_SUCCESS', { itemId, userId });
        ServicoHTTPResposta.semConteudo(res);
    } catch (error) {
        logger.error('ITEM_DELETE_ERROR', { errorMessage: error.message, itemId, userId });
        ServicoHTTPResposta.erro(res, error.message, 400, error.message);
    }
};

export default {
    criarItem,
    obterTodosItens,
    obterItemPorId,
    atualizarItem,
    deletarItem
};
