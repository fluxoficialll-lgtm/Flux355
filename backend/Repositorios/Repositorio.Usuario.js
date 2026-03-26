
import userQueries from '../database/GestaoDeDados/PostgreSQL/Consultas.Usuario.js';
import createRepositoryLogger from '../config/Log.Repositorios.js';
import Usuario from '../models/Models.Estrutura.Usuario.js'; // Importando a entidade

const logger = createRepositoryLogger('Repositorio.Usuario.js');

const createUser = async (userData) => {
    logger.info(`Iniciando criação de usuário com e-mail ${userData.email}.`);
    try {
        const newUserRaw = await userQueries.criar(userData);
        logger.info(`Usuário ${newUserRaw.id} criado no banco de dados.`);
        const newUser = Usuario.deBancoDeDados(newUserRaw); // Convertendo para entidade
        logger.info(`Entidade de usuário para ${newUser.email} criada com sucesso.`);
        return newUser;
    } catch (error) {
        logger.error(`Erro ao criar usuário com e-mail ${userData.email}.`, { error });
        throw error;
    }
};

const findByEmail = async (email) => {
    logger.info(`Buscando usuário por e-mail ${email}.`);
    try {
        const userRaw = await userQueries.encontrarPorEmail(email);
        if (userRaw) {
            logger.info(`Dados do usuário com e-mail ${email} encontrados no banco.`);
            const user = Usuario.deBancoDeDados(userRaw); // Convertendo para entidade
            logger.info(`Entidade de usuário para ${email} criada com sucesso.`);
            return user;
        } else {
            logger.info(`Usuário com e-mail ${email} não encontrado.`);
            return null;
        }
    } catch (error) {
        logger.error(`Erro ao buscar usuário por e-mail ${email}.`, { error });
        throw error;
    }
};

const findByGoogleId = async (googleId) => {
    logger.info(`Buscando usuário por Google ID.`);
    try {
        const userRaw = await userQueries.encontrarPorGoogleId(googleId);
        if (userRaw) {
            logger.info(`Dados do usuário com Google ID encontrados no banco.`);
            const user = Usuario.deBancoDeDados(userRaw); // Convertendo para entidade
            logger.info(`Entidade de usuário para o Google ID criada com sucesso.`);
            return user;
        } else {
            logger.info(`Usuário com Google ID não encontrado.`);
            return null;
        }
    } catch (error) {
        logger.error(`Erro ao buscar usuário por Google ID.`, { error });
        throw error;
    }
};

const updateUser = async (userId, updateData) => {
    logger.info(`Atualizando usuário ${userId}.`);
    try {
        const updatedUserRaw = await userQueries.atualizar(userId, updateData);
        logger.info(`Usuário ${userId} atualizado com sucesso no banco de dados.`);
        const updatedUser = Usuario.deBancoDeDados(updatedUserRaw); // Convertendo para entidade
        logger.info(`Entidade de usuário atualizada para ${userId} criada com sucesso.`);
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
