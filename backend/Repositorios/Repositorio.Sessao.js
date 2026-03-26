
import consultasSessao from '../database/GestaoDeDados/PostgreSQL/Consultas.Sessao.js';
import createRepositoryLogger from '../config/Log.Repositorios.js';

const logger = createRepositoryLogger('Repositorio.Sessao.js');

const criar = async (dadosSessao) => {
    logger.info(`Iniciando criação de sessão para o usuário ${dadosSessao.user_id}.`);
    try {
        const novaSessao = await consultasSessao.criar(dadosSessao);
        logger.info(`Sessão para o usuário ${dadosSessao.user_id} criada com sucesso.`);
        return novaSessao;
    } catch (error) {
        logger.error(`Erro ao criar sessão para o usuário ${dadosSessao.user_id}.`, { error });
        throw error;
    }
};

const encontrarPorToken = async (token) => {
    logger.info('Buscando sessão por token.');
    try {
        const sessao = await consultasSessao.encontrarPorToken(token);
        if (sessao) {
            logger.info('Sessão encontrada por token.');
        } else {
            logger.info('Sessão não encontrada por token.');
        }
        return sessao;
    } catch (error) {
        logger.error('Erro ao buscar sessão por token.', { error });
        throw error;
    }
};

const deletarPorToken = async (token) => {
    logger.info('Deletando sessão por token.');
    try {
        const sessaoDeletada = await consultasSessao.deletarPorToken(token);
        if (sessaoDeletada) {
            logger.info('Sessão deletada com sucesso.');
        } else {
            logger.info('Sessão não encontrada para deleção.');
        }
        return sessaoDeletada;
    } catch (error) {
        logger.error('Erro ao deletar sessão por token.', { error });
        throw error;
    }
};

const repositorioSessao = {
    criar,
    encontrarPorToken,
    deletarPorToken
};

export default repositorioSessao;
