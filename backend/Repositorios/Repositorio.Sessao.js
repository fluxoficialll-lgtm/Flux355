
// backend/Repositorios/Repositorio.Sessao.js

import consultasSessao from '../database/GestaoDeDados/PostgreSQL/Consultas.Sessao.js';
import Log from '../Logs/BK.Log.Supremo.js';

const logger = Log.createLogger('Repositorio.Sessao');

const criar = async (dadosSessao) => {
    logger.info('DB_CREATE_SESSION_START', { message: 'Chamando camada de gestão de dados para criar sessão.' });
    try {
        const novaSessao = await consultasSessao.criar(dadosSessao);
        logger.info('DB_CREATE_SESSION_SUCCESS', { message: 'Sessão criada com sucesso na gestão de dados.' });
        return novaSessao;
    } catch (error) {
        logger.error('DB_CREATE_SESSION_ERROR', { 
            message: 'Erro ao criar sessão na gestão de dados',
            errorMessage: error.message,
            stack: error.stack
        });
        throw error;
    }
};

const encontrarPorToken = async (token) => {
    logger.info('DB_FIND_SESSION_BY_TOKEN_START', { message: 'Chamando camada de gestão de dados para buscar sessão por token.' });
    try {
        const sessao = await consultasSessao.encontrarPorToken(token);
        logger.info(sessao ? 'DB_FIND_SESSION_BY_TOKEN_FOUND' : 'DB_FIND_SESSION_BY_TOKEN_NOT_FOUND', { 
            message: sessao ? 'Sessão encontrada.' : 'Sessão não encontrada.'
        });
        return sessao;
    } catch (error) {
        logger.error('DB_FIND_SESSION_BY_TOKEN_ERROR', { 
            message: 'Erro ao buscar sessão por token na gestão de dados',
            errorMessage: error.message,
            stack: error.stack
        });
        throw error;
    }
};

const deletarPorToken = async (token) => {
    logger.info('DB_DELETE_SESSION_BY_TOKEN_START', { message: 'Chamando camada de gestão de dados para deletar sessão por token.' });
    try {
        const sessaoDeletada = await consultasSessao.deletarPorToken(token);
        logger.info(sessaoDeletada ? 'DB_DELETE_SESSION_SUCCESS' : 'DB_DELETE_SESSION_NOT_FOUND', { 
            message: sessaoDeletada ? 'Sessão deletada com sucesso.' : 'Sessão não encontrada para deleção.'
        });
        return sessaoDeletada;
    } catch (error) {
        logger.error('DB_DELETE_SESSION_ERROR', { 
            message: 'Erro ao deletar sessão por token na gestão de dados',
            errorMessage: error.message,
            stack: error.stack
         });
        throw error;
    }
};


const repositorioSessao = {
    criar,
    encontrarPorToken,
    deletarPorToken
};

export default repositorioSessao;
