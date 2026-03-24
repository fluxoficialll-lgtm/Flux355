
// backend/controles/Controles.Metricas.Comentario.Reels.js
import * as Log from '../Logs/BK.Log.Supremo.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import * as reelsCommentMetricsService from '../ServicosBackend/Servicos.Metricas.Comentario.Reels.js';

async function trackComment(req, res) {
    const { commentData } = req.body;
    Log.controller.info('Iniciando rastreamento de comentário de reel', { event: 'METRIC_COMMENT_TRACK_START', reelId: commentData?.reelId });

    try {
        await reelsCommentMetricsService.trackComment(commentData);
        Log.controller.info('Rastreamento de comentário de reel bem-sucedido', { event: 'METRIC_COMMENT_TRACK_SUCCESS', reelId: commentData?.reelId });
        return ServicoHTTPResposta.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        Log.controller.error('Erro ao rastrear comentário de reel', { event: 'METRIC_COMMENT_TRACK_ERROR', errorMessage: error.message, data: commentData });
        return ServicoHTTPResposta.erro(res, 'Error tracking metric', 500, error.message);
    }
}

async function trackCommentLike(req, res) {
    const { commentId } = req.body;
    Log.controller.info('Iniciando rastreamento de curtida em comentário de reel', { event: 'METRIC_COMMENT_LIKE_TRACK_START', commentId });

    try {
        await reelsCommentMetricsService.trackCommentLike(commentId);
        Log.controller.info('Rastreamento de curtida em comentário de reel bem-sucedido', { event: 'METRIC_COMMENT_LIKE_TRACK_SUCCESS', commentId });
        return ServicoHTTPResposta.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        Log.controller.error('Erro ao rastrear curtida em comentário de reel', { event: 'METRIC_COMMENT_LIKE_TRACK_ERROR', errorMessage: error.message, commentId });
        return ServicoHTTPResposta.erro(res, 'Error tracking metric', 500, error.message);
    }
}

async function trackCommentReply(req, res) {
    const { commentId, replyData } = req.body;
    Log.controller.info('Iniciando rastreamento de resposta a comentário de reel', { event: 'METRIC_COMMENT_REPLY_TRACK_START', commentId });

    try {
        await reelsCommentMetricsService.trackCommentReply(commentId, replyData);
        Log.controller.info('Rastreamento de resposta a comentário de reel bem-sucedido', { event: 'METRIC_COMMENT_REPLY_TRACK_SUCCESS', commentId });
        return ServicoHTTPResposta.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        Log.controller.error('Erro ao rastrear resposta a comentário de reel', { event: 'METRIC_COMMENT_REPLY_TRACK_ERROR', errorMessage: error.message, commentId, data: replyData });
        return ServicoHTTPResposta.erro(res, 'Error tracking metric', 500, error.message);
    }
}

export {
    trackComment,
    trackCommentLike,
    trackCommentReply,
};
