
import Log from '../Logs/BK.Log.Supremo.js';
import ServicoComentariosReels from '../ServicosBackend/Servicos.Publicacao.Comentarios.Reels.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import { validarCriacaoComentario } from '../validators/Validator.Estrutura.Comentario.js';

const logger = Log.createLogger('ReelsComments');

const createComment = async (req, res) => {
    const { reelId } = req.params;
    const userId = req.user.id;
    logger.info('REEL_COMMENT_CREATE_START', { reelId, userId, body: req.body });
    try {
        // 1. Validar a entrada usando o validador genérico
        const dadosParaValidar = { 
            ...req.body, 
            autorId: userId, 
            parenteId: reelId 
        };
        const dadosValidados = validarCriacaoComentario(dadosParaValidar);

        // 2. Chamar o serviço com os dados validados
        // A assinatura do serviço parece ser: (dadosComentario, idDoReel, idDoUsuario)
        const comment = await ServicoComentariosReels.createComment(
            { texto: dadosValidados.texto }, 
            reelId, 
            userId
        );
        
        logger.info('REEL_COMMENT_CREATE_SUCCESS', { commentId: comment.id, reelId, userId });
        
        // 3. Enviar a resposta
        ServicoHTTPResposta.criado(res, comment);

    } catch (error) {
        logger.error('REEL_COMMENT_CREATE_ERROR', { 
            errorMessage: error.message,
            reelId, 
            userId, 
            data: req.body 
        });
        ServicoHTTPResposta.erro(res, error.message, 400);
    }
};

const getCommentsForReel = async (req, res) => {
    const { reelId } = req.params;
    logger.info('REEL_COMMENTS_GET_START', { reelId });
    try {
        const comments = await ServicoComentariosReels.getCommentsForReel(reelId, req.query);
        logger.info('REEL_COMMENTS_GET_SUCCESS', { reelId, count: comments.length });
        ServicoHTTPResposta.sucesso(res, comments);
    } catch (error) {
        logger.error('REEL_COMMENTS_GET_ERROR', { errorMessage: error.message, reelId });
        ServicoHTTPResposta.erro(res, error.message, error.statusCode || 500, error.message);
    }
};

const updateComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    logger.info('REEL_COMMENT_UPDATE_START', { commentId, userId });
    try {
        const updatedComment = await ServicoComentariosReels.updateComment(commentId, req.body, userId);
        logger.info('REEL_COMMENT_UPDATE_SUCCESS', { commentId, userId });
        ServicoHTTPResposta.sucesso(res, updatedComment);
    } catch (error) {
        logger.error('REEL_COMMENT_UPDATE_ERROR', { errorMessage: error.message, commentId, userId, data: req.body });
        ServicoHTTPResposta.erro(res, error.message, error.statusCode || 500, error.message);
    }
};

const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    logger.info('REEL_COMMENT_DELETE_START', { commentId, userId });
    try {
        await ServicoComentariosReels.deleteComment(commentId, userId);
        logger.info('REEL_COMMENT_DELETE_SUCCESS', { commentId, userId });
        ServicoHTTPResposta.semConteudo(res);
    } catch (error) {
        logger.error('REEL_COMMENT_DELETE_ERROR', { errorMessage: error.message, commentId, userId });
        ServicoHTTPResposta.erro(res, error.message, error.statusCode || 500, error.message);
    }
};

export default {
    createComment,
    getCommentsForReel,
    updateComment,
    deleteComment
};
