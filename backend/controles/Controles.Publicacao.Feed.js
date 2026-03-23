
import Log from '../Logs/BK.Log.Supremo.js';
import servicoPublicacaoFeed from '../ServicosBackend/Servicos.Publicacao.Feed.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import { validarPublicacaoFeed } from '../validators/Validator.Estrutura.Publicacao.Feed.js';

const logger = Log.createLogger('Feed');

const criarPost = async (req, res) => {
    const userId = req.user.id;
    logger.info('POST_CREATE_START', { userId, body: req.body });
    try {
        const dadosParaValidar = { ...req.body, autorId: userId };
        const dadosValidados = validarPublicacaoFeed(dadosParaValidar);

        const post = await servicoPublicacaoFeed.criarPost(dadosValidados, req.user);
        
        logger.info('POST_CREATE_SUCCESS', { postId: post.id, userId });
        
        ServicoHTTPResposta.criado(res, post);

    } catch (error) {
        logger.error('POST_CREATE_ERROR', { 
            errorMessage: error.message,
            userId, 
            data: req.body 
        });
        ServicoHTTPResposta.erro(res, error.message, 400); 
    }
};

const obterTodosOsPosts = async (req, res) => {
    logger.info('POSTS_GET_ALL_START');
    try {
        const posts = await servicoPublicacaoFeed.obterTodosOsPosts(req.query);
        logger.info('POSTS_GET_ALL_SUCCESS', { count: posts.length });
        ServicoHTTPResposta.sucesso(res, posts);
    } catch (error) {
        logger.error('POSTS_GET_ALL_ERROR', { errorMessage: error.message, query: req.query });
        ServicoHTTPResposta.erro(res, error.message, error.statusCode || 500, error.message);
    }
};

const obterPostPorId = async (req, res) => {
    const { postId } = req.params;
    logger.info('POST_GET_BY_ID_START', { postId });
    try {
        const post = await servicoPublicacaoFeed.obterPostPorId(postId);
        logger.info('POST_GET_BY_ID_SUCCESS', { postId });
        ServicoHTTPResposta.sucesso(res, post);
    } catch (error) {
        logger.error('POST_GET_BY_ID_ERROR', { errorMessage: error.message, postId });
        ServicoHTTPResposta.erro(res, error.message, error.statusCode || 404, error.message);
    }
};

const atualizarPost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    logger.info('POST_UPDATE_START', { postId, userId });
    try {
        const updatedPost = await servicoPublicacaoFeed.atualizarPost(postId, req.body, req.user);
        logger.info('POST_UPDATE_SUCCESS', { postId, userId });
        ServicoHTTPResposta.sucesso(res, updatedPost);
    } catch (error) {
        logger.error('POST_UPDATE_ERROR', { errorMessage: error.message, postId, userId, data: req.body });
        ServicoHTTPResposta.erro(res, error.message, error.statusCode || 400, error.message);
    }
};

const deletarPost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    logger.info('POST_DELETE_START', { postId, userId });
    try {
        await servicoPublicacaoFeed.deletarPost(postId, req.user);
        logger.info('POST_DELETE_SUCCESS', { postId, userId });
        ServicoHTTPResposta.sucesso(res, null, "Post deletado com sucesso.");
    } catch (error) {
        logger.error('POST_DELETE_ERROR', { errorMessage: error.message, postId, userId });
        ServicoHTTPResposta.erro(res, error.message, error.statusCode || 403, error.message);
    }
};

export default {
    criarPost,
    obterTodosOsPosts,
    obterPostPorId,
    atualizarPost,
    deletarPost,
};
