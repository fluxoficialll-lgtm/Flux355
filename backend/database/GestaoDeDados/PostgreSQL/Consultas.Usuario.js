
import pool from '../../Processo.Conexao.Banco.Dados.js';
import createQueryLogger from '../../../config/Log.Queries.js';

const logger = createQueryLogger('Consultas.Usuario.js');

const criar = async (dadosUsuario) => {
    const cliente = await pool.connect();
    const { 
        id, name, email, password_hash, google_id, 
        nickname, bio, website, photo_url, is_private, profile_completed 
    } = dadosUsuario;

    const query = `
        INSERT INTO users (
            id, name, email, password_hash, google_id, 
            nickname, bio, website, photo_url, is_private, profile_completed
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id;
    `;
    const values = [
        id, name, email, password_hash, google_id, 
        nickname, bio, website, photo_url, is_private, profile_completed
    ];

    try {
        await cliente.query('BEGIN');
        logger.info(`Iniciando transação para criar novo usuário com e-mail ${email}.`);

        await cliente.query(query, values);
        logger.info(`Inserido na tabela users para o usuário ${id}.`);

        await cliente.query('COMMIT');
        logger.info(`Transação concluída. Usuário ${id} criado com sucesso.`);

        return await encontrarPorId(id, cliente); 

    } catch (error) {
        await cliente.query('ROLLBACK');
        logger.error(`Erro na transação de criação de usuário. Rollback executado para o e-mail ${email}.`, { error });
        if (error.code === '23505') {
            throw new Error('Email, nickname ou ID do Google já está em uso.');
        }
        throw new Error('Erro ao registrar usuário no banco de dados');
    } finally {
        cliente.release();
    }
};

const encontrarPorId = async (id, cliente = pool) => {
    const query = `SELECT * FROM users WHERE id = $1`;
    logger.info(`Buscando usuário com o id: ${id}`);
    
    try {
        const { rows } = await cliente.query(query, [id]);
        return rows[0];
    } catch (error) {
        logger.error(`Erro ao buscar usuário por ID ${id}`, { error });
        throw new Error('Erro ao buscar usuário no banco de dados');
    }
}

const encontrarPorEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    logger.info(`Buscando usuário com o email: ${email}`);
    
    try {
        const { rows } = await pool.query(query, [email]);
        return rows[0];
    } catch (error) {
        logger.error(`Erro ao buscar usuário por email ${email}`, { error });
        throw new Error('Erro ao buscar usuário no banco de dados');
    }
};

const encontrarPorGoogleId = async (googleId) => {
    const query = `SELECT * FROM users WHERE google_id = $1`;
    logger.info(`Buscando usuário com o Google ID: ${googleId}`);

    try {
        const { rows } = await pool.query(query, [googleId]);
        return rows[0];
    } catch (error) {
        logger.error(`Erro ao buscar usuário por Google ID ${googleId}`, { error });
        throw new Error('Erro ao buscar usuário no banco de dados');
    }
};

const atualizar = async (idUsuario, dados) => {
    const cliente = await pool.connect();

    try {
        await cliente.query('BEGIN');
        logger.info(`Iniciando transação para atualizar o usuário ${idUsuario}.`);

        if (Object.keys(dados).length > 0) {
            const { query, values } = buildUpdateQuery('users', dados, 'id', idUsuario);
            await cliente.query(query, values);
            logger.info(`Tabela 'users' atualizada para o usuário ${idUsuario}.`);
        }

        await cliente.query('COMMIT');
        logger.info(`Transação de atualização para o usuário ${idUsuario} concluída.`);
        
        return await encontrarPorId(idUsuario, cliente);

    } catch (error) {
        await cliente.query('ROLLBACK');
        logger.error(`Erro na transação de atualização. Rollback para o usuário ${idUsuario}.`, { error });
        throw new Error('Erro ao atualizar usuário no banco de dados');
    } finally {
        cliente.release();
    }
};

const deletar = async (id) => {
    const cliente = await pool.connect();
    try {
        await cliente.query('BEGIN');
        await cliente.query('DELETE FROM users WHERE id = $1', [id]);
        await cliente.query('COMMIT');
        return true;
    } catch (error) {
        await cliente.query('ROLLBACK');
        logger.error(`Erro ao deletar usuário ${id}`, { error });
        return false;
    } finally {
        cliente.release();
    }
};

const buildUpdateQuery = (tabela, dados, colunaId, idUsuario) => {
    const fields = Object.keys(dados);
    const values = Object.values(dados);
    const setClause = [...fields.map((field, index) => `"${field}" = $${index + 1}`), `"updated_at" = NOW()`].join(', ');
    
    const query = `UPDATE ${tabela} SET ${setClause} WHERE "${colunaId}" = $${fields.length + 1}`;
    
    return { query, values: [...values, idUsuario] };
};

const consultasUsuario = {
    criar,
    encontrarPorEmail,
    encontrarPorGoogleId,
    encontrarPorId, 
    atualizar,
    deletar
};

export default consultasUsuario;
