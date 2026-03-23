
// backend/controles/Controles.Publicacao.Reels.js
import Log from '../Logs/BK.Log.Supremo.js';
import ServicoReels from '../ServicosBackend/Servicos.Publicacao.Reels.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import { validarPublicacaoReels } from '../validators/Validator.Estrutura.Publicacao.Reels.js';

const logger = Log.createLogger('Reels');

const createReel = async (req, res) => {
    const userId = req.user.id;
    logger.info('REEL_CREATE_START', { userId, body: req.body });
    try {
        // 1. Validar a entrada
        const dadosParaValidar = { ...req.body, autorId: userId };
        const dadosValidados = validarPublicacaoReels(dadosParaValidar);

        // 2. Chamar o serviço com os dados validados
        const reel = await ServicoReels.createReel(dadosValidados, req.user);
        
        logger.info('REEL_CREATE_SUCCESS', { reelId: reel.id, userId });
        
        // 3. Enviar a resposta
        ServicoHTTPResposta.criado(res, reel);

    } catch (error) {
        logger.error('REEL_CREATE_ERROR', { 
            errorMessage: error.message, 
            userId, 
            data: req.body 
        });
        ServicoHTTPResposta.erro(res, error.message, 400);
    }
};

const getAllReels = async (req, res) => {
    logger.info('REELS_GET_ALL_START');
    try {
        const reels = await ServicoReels.getAllReels(req.query);
        logger.info('REELS_GET_ALL_SUCCESS', { count: reels.length });
        ServicoHTTPResposta.sucesso(res, reels);
    } catch (error) {
        logger.error('REELS_GET_ALL_ERROR', { errorMessage: error.message });
        ServicoHTTPResposta.erro(res, error.message, 500, error.message);
    }
};

const getReelById = async (req, res) => {
    const { reelId } = req.params;
    logger.info('REEL_GET_BY_ID_START', { reelId });
    try {
        const reel = await ServicoReels.getReelById(reelId);
        if (!reel) {
            logger.warn('REEL_GET_BY_ID_NOT_FOUND', { reelId });
            return ServicoHTTPResposta.naoEncontrado(res, 'Reel não encontrado.');
        }
        logger.info('REEL_GET_BY_ID_SUCCESS', { reelId });
        ServicoHTTPResposta.sucesso(res, reel);
    } catch (error) {
        logger.error('REEL_GET_BY_ID_ERROR', { errorMessage: error.message, reelId });
        ServicoHTTPResposta.erro(res, error.message, 500, error.message);
    }
};

const updateReel = async (req, res) => {
    const { reelId } = req.params;
    const userId = req.user.id;
    logger.info('REEL_UPDATE_START', { reelId, userId });
    try {
        const updatedReel = await ServicoReels.updateReel(reelId, req.body, userId);
        logger.info('REEL_UPDATE_SUCCESS', { reelId, userId });
        ServicoHTTPResposta.sucesso(res, updatedReel);
    } catch (error) {
        logger.error('REEL_UPDATE_ERROR', { errorMessage: error.message, reelId, userId, data: req.body });
        ServicoHTTPResposta.erro(res, error.message, 400, error.message);
    }
};

const deleteReel = async (req, res) => {
    const { reelId } = req.params;
    const userId = req.user.id;
    logger.info('REEL_DELETE_START', { reelId, userId });
    try {
        await ServicoReels.deleteReel(reelId, userId);
        logger.info('REEL_DELETE_SUCCESS', { reelId, userId });
        ServicoHTTPResposta.semConteudo(res);
    } catch (error) {
        logger.error('REEL_DELETE_ERROR', { errorMessage: error.message, reelId, userId });
        ServicoHTTPResposta.erro(res, error.message, 400, error.message);
    }
};

export default {
    createReel,
    getAllReels,
    getReelById,
    updateReel,
    deleteReel
};
