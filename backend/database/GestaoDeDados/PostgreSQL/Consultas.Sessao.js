
import pool from '../../Processo.Conexao.Banco.Dados.js';
import createQueryLogger from '../../../config/Log.Queries.js';

const logger = createQueryLogger('Consultas.Sessao.js');

const criar = async (dadosSessao) => {
    const query = `
        INSERT INTO sessions (id, user_id, token, expires_at, user_agent, ip_address)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    
    const params = [
        dadosSessao.id,
        dadosSessao.user_id,
        dadosSessao.token,
        dadosSessao.expires_at,
        dadosSessao.user_agent,
        dadosSessao.ip_address
    ];

    try {
        const resultado = await pool.query(query, params);
        logger.info(`Sessão criada com sucesso para o usuário ${dadosSessao.user_id}`);
        return resultado.rows[0];
    } catch (error) {
        logger.error(`Erro ao criar sessão no banco de dados para o usuário ${dadosSessao.user_id}`, { error });
        throw error;
    }
};

const encontrarPorToken = async (token) => {
    const query = 'SELECT * FROM sessions WHERE token = $1';
    
    try {
        const resultado = await pool.query(query, [token]);
        return resultado.rows[0];
    } catch (error) {
        logger.error('Erro ao buscar sessão por token', { error });
        throw new Error('Não foi possível buscar a sessão.');
    }
};

const deletarPorToken = async (token) => {
    const query = 'DELETE FROM sessions WHERE token = $1 RETURNING *';

    try {
        const resultado = await pool.query(query, [token]);
        if (resultado.rowCount > 0) {
            logger.info(`Sessão com token foi deletada com sucesso.`);
            return resultado.rows[0];
        }
        logger.warn(`Nenhuma sessão encontrada com o token para deletar.`);
        return null;
    } catch (error) {
        logger.error('Erro ao deletar sessão por token', { error });
        throw new Error('Não foi possível deletar a sessão.');
    }
};

const consultasSessao = {
    criar,
    encontrarPorToken,
    deletarPorToken
};

export default consultasSessao;
