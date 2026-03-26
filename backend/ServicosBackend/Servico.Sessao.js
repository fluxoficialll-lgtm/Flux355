
// backend/ServicosBackend/Servico.Sessao.js

import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import repositorioSessao from '../Repositorios/Repositorio.Sessao.js';
import Sessao from '../models/Models.Estrutura.Sessao.js';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt_super_secreto';
const JWT_EXPIRES_IN = '24h';

const calcularDataExpiracao = () => {
    // Adiciona 24 horas à data atual
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
};


/**
 * Prepara os dados de uma nova sessão e gera um token JWT, sem persistir no banco.
 */
const prepararNovaSessao = async (data) => {
    const { usuario, dadosRequisicao } = data;

    if (!usuario || !usuario.id) {
        throw new Error('Dados de usuário inválidos para criar sessão.');
    }

    console.log('Preparando nova sessão', { event: 'SESSION_PREPARE_START', userId: usuario.id });

    const payload = { user: usuario.paraRespostaHttp() };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const dataExpiracao = calcularDataExpiracao();

    const dadosSessao = {
        idUsuario: usuario.id,
        token,
        userAgent: dadosRequisicao.userAgent,
        enderecoIp: dadosRequisicao.ipAddress,
        expires_at: dataExpiracao, // Corrigido aqui
    };
    
    return { token, dadosSessao };
};

/**
 * Salva os dados de uma sessão validada no repositório.
 */
const salvarSessao = async (dadosSessaoValidados) => {
    console.log('Salvando sessão', { event: 'SESSION_SAVE_START', userId: dadosSessaoValidados.idUsuario });
    
    const novaSessao = new Sessao({
        id: uuidv4(),
        ...dadosSessaoValidados,
    });

    await repositorioSessao.criar(novaSessao.paraBancoDeDados());
    console.log('Sessão salva com sucesso', { event: 'SESSION_SAVE_SUCCESS', userId: dadosSessaoValidados.idUsuario });
};


/**
 * Invalida um token de sessão (logout).
 */
const encerrarSessao = async (token) => {
    console.log("Iniciando processo de logout.", { event: 'SESSION_END_START' });

    await repositorioSessao.invalidar(token);

    console.log("Sessão invalidada com sucesso.", { event: 'SESSION_END_SUCCESS' });
    return { message: "Logout bem-sucedido" };
};

export default {
    prepararNovaSessao,
    salvarSessao,
    encerrarSessao,
};
