
import * as Log from '../Logs/BK.Log.Supremo.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import ServicoMetricasPublicacaoReels from '../ServicosBackend/Servicos.Metricas.Publicacao.Reels.js';

class ControlesMetricasPublicacaoReels {
    async getReelMetrics(req, res, next) {
        const { reelId } = req.params;
        Log.controller.info('Buscando métricas para Reel', { event: 'METRIC_REEL_GET_START', reelId });

        try {
            const metrics = await ServicoMetricasPublicacaoReels.getReelMetrics(reelId);
            Log.controller.info('Métricas para Reel obtidas com sucesso', { event: 'METRIC_REEL_GET_SUCCESS', reelId });
            return ServicoHTTPResposta.sucesso(res, metrics);
        } catch (error) {
            Log.controller.error('Erro ao buscar métricas para Reel', { event: 'METRIC_REEL_GET_ERROR', errorMessage: error.message, reelId });
            return ServicoHTTPResposta.erro(res, 'Failed to fetch reel metrics', 500, error.message);
        }
    }
}

export default new ControlesMetricasPublicacaoReels();
