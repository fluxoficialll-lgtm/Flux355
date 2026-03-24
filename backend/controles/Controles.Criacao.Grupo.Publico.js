
import * as Log from '../Logs/BK.Log.Supremo.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import ServicoCriacaoGrupoPublico from '../ServicosBackend/Servicos.Criacao.Grupo.Publico.js';
import { validarCriacaoGrupo } from '../validators/Validator.Estrutura.Grupo.js';

class ControleCriacaoGrupoPublico {
    async handle(req, res) {
        const donoId = req.user.id;

        try {
            const dadosParaValidar = {
                ...req.body,
                donoId,
                tipo: 'publico'
            };
            const dadosValidados = validarCriacaoGrupo(dadosParaValidar);

            Log.controller.info('Iniciando criação de grupo público', { event: 'GROUP_PUBLIC_CREATE_START', donoId, nome: dadosValidados.nome });

            const grupoSalvo = await ServicoCriacaoGrupoPublico.criar(dadosValidados);

            Log.controller.info('Grupo público criado com sucesso', { event: 'GROUP_PUBLIC_CREATE_SUCCESS', groupId: grupoSalvo.id, donoId });

            const resposta = grupoSalvo.paraRespostaHttp ? grupoSalvo.paraRespostaHttp() : grupoSalvo;
            return ServicoHTTPResposta.sucesso(res, resposta, 201);

        } catch (error) {
            Log.controller.error('Erro ao criar grupo público', { 
                event: 'GROUP_PUBLIC_CREATE_ERROR',
                errorMessage: error.message,
                donoId,
                requestBody: req.body
            });

            return ServicoHTTPResposta.erro(res, error.message, 400);
        }
    }
}

export default new ControleCriacaoGrupoPublico();
