
import consultasUsuario from '../database/GestaoDeDados/PostgreSQL/Consultas.Usuario.js';
import Log from '../Logs/BK.Log.Supremo.js';

const logger = Log.createLogger('Repositorio.Usuario');

const criar = async (dadosUsuario) => {
    logger.info('DB_CREATE_USER_START', { 
        message: 'Chamando camada de gestão de dados para criar usuário.',
        email: dadosUsuario.email 
    });
    try {
        const novoUsuario = await consultasUsuario.criar(dadosUsuario);
        logger.info('DB_CREATE_USER_SUCCESS', { 
            message: 'Usuário criado com sucesso na gestão de dados.',
            userId: novoUsuario.id 
        });
        return novoUsuario;
    } catch (error) {
        logger.error('DB_CREATE_USER_ERROR', { 
            message: 'Erro ao criar usuário na gestão de dados',
            errorMessage: error.message,
            stack: error.stack
        });
        throw error;
    }
};

const encontrarPorEmail = async (email) => {
    logger.info('DB_FIND_BY_EMAIL_START', { 
        message: 'Chamando camada de gestão de dados para buscar usuário por email.',
        email 
    });
    try {
        const usuario = await consultasUsuario.encontrarPorEmail(email);
        logger.info(usuario ? 'DB_FIND_BY_EMAIL_FOUND' : 'DB_FIND_BY_EMAIL_NOT_FOUND', { 
            message: usuario ? 'Usuário encontrado.' : 'Usuário não encontrado.',
            email 
        });
        return usuario;
    } catch (error) {
        logger.error('DB_FIND_BY_EMAIL_ERROR', { 
            message: 'Erro ao buscar usuário por email na gestão de dados',
            errorMessage: error.message,
            stack: error.stack
         });
        throw error;
    }
};

const encontrarPorGoogleId = async (googleId) => {
    logger.info('DB_FIND_BY_GOOGLE_ID_START', { 
        message: 'Chamando camada de gestão de dados para buscar usuário por Google ID.',
        googleId 
    });
    try {
        const usuario = await consultasUsuario.encontrarPorGoogleId(googleId);
        logger.info(usuario ? 'DB_FIND_BY_GOOGLE_ID_FOUND' : 'DB_FIND_BY_GOOGLE_ID_NOT_FOUND', { 
            message: usuario ? 'Usuário encontrado.' : 'Usuário não encontrado.',
            googleId 
        });
        return usuario;
    } catch (error) {
        logger.error('DB_FIND_BY_GOOGLE_ID_ERROR', { 
            message: 'Erro ao buscar usuário por Google ID na gestão de dados',
            errorMessage: error.message,
            stack: error.stack
         });
        throw error;
    }
};

const atualizar = async (idUsuario, dados) => {
    logger.info('DB_UPDATE_USER_START', { 
        message: 'Chamando camada de gestão de dados para atualizar usuário.',
        idUsuario 
    });
    try {
        const usuarioAtualizado = await consultasUsuario.atualizar(idUsuario, dados);
        logger.info('DB_UPDATE_USER_SUCCESS', { 
            message: 'Usuário atualizado com sucesso na gestão de dados.',
            idUsuario 
        });
        return usuarioAtualizado;
    } catch (error) {
        logger.error('DB_UPDATE_USER_ERROR', { 
            message: 'Erro ao atualizar usuário na gestão de dados',
            errorMessage: error.message,
            stack: error.stack
        });
        throw error;
    }
};


const repositorioUsuario = {
    criar,
    encontrarPorEmail,
    encontrarPorGoogleId,
    atualizar,
};

export default repositorioUsuario;
