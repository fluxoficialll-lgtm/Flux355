
import Log from '../Logs/BK.Log.Supremo.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import ServicoMetricasPublicacaoReels from '../ServicosBackend/Servicos.Metricas.Publicacao.Reels.js';

const logger = Log.createLogger('ReelsPostMetrics');

class ControlesMetricasPublicacaoReels {
    async getReelMetrics(req, res, next) {
        const { reelId } = req.params;
        logger.info('METRIC_REEL_GET_START', { reelId });

        try {
            const metrics = await ServicoMetricasPublicacaoReels.getReelMetrics(reelId);
            logger.info('METRIC_REEL_GET_SUCCESS', { reelId });
            return ServicoHTTPResposta.sucesso(res, metrics);
        } catch (error) {
            logger.error('METRIC_REEL_GET_ERROR', { errorMessage: error.message, reelId });
            return ServicoHTTPResposta.erro(res, 'Failed to fetch reel metrics', 500, error.message);
        }
    }
}

export default new ControlesMetricasPublicacaoReels();
