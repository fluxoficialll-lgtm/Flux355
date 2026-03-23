
import pool from '../../pool.js';
import Log from '../../../Logs/BK.Log.Supremo.js';

const logger = Log.createLogger('Consultas.Usuario');

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
        logger.info('DB_TX_CREATE_USER_BEGIN', { message: "Iniciando transação para criar novo usuário.", email });

        await cliente.query(queryUser, valuesUser);
        logger.debug('DB_TX_CREATE_USER_INSERT_USERS', { message: "Inserido na tabela users.", userId: id });

        await cliente.query(queryProfile, valuesProfile);
        logger.debug('DB_TX_CREATE_USER_INSERT_PROFILES', { message: "Inserido na tabela profiles.", userId: id });

        await cliente.query('COMMIT');
        logger.info('DB_TX_CREATE_USER_COMMIT', { message: "Transação concluída. Usuário criado com sucesso.", userId: id });

        // Após criar, busca o usuário completo para retornar
        return await encontrarPorId(id, cliente); 

    } catch (error) {
        await cliente.query('ROLLBACK');
        logger.error('DB_TX_CREATE_USER_ROLLBACK', {
            message: 'Erro na transação de criação de usuário. Rollback executado.',
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
    logger.info('DB_FIND_USER_BY_ID_START', { message: `Buscando usuário com o id: ${id}` });
    
    try {
        const { rows } = await cliente.query(query, [id]);
        return rows[0];
    } catch (error) {
        logger.error('DB_FIND_USER_BY_ID_ERROR', {
            message: 'Erro ao buscar usuário por ID',
            errorMessage: error.message,
            stack: error.stack,
            userId: id
        });
        throw new Error('Erro ao buscar usuário no banco de dados');
    }
}

const encontrarPorEmail = async (email) => {
    const query = `${queryJoin} WHERE u.email = $1`;
    logger.info('DB_FIND_USER_BY_EMAIL_START', { message: `Buscando usuário com o email: ${email}` });
    
    try {
        const { rows } = await pool.query(query, [email]);
        return rows[0];
    } catch (error) {
        logger.error('DB_FIND_USER_BY_EMAIL_ERROR', {
            message: 'Erro ao buscar usuário por email',
            errorMessage: error.message,
            stack: error.stack,
            email
        });
        throw new Error('Erro ao buscar usuário no banco de dados');
    }
};

const encontrarPorGoogleId = async (googleId) => {
    const query = `${queryJoin} WHERE u.google_id = $1`;
    logger.info('DB_FIND_USER_BY_GOOGLE_ID_START', { message: `Buscando usuário com o Google ID: ${googleId}` });

    try {
        const { rows } = await pool.query(query, [googleId]);
        return rows[0];
    } catch (error) {
        logger.error('DB_FIND_USER_BY_GOOGLE_ID_ERROR', {
            message: 'Erro ao buscar usuário por Google ID',
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
        logger.info('DB_TX_UPDATE_USER_BEGIN', { message: `Iniciando transação para atualizar o usuário ${idUsuario}.` });

        if (Object.keys(dadosUser).length > 0) {
            const queryUser = buildUpdateQuery('users', dadosUser, 'id', idUsuario);
            await cliente.query(queryUser.query, queryUser.values);
            logger.debug('DB_TX_UPDATE_USER_USERS_UPDATED', { message: "Tabela 'users' atualizada.", userId: idUsuario });
        }

        if (Object.keys(dadosProfile).length > 0) {
            const queryProfile = buildUpdateQuery('profiles', dadosProfile, 'user_id', idUsuario);
            await cliente.query(queryProfile.query, queryProfile.values);
            logger.debug('DB_TX_UPDATE_USER_PROFILES_UPDATED', { message: "Tabela 'profiles' atualizada.", userId: idUsuario });
        }

        await cliente.query('COMMIT');
        logger.info('DB_TX_UPDATE_USER_COMMIT', { message: `Transação de atualização para o usuário ${idUsuario} concluída.` });
        
        return await encontrarPorId(idUsuario, cliente);

    } catch (error) {
        await cliente.query('ROLLBACK');
        logger.error('DB_TX_UPDATE_USER_ROLLBACK', {
            message: `Erro na transação de atualização. Rollback para o usuário ${idUsuario}.`,
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
