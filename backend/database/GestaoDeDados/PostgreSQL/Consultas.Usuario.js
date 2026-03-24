
import pool from '../../pool.js';
import * as Log from '../../../Logs/BK.Log.Supremo.js';

const criar = async (dadosUsuario) => {
    const cliente = await pool.connect();
    
    const { 
        id, name, email, password_hash, google_id, 
        nickname, bio, website, photo_url, is_private, profile_completed 
    } = dadosUsuario;

    const queryUser = `
        INSERT INTO users (id, name, email, password_hash, google_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
    `;
    const valuesUser = [id, name, email, password_hash, google_id];

    const queryProfile = `
        INSERT INTO profiles (user_id, nickname, bio, website, photo_url, is_private, profile_completed)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;
    const valuesProfile = [id, nickname, bio, website, photo_url, is_private, profile_completed];

    try {
        await cliente.query('BEGIN');
        Log.database.info('Iniciando transação para criar novo usuário.', { event: 'DB_TX_CREATE_USER_BEGIN', email });

        await cliente.query(queryUser, valuesUser);
        Log.database.debug('Inserido na tabela users.', { event: 'DB_TX_CREATE_USER_INSERT_USERS', userId: id });

        await cliente.query(queryProfile, valuesProfile);
        Log.database.debug('Inserido na tabela profiles.', { event: 'DB_TX_CREATE_USER_INSERT_PROFILES', userId: id });

        await cliente.query('COMMIT');
        Log.database.info('Transação concluída. Usuário criado com sucesso.', { event: 'DB_TX_CREATE_USER_COMMIT', userId: id });

        // Após criar, busca o usuário completo para retornar
        return await encontrarPorId(id, cliente); 

    } catch (error) {
        await cliente.query('ROLLBACK');
        Log.database.error('Erro na transação de criação de usuário. Rollback executado.', {
            event: 'DB_TX_CREATE_USER_ROLLBACK',
            errorMessage: error.message,
            stack: error.stack,
            errorCode: error.code
        });
        if (error.code === '23505') { // unique_violation
            throw new Error('Email ou ID do Google já está em uso.');
        }
        throw new Error('Erro ao registrar usuário no banco de dados');
    } finally {
        cliente.release();
    }
};

const queryJoin = `
    SELECT
        u.id, u.name, u.email, u.google_id, u.password_hash,
        p.nickname, p.bio, p.website, p.photo_url, p.is_private, p.profile_completed,
        u.created_at, u.updated_at
    FROM
        users u
    LEFT JOIN
        profiles p ON u.id = p.user_id
`;

const encontrarPorId = async (id, cliente = pool) => {
    const query = `${queryJoin} WHERE u.id = $1`;
    Log.database.info(`Buscando usuário com o id: ${id}`, { event: 'DB_FIND_USER_BY_ID_START' });
    
    try {
        const { rows } = await cliente.query(query, [id]);
        return rows[0];
    } catch (error) {
        Log.database.error('Erro ao buscar usuário por ID', {
            event: 'DB_FIND_USER_BY_ID_ERROR',
            errorMessage: error.message,
            stack: error.stack,
            userId: id
        });
        throw new Error('Erro ao buscar usuário no banco de dados');
    }
}

const encontrarPorEmail = async (email) => {
    const query = `${queryJoin} WHERE u.email = $1`;
    Log.database.info(`Buscando usuário com o email: ${email}`, { event: 'DB_FIND_USER_BY_EMAIL_START' });
    
    try {
        const { rows } = await pool.query(query, [email]);
        return rows[0];
    } catch (error) {
        Log.database.error('Erro ao buscar usuário por email', {
            event: 'DB_FIND_USER_BY_EMAIL_ERROR',
            errorMessage: error.message,
            stack: error.stack,
            email
        });
        throw new Error('Erro ao buscar usuário no banco de dados');
    }
};

const encontrarPorGoogleId = async (googleId) => {
    const query = `${queryJoin} WHERE u.google_id = $1`;
    Log.database.info(`Buscando usuário com o Google ID: ${googleId}`, { event: 'DB_FIND_USER_BY_GOOGLE_ID_START' });

    try {
        const { rows } = await pool.query(query, [googleId]);
        return rows[0];
    } catch (error) {
        Log.database.error('Erro ao buscar usuário por Google ID', {
            event: 'DB_FIND_USER_BY_GOOGLE_ID_ERROR',
            errorMessage: error.message,
            stack: error.stack,
            googleId
        });
        throw new Error('Erro ao buscar usuário no banco de dados');
    }
};

const atualizar = async (idUsuario, dados) => {
    const cliente = await pool.connect();

    const camposTabelaUser = ['name', 'email', 'password_hash'];
    const camposTabelaProfile = ['nickname', 'bio', 'website', 'photo_url', 'is_private', 'profile_completed'];

    const dadosUser = {};
    const dadosProfile = {};

    Object.keys(dados).forEach(key => {
        if (camposTabelaUser.includes(key)) {
            dadosUser[key] = dados[key];
        } else if (camposTabelaProfile.includes(key)) {
            dadosProfile[key] = dados[key];
        }
    });

    try {
        await cliente.query('BEGIN');
        Log.database.info(`Iniciando transação para atualizar o usuário ${idUsuario}.`, { event: 'DB_TX_UPDATE_USER_BEGIN' });

        if (Object.keys(dadosUser).length > 0) {
            const queryUser = buildUpdateQuery('users', dadosUser, 'id', idUsuario);
            await cliente.query(queryUser.query, queryUser.values);
            Log.database.debug("Tabela 'users' atualizada.", { event: 'DB_TX_UPDATE_USER_USERS_UPDATED', userId: idUsuario });
        }

        if (Object.keys(dadosProfile).length > 0) {
            const queryProfile = buildUpdateQuery('profiles', dadosProfile, 'user_id', idUsuario);
            await cliente.query(queryProfile.query, queryProfile.values);
            Log.database.debug("Tabela 'profiles' atualizada.", { event: 'DB_TX_UPDATE_USER_PROFILES_UPDATED', userId: idUsuario });
        }

        await cliente.query('COMMIT');
        Log.database.info(`Transação de atualização para o usuário ${idUsuario} concluída.`, { event: 'DB_TX_UPDATE_USER_COMMIT' });
        
        return await encontrarPorId(idUsuario, cliente);

    } catch (error) {
        await cliente.query('ROLLBACK');
        Log.database.error(`Erro na transação de atualização. Rollback para o usuário ${idUsuario}.`, {
            event: 'DB_TX_UPDATE_USER_ROLLBACK',
            errorMessage: error.message,
            stack: error.stack,
            userId: idUsuario
        });
        throw new Error('Erro ao atualizar usuário no banco de dados');
    } finally {
        cliente.release();
    }
};

const buildUpdateQuery = (tabela, dados, colunaId, idUsuario) => {
    const fields = Object.keys(dados);
    const values = Object.values(dados);
    const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');
    
    const query = `UPDATE ${tabela} SET ${setClause} WHERE ${colunaId} = $${fields.length + 1}`;
    
    return { query, values: [...values, idUsuario] };
}


const consultasUsuario = {
    criar,
    encontrarPorEmail,
    encontrarPorGoogleId,
    atualizar,
};

export default consultasUsuario;
