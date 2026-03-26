
// backend/ServicosBackend/Servico.Usuario.js

import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Models.Estrutura.Usuario.js';
import repositorioUsuario from '../Repositorios/Repositorio.Usuario.js';
import createServicoLogger from '../config/Log.Servicos.Backend.js';

const logger = createServicoLogger('Servico.Usuario.js');

const registrarNovoUsuario = async (dadosUsuario) => {
    const { nome, email, senha } = dadosUsuario;
    logger.info(`Iniciando registro de novo usuário para o e-mail ${email}.`);

    const usuarioExistente = await repositorioUsuario.findByEmail(email);
    if (usuarioExistente) {
        logger.warn(`Tentativa de registro com e-mail ${email} que já está em uso.`);
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

    const usuarioDb = await repositorioUsuario.createUser(novoUsuario.paraBancoDeDados());
    logger.info(`Usuário ${usuarioDb.id} registrado com sucesso.`);

    return Usuario.deBancoDeDados(usuarioDb);
};

const autenticarUsuarioPorCredenciais = async (credenciais) => {
    const { email, senha } = credenciais;
    logger.info(`Iniciando autenticação por credenciais para o e-mail ${email}.`);

    const usuarioDb = await repositorioUsuario.findByEmail(email);
    if (!usuarioDb || !usuarioDb.password_hash) {
        logger.warn(`Tentativa de autenticação com credenciais inválidas para o e-mail ${email}.`);
        throw new Error('Credenciais inválidas.');
    }

    const senhaValida = await bcrypt.compare(senha, usuarioDb.password_hash);
    if (!senhaValida) {
        logger.warn(`Tentativa de autenticação com senha inválida para o e-mail ${email}.`);
        throw new Error('Credenciais inválidas.');
    }

    logger.info(`Usuário ${usuarioDb.id} autenticado com sucesso.`);
    return Usuario.deBancoDeDados(usuarioDb);
};

const autenticarOuCriarPorGoogle = async (dadosGoogle) => {
    const { nome, email, google_id } = dadosGoogle;
    logger.info(`Iniciando autenticação ou criação por Google para o e-mail ${email}.`);

    let usuarioDb = await repositorioUsuario.findByGoogleId(google_id);
    let isNewUser = false;

    if (!usuarioDb) {
        const usuarioExistente = await repositorioUsuario.findByEmail(email);
        if (usuarioExistente) {
            logger.warn(`Tentativa de criação de usuário Google com e-mail ${email} que já está em uso.`);
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
        
        usuarioDb = await repositorioUsuario.createUser(novoUsuario.paraBancoDeDados());
        logger.info(`Novo usuário ${usuarioDb.id} criado via Google.`);
    }

    return {
        usuario: Usuario.deBancoDeDados(usuarioDb),
        isNewUser: isNewUser
    };
};

const atualizarPerfilUsuario = async (idUsuario, dadosPerfil) => {
    logger.info(`Iniciando atualização de perfil para o usuário ${idUsuario}.`);

    const usuarioExistente = await repositorioUsuario.encontrarPorId(idUsuario);
    if (!usuarioExistente) {
        logger.warn(`Tentativa de atualização de perfil para usuário não encontrado com ID ${idUsuario}.`);
        throw new Error('Usuário não encontrado.');
    }

    const dadosParaAtualizar = Object.keys(dadosPerfil).reduce((acc, key) => {
        if (dadosPerfil[key] !== undefined) {
            acc[key] = dadosPerfil[key];
        }
        return acc;
    }, {});


    const usuarioAtualizadoDb = await repositorioUsuario.updateUser(idUsuario, dadosParaAtualizar);
    
    logger.info(`Perfil do usuário ${idUsuario} atualizado com sucesso.`);

    return Usuario.deBancoDeDados(usuarioAtualizadoDb);
};

const encontrarUsuarioPorId = async (id) => {
    logger.info(`Buscando usuário por ID ${id}.`);
    const usuarioDb = await repositorioUsuario.encontrarPorId(id);
    if (!usuarioDb) {
        logger.warn(`Usuário não encontrado por ID ${id}.`);
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
