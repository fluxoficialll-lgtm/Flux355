
import Log from '../Logs/BK.Log.Supremo.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import ServicoCriacaoGrupoPrivado from '../ServicosBackend/Servicos.Criacao.Grupo.Privado.js';
import { validarCriacaoGrupo } from '../validators/Validator.Estrutura.Grupo.js';

const logger = Log.createLogger('PrivateGroup');

class ControleCriacaoGrupoPrivado {
    async handle(req, res) {
        const donoId = req.user.id;

        try {
            const dadosParaValidar = {
                ...req.body,
                donoId,
                tipo: 'privado'
            };
            const dadosValidados = validarCriacaoGrupo(dadosParaValidar);

            logger.info('GROUP_PRIVATE_CREATE_START', { donoId, nome: dadosValidados.nome });

            const grupoSalvo = await ServicoCriacaoGrupoPrivado.criar(dadosValidados);

            logger.info('GROUP_PRIVATE_CREATE_SUCCESS', { groupId: grupoSalvo.id, donoId });

            const resposta = grupoSalvo.paraRespostaHttp ? grupoSalvo.paraRespostaHttp() : grupoSalvo;
            return ServicoHTTPResposta.sucesso(res, resposta, 201);

        } catch (error) {
            logger.error('GROUP_PRIVATE_CREATE_ERROR', {
                errorMessage: error.message,
                donoId,
                requestBody: req.body
            });

            return ServicoHTTPResposta.erro(res, error.message, 400);
        }
    }
}

export default new ControleCriacaoGrupoPrivado();
