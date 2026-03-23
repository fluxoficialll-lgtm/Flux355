
import servicoUsuario from '../ServicosBackend/Servico.Usuario.js';
import ServicoResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import Log from '../Logs/BK.Log.Supremo.js';
import validadorUsuario from '../validators/Validator.Estrutura.Usuario.js';

const logger = Log.createLogger('Controle.Usuario');

const atualizarPerfil = async (req, res) => {
    const idUsuario = req.user.id;

    try {
        const dadosValidados = validadorUsuario.validarAtualizacaoPerfil(req.body);
        logger.info('INICIANDO_ATUALIZACAO_PERFIL', { userId: idUsuario });

        const usuarioAtualizado = await servicoUsuario.atualizarPerfilUsuario(idUsuario, dadosValidados);

        logger.info('PERFIL_ATUALIZADO_SUCESSO', { userId: idUsuario });

        return ServicoResposta.sucesso(res, { user: usuarioAtualizado.paraRespostaHttp() });

    } catch (error) {
        logger.error('FALHA_ATUALIZACAO_PERFIL', { userId: idUsuario, errorMessage: error.message });
        return ServicoResposta.requisiçãoInválida(res, error.message);
    }
};

const obterPerfil = async (req, res) => {
    const idUsuario = req.params.id;

    try {
        logger.info('BUSCANDO_PERFIL_USUARIO', { userId: idUsuario });

        const usuario = await servicoUsuario.encontrarUsuarioPorId(idUsuario);

        if (!usuario) {
            return ServicoResposta.nãoEncontrado(res, "Usuário não encontrado");
        }

        return ServicoResposta.sucesso(res, { user: usuario.paraRespostaHttp() });

    } catch (error) {
        logger.error('FALHA_BUSCAR_PERFIL', { userId: idUsuario, errorMessage: error.message });
        return ServicoResposta.erro(res, "Falha ao buscar perfil do usuário");
    }
}

export default {
    atualizarPerfil,
    obterPerfil
};
