
// backend/Repositorios/Repositorio.Sessao.js

import consultasSessao from '../database/GestaoDeDados/PostgreSQL/Consultas.Sessao.js';
import * as Log from '../Logs/BK.Log.Supremo.js';

const criar = async (dadosSessao) => {
    Log.database.info('Chamando camada de gestão de dados para criar sessão.', { event: 'DB_CREATE_SESSION_START' });
    try {
        const novaSessao = await consultasSessao.criar(dadosSessao);
        Log.database.info('Sessão criada com sucesso na gestão de dados.', { event: 'DB_CREATE_SESSION_SUCCESS' });
        return novaSessao;
    } catch (error) {
        Log.database.error('Erro ao criar sessão na gestão de dados', { 
            event: 'DB_CREATE_SESSION_ERROR',
            errorMessage: error.message,
            stack: error.stack
        });
        throw error;
    }
};

const encontrarPorToken = async (token) => {
    Log.database.info('Chamando camada de gestão de dados para buscar sessão por token.', { event: 'DB_FIND_SESSION_BY_TOKEN_START' });
    try {
        const sessao = await consultasSessao.encontrarPorToken(token);
        Log.database.info(sessao ? 'Sessão encontrada.' : 'Sessão não encontrada.', { 
            event: sessao ? 'DB_FIND_SESSION_BY_TOKEN_FOUND' : 'DB_FIND_SESSION_BY_TOKEN_NOT_FOUND'
        });
        return sessao;
    } catch (error) {
        Log.database.error('Erro ao buscar sessão por token na gestão de dados', { 
            event: 'DB_FIND_SESSION_BY_TOKEN_ERROR',
            errorMessage: error.message,
            stack: error.stack
        });
        throw error;
    }
};

const deletarPorToken = async (token) => {
    Log.database.info('Chamando camada de gestão de dados para deletar sessão por token.', { event: 'DB_DELETE_SESSION_BY_TOKEN_START' });
    try {
        const sessaoDeletada = await consultasSessao.deletarPorToken(token);
        Log.database.info(sessaoDeletada ? 'Sessão deletada com sucesso.' : 'Sessão não encontrada para deleção.', { 
            event: sessaoDeletada ? 'DB_DELETE_SESSION_SUCCESS' : 'DB_DELETE_SESSION_NOT_FOUND'
        });
        return sessaoDeletada;
    } catch (error) {
        Log.database.error('Erro ao deletar sessão por token na gestão de dados', { 
            event: 'DB_DELETE_SESSION_ERROR',
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
