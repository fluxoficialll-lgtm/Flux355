
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import Log from '../Logs/BK.Log.Supremo.js';
import ServicoGruposConfig from '../ServicosBackend/Servico.Grupos.Configuracoes.js';

const logger = Log.createLogger('Controles.Grupos.Configuracoes');

class GruposConfiguracoesControle {

    async atualizarConfiguracoes(req, res) {
        const { groupId } = req.params;
        const configuracoes = req.body;

        try {
            logger.info(`Atualizando configurações para o grupo ${groupId}`, { configuracoes });
            const resultado = await ServicoGruposConfig.atualizarConfiguracoes(groupId, configuracoes);
            return ServicoHTTPResposta.sucesso(res, resultado);
        } catch (error) {
            logger.error('GROUP_SETTINGS_UPDATE_ERROR', { errorMessage: error.message, groupId });
            return ServicoHTTPResposta.erro(res, 'Falha ao atualizar configurações do grupo.', 500, error.message);
        }
    }

    async obterConfiguracoes(req, res) {
        const { groupId } = req.params;
        try {
            logger.info(`Obtendo configurações para o grupo ${groupId}`);
            const resultado = await ServicoGruposConfig.obterConfiguracoes(groupId);
            if(!resultado) {
                return ServicoHTTPResposta.naoEncontrado(res, "Configurações do grupo não encontradas");
            }
            return ServicoHTTPResposta.sucesso(res, resultado);
        } catch (error) {
            logger.error('GROUP_SETTINGS_GET_ERROR', { errorMessage: error.message, groupId });
            return ServicoHTTPResposta.erro(res, 'Falha ao obter configurações do grupo.', 500, error.message);
        }
    }
    
    async obterEstatisticas(req, res) {
        const { groupId } = req.params;
        try {
            logger.info(`Obtendo estatísticas para o grupo ${groupId}`);
            const resultado = {};
            return ServicoHTTPResposta.sucesso(res, resultado);
        } catch (error) {
            logger.error('GROUP_STATS_GET_ERROR', { errorMessage: error.message, groupId });
            return ServicoHTTPResposta.erro(res, 'Falha ao obter estatísticas do grupo.', 500, error.message);
        }
    }

    async obterDiretrizes(req, res) {
        const { groupId } = req.params;
        try {
            logger.info(`Obtendo diretrizes para o grupo ${groupId}`);
            const resultado = await ServicoGruposConfig.obterDiretrizes(groupId);
            if(!resultado) {
                return ServicoHTTPResposta.naoEncontrado(res, "Diretrizes do grupo não encontradas");
            }
            return ServicoHTTPResposta.sucesso(res, resultado);
        } catch (error) {
            logger.error('GROUP_GUIDELINES_GET_ERROR', { errorMessage: error.message, groupId });
            return ServicoHTTPResposta.erro(res, 'Falha ao obter diretrizes do grupo.', 500, error.message);
        }
    }

    async atualizarDiretrizes(req, res) {
        const { groupId } = req.params;
        const { diretrizes } = req.body;

        try {
            logger.info(`Atualizando diretrizes para o grupo ${groupId}`);
            const resultado = await ServicoGruposConfig.atualizarDiretrizes(groupId, diretrizes);
            return ServicoHTTPResposta.sucesso(res, resultado);
        } catch (error) {
            logger.error('GROUP_GUIDELINES_UPDATE_ERROR', { errorMessage: error.message, groupId });
            return ServicoHTTPResposta.erro(res, 'Falha ao atualizar diretrizes do grupo.', 500, error.message);
        }
    }

}

export default new GruposConfiguracoesControle();
