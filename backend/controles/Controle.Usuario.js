
// backend/controles/Controle.Usuario.js
import servicoUsuario from '../ServicosBackend/Servico.Usuario.js';
import ServicoResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import validadorUsuario from '../validators/Validator.Estrutura.Usuario.js';
import createControllerLogger from '../config/Log.Controles.js';

const logger = createControllerLogger('Controle.Usuario.js');

const atualizarPerfil = async (req, res, next) => {
    const idUsuario = req.user.id;
    logger.info(`Iniciando atualização de perfil para o usuário ${idUsuario}.`, { userId: idUsuario, body: req.body });

    try {
        const dadosValidados = validadorUsuario.validarAtualizacaoPerfil(req.body);
        const usuarioAtualizado = await servicoUsuario.atualizarPerfilUsuario(idUsuario, dadosValidados);

        logger.info(`Perfil do usuário ${idUsuario} atualizado com sucesso.`, { userId: idUsuario });
        return ServicoResposta.sucesso(res, { user: usuarioAtualizado.paraRespostaHttp() });

    } catch (error) {
        logger.error(`Erro ao atualizar o perfil do usuário ${idUsuario}:`, { userId: idUsuario, error });
        next(error);
    }
};

const obterPerfil = async (req, res, next) => {
    const idUsuario = req.params.id;
    logger.info(`Buscando perfil do usuário ${idUsuario}.`, { userId: idUsuario });

    try {
        const usuario = await servicoUsuario.encontrarUsuarioPorId(idUsuario);

        if (!usuario) {
            logger.warn(`Usuário com ID ${idUsuario} não encontrado.`, { userId: idUsuario });
            return ServicoResposta.naoEncontrado(res, "Usuário não encontrado");
        }

        logger.info(`Perfil do usuário ${idUsuario} encontrado com sucesso.`, { userId: idUsuario });
        return ServicoResposta.sucesso(res, { user: usuario.paraRespostaHttp() });

    } catch (error) {
        logger.error(`Erro ao buscar o perfil do usuário ${idUsuario}:`, { userId: idUsuario, error });
        next(error);
    }
}

export default {
    atualizarPerfil,
    obterPerfil
};
