
// backend/controles/Controles.Metricas.Comentario.Marketplace.js
import * as Log from '../Logs/BK.Log.Supremo.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import * as marketplaceCommentMetricsService from '../ServicosBackend/Servicos.Metricas.Comentario.Marketplace.js';

async function trackComment(req, res) {
    const { commentData } = req.body;
    Log.controller.info('Iniciando rastreamento de métrica de comentário do marketplace', { event: 'METRIC_COMMENT_TRACK_START', productId: commentData?.productId });

    try {
        await marketplaceCommentMetricsService.trackComment(commentData);
        Log.controller.info('Métrica de comentário do marketplace rastreada com sucesso', { event: 'METRIC_COMMENT_TRACK_SUCCESS', productId: commentData?.productId });
        return ServicoHTTPResposta.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        Log.controller.error('Erro ao rastrear métrica de comentário do marketplace', { event: 'METRIC_COMMENT_TRACK_ERROR', errorMessage: error.message, data: commentData });
        return ServicoHTTPResposta.erro(res, 'Error tracking metric', 500, error.message);
    }
}

async function trackCommentLike(req, res) {
    const { commentId } = req.body;
    Log.controller.info('Iniciando rastreamento de métrica de curtida de comentário do marketplace', { event: 'METRIC_COMMENT_LIKE_TRACK_START', commentId });

    try {
        await marketplaceCommentMetricsService.trackCommentLike(commentId);
        Log.controller.info('Métrica de curtida de comentário do marketplace rastreada com sucesso', { event: 'METRIC_COMMENT_LIKE_TRACK_SUCCESS', commentId });
        return ServicoHTTPResposta.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        Log.controller.error('Erro ao rastrear métrica de curtida de comentário do marketplace', { event: 'METRIC_COMMENT_LIKE_TRACK_ERROR', errorMessage: error.message, commentId });
        return ServicoHTTPResposta.erro(res, 'Error tracking metric', 500, error.message);
    }
}

async function trackCommentReply(req, res) {
    const { commentId, replyData } = req.body;
    Log.controller.info('Iniciando rastreamento de métrica de resposta de comentário do marketplace', { event: 'METRIC_COMMENT_REPLY_TRACK_START', commentId });

    try {
        await marketplaceCommentMetricsService.trackCommentReply(commentId, replyData);
        Log.controller.info('Métrica de resposta de comentário do marketplace rastreada com sucesso', { event: 'METRIC_COMMENT_REPLY_TRACK_SUCCESS', commentId });
        return ServicoHTTPResposta.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        Log.controller.error('Erro ao rastrear métrica de resposta de comentário do marketplace', { event: 'METRIC_COMMENT_REPLY_TRACK_ERROR', errorMessage: error.message, commentId, data: replyData });
        return ServicoHTTPResposta.erro(res, 'Error tracking metric', 500, error.message);
    }
}

export {
    trackComment,
    trackCommentLike,
    trackCommentReply,
};
