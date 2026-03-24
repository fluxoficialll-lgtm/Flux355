
// backend/controles/Controles.Publicacao.Reels.js
import * as Log from '../Logs/BK.Log.Supremo.js';
import ServicoReels from '../ServicosBackend/Servicos.Publicacao.Reels.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import { validarPublicacaoReels } from '../validators/Validator.Estrutura.Publicacao.Reels.js';

const createReel = async (req, res) => {
    const userId = req.user.id;
    Log.controller.info('Iniciando criação de reel', { event: 'REEL_CREATE_START', userId, body: req.body });
    try {
        const dadosParaValidar = { ...req.body, autorId: userId };
        const dadosValidados = validarPublicacaoReels(dadosParaValidar);

        const reel = await ServicoReels.createReel(dadosValidados, req.user);
        
        Log.controller.info('Reel criado com sucesso', { event: 'REEL_CREATE_SUCCESS', reelId: reel.id, userId });
        
        ServicoHTTPResposta.criado(res, reel);

    } catch (error) {
        Log.controller.error('Erro ao criar reel', { 
            event: 'REEL_CREATE_ERROR', 
            errorMessage: error.message, 
            userId, 
            data: req.body 
        });
        ServicoHTTPResposta.erro(res, error.message, 400);
    }
};

const getAllReels = async (req, res) => {
    Log.controller.info('Iniciando obtenção de todos os reels', { event: 'REELS_GET_ALL_START' });
    try {
        const reels = await ServicoReels.getAllReels(req.query);
        Log.controller.info('Todos os reels obtidos com sucesso', { event: 'REELS_GET_ALL_SUCCESS', count: reels.length });
        ServicoHTTPResposta.sucesso(res, reels);
    } catch (error) {
        Log.controller.error('Erro ao obter todos os reels', { event: 'REELS_GET_ALL_ERROR', errorMessage: error.message });
        ServicoHTTPResposta.erro(res, error.message, 500, error.message);
    }
};

const getReelById = async (req, res) => {
    const { reelId } = req.params;
    Log.controller.info('Iniciando obtenção de reel por ID', { event: 'REEL_GET_BY_ID_START', reelId });
    try {
        const reel = await ServicoReels.getReelById(reelId);
        if (!reel) {
            Log.controller.warn('Reel não encontrado', { event: 'REEL_GET_BY_ID_NOT_FOUND', reelId });
            return ServicoHTTPResposta.naoEncontrado(res, 'Reel não encontrado.');
        }
        Log.controller.info('Reel obtido por ID com sucesso', { event: 'REEL_GET_BY_ID_SUCCESS', reelId });
        ServicoHTTPResposta.sucesso(res, reel);
    } catch (error) {
        Log.controller.error('Erro ao obter reel por ID', { event: 'REEL_GET_BY_ID_ERROR', errorMessage: error.message, reelId });
        ServicoHTTPResposta.erro(res, error.message, 500, error.message);
    }
};

const updateReel = async (req, res) => {
    const { reelId } = req.params;
    const userId = req.user.id;
    Log.controller.info('Iniciando atualização de reel', { event: 'REEL_UPDATE_START', reelId, userId });
    try {
        const updatedReel = await ServicoReels.updateReel(reelId, req.body, userId);
        Log.controller.info('Reel atualizado com sucesso', { event: 'REEL_UPDATE_SUCCESS', reelId, userId });
        ServicoHTTPResposta.sucesso(res, updatedReel);
    } catch (error) {
        Log.controller.error('Erro ao atualizar reel', { event: 'REEL_UPDATE_ERROR', errorMessage: error.message, reelId, userId, data: req.body });
        ServicoHTTPResposta.erro(res, error.message, 400, error.message);
    }
};

const deleteReel = async (req, res) => {
    const { reelId } = req.params;
    const userId = req.user.id;
    Log.controller.info('Iniciando exclusão de reel', { event: 'REEL_DELETE_START', reelId, userId });
    try {
        await ServicoReels.deleteReel(reelId, userId);
        Log.controller.info('Reel excluído com sucesso', { event: 'REEL_DELETE_SUCCESS', reelId, userId });
        ServicoHTTPResposta.semConteudo(res);
    } catch (error) {
        Log.controller.error('Erro ao excluir reel', { event: 'REEL_DELETE_ERROR', errorMessage: error.message, reelId, userId });
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
