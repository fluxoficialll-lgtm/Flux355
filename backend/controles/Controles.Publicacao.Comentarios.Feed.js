
// backend/controles/Controles.Publicacao.Comentarios.Feed.js
import Log from '../Logs/BK.Log.Supremo.js';
import ServicoComentariosFeed from '../ServicosBackend/Servicos.Publicacao.Comentarios.Feed.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import { validarCriacaoComentario } from '../validators/Validator.Estrutura.Comentario.js';

const logger = Log.createLogger('FeedComments');

const criarComentario = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    logger.info('COMMENT_CREATE_START', { postId, userId, body: req.body });
    try {
        // 1. Validar a entrada
        const dadosParaValidar = { 
            ...req.body, 
            autorId: userId, 
            parenteId: postId
        };
        const dadosValidados = validarCriacaoComentario(dadosParaValidar);

        // 2. Chamar o serviço com os dados validados
        const comentario = await ServicoComentariosFeed.criarComentario(
            { texto: dadosValidados.texto },
            postId,
            userId
        );

        logger.info('COMMENT_CREATE_SUCCESS', { commentId: comentario.id, postId, userId });
        
        // 3. Enviar a resposta
        ServicoHTTPResposta.criado(res, comentario);

    } catch (error) {
        logger.error('COMMENT_CREATE_ERROR', { 
            errorMessage: error.message,
            postId, 
            userId, 
            data: req.body 
        });
        ServicoHTTPResposta.erro(res, error.message, 400);
    }
};

const obterComentariosPorPostId = async (req, res) => {
    const { postId } = req.params;
    logger.info('COMMENTS_GET_START', { postId });
    try {
        const comentarios = await ServicoComentariosFeed.obterComentariosPorPostId(postId, req.query);
        logger.info('COMMENTS_GET_SUCCESS', { postId, count: comentarios.length });
        ServicoHTTPResposta.sucesso(res, comentarios);
    } catch (error) {
        logger.error('COMMENTS_GET_ERROR', { errorMessage: error.message, postId });
        ServicoHTTPResposta.erro(res, error.message, error.statusCode || 500, error.message);
    }
};

const atualizarComentario = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    logger.info('COMMENT_UPDATE_START', { commentId, userId });
    try {
        const comentarioAtualizado = await ServicoComentariosFeed.atualizarComentario(commentId, req.body, userId);
        logger.info('COMMENT_UPDATE_SUCCESS', { commentId, userId });
        ServicoHTTPResposta.sucesso(res, comentarioAtualizado);
    } catch (error) {
        logger.error('COMMENT_UPDATE_ERROR', { errorMessage: error.message, commentId, userId, data: req.body });
        ServicoHTTPResposta.erro(res, error.message, error.statusCode || 500, error.message);
    }
};

const deletarComentario = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    logger.info('COMMENT_DELETE_START', { commentId, userId });
    try {
        await ServicoComentariosFeed.deletarComentario(commentId, userId);
        logger.info('COMMENT_DELETE_SUCCESS', { commentId, userId });
        ServicoHTTPResposta.semConteudo(res);
    } catch (error) {
        logger.error('COMMENT_DELETE_ERROR', { errorMessage: error.message, commentId, userId });
        ServicoHTTPResposta.erro(res, error.message, error.statusCode || 500, error.message);
    }
};

export default {
    criarComentario,
    obterComentariosPorPostId,
    atualizarComentario,
    deletarComentario
};
