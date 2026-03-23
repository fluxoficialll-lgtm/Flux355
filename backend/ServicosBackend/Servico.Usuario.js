
// backend/ServicosBackend/Servico.Usuario.js

import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import Log from '../Logs/BK.Log.Supremo.js';
import Usuario from '../models/Models.Estrutura.Usuario.js';
import repositorioUsuario from '../Repositorios/Repositorio.Usuario.js';

const logger = Log.createLogger('Servico.Usuario');

/**
 * Registra um novo usuário no sistema.
 * @param {object} dadosUsuario - Dados já validados pelo controlador.
 */
const registrarNovoUsuario = async (dadosUsuario) => {
    const { nome, email, senha } = dadosUsuario; // O serviço espera dados já validados
    
    logger.info('REGISTRATION_START', { email });

    const usuarioExistente = await repositorioUsuario.encontrarPorEmail(email);
    if (usuarioExistente) {
        throw new Error('Este e-mail já está em uso.');
    }

    const novoUsuario = new Usuario({
        id: uuidv4(),
        nome,
        email,
        senha,
        apelido: email.split('@')[0],
    });

    await novoUsuario.criptografarSenha();

    const usuarioDb = await repositorioUsuario.criar(novoUsuario.paraBancoDeDados());
    logger.info('REGISTRATION_SUCCESS', { userId: usuarioDb.id, email });

    return Usuario.deBancoDeDados(usuarioDb);
};

/**
 * Autentica um usuário com base em e-mail e senha.
 * @param {object} credenciais - Credenciais já validadas pelo controlador.
 */
const autenticarUsuarioPorCredenciais = async (credenciais) => {
    const { email, senha } = credenciais; // O serviço espera dados já validados
    
    logger.info('AUTH_CREDENTIALS_START', { email });

    const usuarioDb = await repositorioUsuario.encontrarPorEmail(email);
    if (!usuarioDb || !usuarioDb.password_hash) {
        throw new Error('Credenciais inválidas.');
    }

    const senhaValida = await bcrypt.compare(senha, usuarioDb.password_hash);
    if (!senhaValida) {
        throw new Error('Credenciais inválidas.');
    }

    logger.info('AUTH_CREDENTIALS_SUCCESS', { email, userId: usuarioDb.id });
    return Usuario.deBancoDeDados(usuarioDb);
};

/**
 * Encontra um usuário existente ou cria um novo com base no perfil do Google.
 * @param {object} dadosGoogle - Dados do Google já validados pelo controlador.
 */
const autenticarOuCriarPorGoogle = async (dadosGoogle) => {
    const { nome, email, google_id } = dadosGoogle; // O serviço espera dados já validados
    
    logger.info('AUTH_GOOGLE_START', { email });

    let usuarioDb = await repositorioUsuario.encontrarPorGoogleId(google_id);
    let isNewUser = false;

    if (!usuarioDb) {
        const usuarioExistente = await repositorioUsuario.encontrarPorEmail(email);
        if (usuarioExistente) {
            throw new Error("Este e-mail já está cadastrado. Faça login com sua senha.");
        }

        isNewUser = true;
        const novoUsuario = new Usuario({
            id: uuidv4(),
            nome,
            email,
            google_id,
            apelido: email.split('@')[0],
            perfilCompleto: false,
        });
        
        usuarioDb = await repositorioUsuario.criar(novoUsuario.paraBancoDeDados());
        logger.info('AUTH_GOOGLE_NEW_USER', { userId: usuarioDb.id, email });
    }

    return {
        usuario: Usuario.deBancoDeDados(usuarioDb),
        isNewUser: isNewUser
    };
};

/**
 * Atualiza o perfil de um usuário existente.
 */
const atualizarPerfilUsuario = async (idUsuario, dadosPerfil) => {
    logger.info('PROFILE_UPDATE_START', { userId: idUsuario });

    const usuarioExistente = await repositorioUsuario.encontrarPorId(idUsuario);
    if (!usuarioExistente) {
        throw new Error('Usuário não encontrado.');
    }

    // Filtra dados para evitar a atualização de campos sensíveis/imútaveis
    const dadosParaAtualizar = Object.keys(dadosPerfil).reduce((acc, key) => {
        if (dadosPerfil[key] !== undefined) {
            acc[key] = dadosPerfil[key];
        }
        return acc;
    }, {});


    const usuarioAtualizadoDb = await repositorioUsuario.atualizar(idUsuario, dadosParaAtualizar);
    
    logger.info('PROFILE_UPDATE_SUCCESS', { userId: idUsuario });

    return Usuario.deBancoDeDados(usuarioAtualizadoDb);
};


/**
 * Encontra um usuário pelo ID.
 */
const encontrarUsuarioPorId = async (id) => {
    logger.info('FIND_USER_BY_ID', { userId: id });
    const usuarioDb = await repositorioUsuario.encontrarPorId(id);
    if (!usuarioDb) {
        return null;
    }
    return Usuario.deBancoDeDados(usuarioDb);
};

export default {
    registrarNovoUsuario,
    autenticarUsuarioPorCredenciais,
    autenticarOuCriarPorGoogle,
    atualizarPerfilUsuario,
    encontrarUsuarioPorId
};