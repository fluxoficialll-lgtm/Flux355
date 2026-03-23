
import pool from '../../pool.js';
import Log from '../../../Logs/BK.Log.Supremo.js';

const logger = Log.createLogger('Consultas.Sessao');

const criar = async (dadosSessao) => {
    const { id, user_id, token, expires_at, user_agent, ip_address, created_at } = dadosSessao;
    const query = `
        INSERT INTO sessions (id, user_id, token, expires_at, user_agent, ip_address, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const params = [id, user_id, token, expires_at, user_agent, ip_address, created_at];

    try {
        const resultado = await pool.query(query, params);
        logger.info('DB_CREATE_SESSION_SUCCESS', { message: `Sessão criada para o usuário ${user_id}` });
        return resultado.rows[0];
    } catch (error) {
        logger.error('DB_CREATE_SESSION_ERROR', {
            message: 'Erro ao criar sessão no banco de dados',
            errorMessage: error.message,
            stack: error.stack,
            userId: user_id
        });
        throw new Error('Erro ao criar sessão no banco de dados');
    }
};

const encontrarPorToken = async (token) => {
    const query = 'SELECT * FROM sessions WHERE token = $1';
    
    try {
        const resultado = await pool.query(query, [token]);
        return resultado.rows[0];
    } catch (error) {
        logger.error('DB_FIND_SESSION_BY_TOKEN_ERROR', {
            message: 'Erro ao buscar sessão por token',
            errorMessage: error.message,
            stack: error.stack
        });
        throw new Error('Erro ao buscar sessão por token');
    }
};

const deletarPorToken = async (token) => {
    const query = 'DELETE FROM sessions WHERE token = $1 RETURNING *';

    try {
        const resultado = await pool.query(query, [token]);
        logger.info('DB_DELETE_SESSION_SUCCESS', { message: `Sessão com token ${token} deletada.` });
        return resultado.rows[0];
    } catch (error) {
        logger.error('DB_DELETE_SESSION_ERROR', {
            message: 'Erro ao deletar sessão por token',
            errorMessage: error.message,
            stack: error.stack
        });
        throw new Error('Erro ao deletar sessão por token');
    }
};

const consultasSessao = {
    criar,
    encontrarPorToken,
    deletarPorToken
};

export default consultasSessao;
