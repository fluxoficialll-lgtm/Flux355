
import Log from '../Logs/BK.Log.Supremo.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import * as reelsCommentMetricsService from '../ServicosBackend/Servicos.Metricas.Comentario.Reels.js';

const logger = Log.createLogger('ReelsCommentMetrics');

async function trackComment(req, res) {
    const { commentData } = req.body;
    logger.info('METRIC_COMMENT_TRACK_START', { reelId: commentData?.reelId });

    try {
        await reelsCommentMetricsService.trackComment(commentData);
        logger.info('METRIC_COMMENT_TRACK_SUCCESS', { reelId: commentData?.reelId });
        return ServicoHTTPResposta.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        logger.error('METRIC_COMMENT_TRACK_ERROR', { errorMessage: error.message, data: commentData });
        return ServicoHTTPResposta.erro(res, 'Error tracking metric', 500, error.message);
    }
}

async function trackCommentLike(req, res) {
    const { commentId } = req.body;
    logger.info('METRIC_COMMENT_LIKE_TRACK_START', { commentId });

    try {
        await reelsCommentMetricsService.trackCommentLike(commentId);
        logger.info('METRIC_COMMENT_LIKE_TRACK_SUCCESS', { commentId });
        return ServicoHTTPResposta.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        logger.error('METRIC_COMMENT_LIKE_TRACK_ERROR', { errorMessage: error.message, commentId });
        return ServicoHTTPResposta.erro(res, 'Error tracking metric', 500, error.message);
    }
}

async function trackCommentReply(req, res) {
    const { commentId, replyData } = req.body;
    logger.info('METRIC_COMMENT_REPLY_TRACK_START', { commentId });

    try {
        await reelsCommentMetricsService.trackCommentReply(commentId, replyData);
        logger.info('METRIC_COMMENT_REPLY_TRACK_SUCCESS', { commentId });
        return ServicoHTTPResposta.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        logger.error('METRIC_COMMENT_REPLY_TRACK_ERROR', { errorMessage: error.message, commentId, data: replyData });
        return ServicoHTTPResposta.erro(res, 'Error tracking metric', 500, error.message);
    }
}

export {
    trackComment,
    trackCommentLike,
    trackCommentReply,
};
