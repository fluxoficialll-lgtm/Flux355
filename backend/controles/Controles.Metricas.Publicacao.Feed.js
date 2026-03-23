
import Log from '../Logs/BK.Log.Supremo.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import { getPostMetrics as getPostMetricsService } from '../ServicosBackend/Servicos.Metricas.Publicacao.Feed.js';

const logger = Log.createLogger('FeedPostMetrics');

export const getPostMetrics = async (req, res, next) => {
    const { postId } = req.params;
    logger.info('METRIC_POST_GET_START', { postId });

    try {
        const metrics = await getPostMetricsService(postId);
        logger.info('METRIC_POST_GET_SUCCESS', { postId });
        return ServicoHTTPResposta.sucesso(res, metrics);
    } catch (error) {
        logger.error('METRIC_POST_GET_ERROR', { errorMessage: error.message, postId });
        return ServicoHTTPResposta.erro(res, 'Failed to fetch post metrics', 500, error.message);
    }
};
