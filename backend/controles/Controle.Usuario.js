
// backend/controles/Controle.Usuario.js
import servicoUsuario from '../ServicosBackend/Servico.Usuario.js';
import ServicoResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import * as Log from '../Logs/BK.Log.Supremo.js';
import validadorUsuario from '../validators/Validator.Estrutura.Usuario.js';

const atualizarPerfil = async (req, res) => {
    const idUsuario = req.user.id;

    try {
        const dadosValidados = validadorUsuario.validarAtualizacaoPerfil(req.body);
        Log.controller.info('Iniciando atualização de perfil', { event: 'INICIANDO_ATUALIZACAO_PERFIL', userId: idUsuario });

        const usuarioAtualizado = await servicoUsuario.atualizarPerfilUsuario(idUsuario, dadosValidados);

        Log.controller.info('Perfil atualizado com sucesso', { event: 'PERFIL_ATUALIZADO_SUCESSO', userId: idUsuario });

        return ServicoResposta.sucesso(res, { user: usuarioAtualizado.paraRespostaHttp() });

    } catch (error) {
        Log.controller.error('Falha na atualização de perfil', { event: 'FALHA_ATUALIZACAO_PERFIL', userId: idUsuario, errorMessage: error.message });
        return ServicoResposta.requisiçãoInválida(res, error.message);
    }
};

const obterPerfil = async (req, res) => {
    const idUsuario = req.params.id;

    try {
        Log.controller.info('Buscando perfil de usuário', { event: 'BUSCANDO_PERFIL_USUARIO', userId: idUsuario });

        const usuario = await servicoUsuario.encontrarUsuarioPorId(idUsuario);

        if (!usuario) {
            return ServicoResposta.nãoEncontrado(res, "Usuário não encontrado");
        }

        return ServicoResposta.sucesso(res, { user: usuario.paraRespostaHttp() });

    } catch (error) {
        Log.controller.error('Falha ao buscar perfil', { event: 'FALHA_BUSCAR_PERFIL', userId: idUsuario, errorMessage: error.message });
        return ServicoResposta.erro(res, "Falha ao buscar perfil do usuário");
    }
}

export default {
    atualizarPerfil,
    obterPerfil
};
