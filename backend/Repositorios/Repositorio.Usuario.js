
import userQueries from '../database/GestaoDeDados/PostgreSQL/Consultas.Usuario.js';
import createRepositoryLogger from '../config/Log.Repositorios.js';

const logger = createRepositoryLogger('Repositorio.Usuario.js');

const createUser = async (userData) => {
    logger.info(`Iniciando criação de usuário com e-mail ${userData.email}.`);
    try {
        const newUser = await userQueries.criar(userData);
        logger.info(`Usuário ${newUser.id} criado com sucesso.`);
        return newUser;
    } catch (error) {
        logger.error(`Erro ao criar usuário com e-mail ${userData.email}.`, { error });
        throw error;
    }
};

const findByEmail = async (email) => {
    logger.info(`Buscando usuário por e-mail ${email}.`);
    try {
        const user = await userQueries.encontrarPorEmail(email);
        if (user) {
            logger.info(`Usuário com e-mail ${email} encontrado.`);
        } else {
            logger.info(`Usuário com e-mail ${email} não encontrado.`);
        }
        return user;
    } catch (error) {
        logger.error(`Erro ao buscar usuário por e-mail ${email}.`, { error });
        throw error;
    }
};

const findByGoogleId = async (googleId) => {
    logger.info(`Buscando usuário por Google ID.`);
    try {
        const user = await userQueries.encontrarPorGoogleId(googleId);
        if (user) {
            logger.info(`Usuário com Google ID encontrado.`);
        } else {
            logger.info(`Usuário com Google ID não encontrado.`);
        }
        return user;
    } catch (error) {
        logger.error(`Erro ao buscar usuário por Google ID.`, { error });
        throw error;
    }
};

const updateUser = async (userId, updateData) => {
    logger.info(`Atualizando usuário ${userId}.`);
    try {
        const updatedUser = await userQueries.atualizar(userId, updateData);
        logger.info(`Usuário ${userId} atualizado com sucesso.`);
        return updatedUser;
    } catch (error) {
        logger.error(`Erro ao atualizar usuário ${userId}.`, { error });
        throw error;
    }
};

const userRepository = {
    createUser,
    findByEmail,
    findByGoogleId,
    updateUser,
};

export default userRepository;
