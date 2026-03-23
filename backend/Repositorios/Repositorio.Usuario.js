
import consultasUsuario from '../database/GestaoDeDados/PostgreSQL/Consultas.Usuario.js';
import Log from '../Logs/BK.Log.Supremo.js';

const criar = async (dadosUsuario) => {
    Log.database.info('Chamando camada de gestão de dados para criar usuário.', { 
        event: 'DB_CREATE_USER_START',
        email: dadosUsuario.email 
    });
    try {
        const novoUsuario = await consultasUsuario.criar(dadosUsuario);
        Log.database.info('Usuário criado com sucesso na gestão de dados.', { 
            event: 'DB_CREATE_USER_SUCCESS',
            userId: novoUsuario.id 
        });
        return novoUsuario;
    } catch (error) {
        Log.database.error('Erro ao criar usuário na gestão de dados', { 
            event: 'DB_CREATE_USER_ERROR',
            errorMessage: error.message,
            stack: error.stack
        });
        throw error;
    }
};

const encontrarPorEmail = async (email) => {
    Log.database.info('Chamando camada de gestão de dados para buscar usuário por email.', { 
        event: 'DB_FIND_BY_EMAIL_START',
        email 
    });
    try {
        const usuario = await consultasUsuario.encontrarPorEmail(email);
        Log.database.info(usuario ? 'Usuário encontrado.' : 'Usuário não encontrado.', { 
            event: usuario ? 'DB_FIND_BY_EMAIL_FOUND' : 'DB_FIND_BY_EMAIL_NOT_FOUND',
            email 
        });
        return usuario;
    } catch (error) {
        Log.database.error('Erro ao buscar usuário por email na gestão de dados', { 
            event: 'DB_FIND_BY_EMAIL_ERROR',
            errorMessage: error.message,
            stack: error.stack
         });
        throw error;
    }
};

const encontrarPorGoogleId = async (googleId) => {
    Log.database.info('Chamando camada de gestão de dados para buscar usuário por Google ID.', { 
        event: 'DB_FIND_BY_GOOGLE_ID_START',
        googleId 
    });
    try {
        const usuario = await consultasUsuario.encontrarPorGoogleId(googleId);
        Log.database.info(usuario ? 'Usuário encontrado.' : 'Usuário não encontrado.', { 
            event: usuario ? 'DB_FIND_BY_GOOGLE_ID_FOUND' : 'DB_FIND_BY_GOOGLE_ID_NOT_FOUND',
            googleId 
        });
        return usuario;
    } catch (error) {
        Log.database.error('Erro ao buscar usuário por Google ID na gestão de dados', { 
            event: 'DB_FIND_BY_GOOGLE_ID_ERROR',
            errorMessage: error.message,
            stack: error.stack
         });
        throw error;
    }
};

const atualizar = async (idUsuario, dados) => {
    Log.database.info('Chamando camada de gestão de dados para atualizar usuário.', { 
        event: 'DB_UPDATE_USER_START',
        idUsuario 
    });
    try {
        const usuarioAtualizado = await consultasUsuario.atualizar(idUsuario, dados);
        Log.database.info('Usuário atualizado com sucesso na gestão de dados.', { 
            event: 'DB_UPDATE_USER_SUCCESS',
            idUsuario 
        });
        return usuarioAtualizado;
    } catch (error) {
        Log.database.error('Erro ao atualizar usuário na gestão de dados', { 
            event: 'DB_UPDATE_USER_ERROR',
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
