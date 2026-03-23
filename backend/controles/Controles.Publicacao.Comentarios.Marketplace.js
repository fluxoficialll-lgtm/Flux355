
import Log from '../Logs/BK.Log.Supremo.js';
import ServicoComentariosMarketplace from '../ServicosBackend/Servicos.Publicacao.Comentarios.Marketplace.js';
import ServicoRespostaHTTP from '../ServicosBackend/Servico.HTTP.Resposta.js';
import { validarCriacaoComentario } from '../validators/Validator.Estrutura.Comentario.js';

const logger = Log.createLogger('MarketplaceComments');

const criarComentario = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user.id;

    logger.info('COMMENT_MARKETPLACE_CREATE_START', { itemId, userId, body: req.body });

    try {
        // 1. Validar a entrada
        const dadosParaValidar = { 
            texto: req.body.content, // Mapeando 'content' para 'texto'
            autorId: userId, 
            parenteId: itemId 
        };
        const dadosValidados = validarCriacaoComentario(dadosParaValidar);

        // 2. Chamar o serviço com o texto validado
        // Assinatura do serviço: (idDoItem, idDoUsuario, textoDoComentario)
        const novoComentario = await ServicoComentariosMarketplace.criarComentario(
            itemId, 
            userId, 
            dadosValidados.texto
        );
        
        logger.info('COMMENT_MARKETPLACE_CREATE_SUCCESS', { commentId: novoComentario.id, itemId, userId });
        
        // 3. Enviar a resposta
        return ServicoRespostaHTTP.criado(res, novoComentario, "Comentário criado com sucesso");

    } catch (error) {
        logger.error('COMMENT_MARKETPLACE_CREATE_ERROR', { 
            errorMessage: error.message,
            itemId, 
            userId,
            data: req.body
        });

        return ServicoRespostaHTTP.erro(res, error.message, 400);
    }
};

const obterComentariosPorItemId = async (req, res) => {
    const { itemId } = req.params;
    logger.info('COMMENT_MARKETPLACE_GET_START', { itemId });

    try {
        const comentarios = await ServicoComentariosMarketplace.obterComentariosPorItemId(itemId);

        logger.info('COMMENT_MARKETPLACE_GET_SUCCESS', { itemId, count: comentarios.length });

        return ServicoRespostaHTTP.sucesso(res, comentarios);
    } catch (error) {
        logger.error('COMMENT_MARKETPLACE_GET_ERROR', { errorMessage: error.message, itemId });

        return ServicoRespostaHTTP.erro(res, 'Falha ao buscar comentários.', 500, error.message);
    }
};

const atualizarComentario = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    logger.info('COMMENT_MARKETPLACE_UPDATE_START', { commentId, userId });

    try {
        const comentarioAtualizado = await ServicoComentariosMarketplace.atualizarComentario(commentId, userId, req.body.content);
        
        logger.info('COMMENT_MARKETPLACE_UPDATE_SUCCESS', { commentId, userId });
        
        return ServicoRespostaHTTP.sucesso(res, comentarioAtualizado, "Comentário atualizado com sucesso");
    } catch (error) {
        logger.error('COMMENT_MARKETPLACE_UPDATE_ERROR', { errorMessage: error.message, commentId, userId });

        return ServicoRespostaHTTP.erro(res, 'Falha ao atualizar comentário.', 500, error.message);
    }
};

const deletarComentario = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    logger.info('COMMENT_MARKETPLACE_DELETE_START', { commentId, userId });

    try {
        await ServicoComentariosMarketplace.deletarComentario(commentId, userId);

        logger.info('COMMENT_MARKETPLACE_DELETE_SUCCESS', { commentId, userId });

        return ServicoRespostaHTTP.sucesso(res, null, "Comentário deletado com sucesso");
    } catch (error) {
        logger.error('COMMENT_MARKETPLACE_DELETE_ERROR', { errorMessage: error.message, commentId, userId });
        
        return ServicoRespostaHTTP.erro(res, 'Falha ao deletar comentário.', 500, error.message);
    }
};

export default {
    criarComentario,
    obterComentariosPorItemId,
    atualizarComentario,
    deletarComentario
};
