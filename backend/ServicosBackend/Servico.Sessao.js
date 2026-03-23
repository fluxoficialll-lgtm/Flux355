
// backend/ServicosBackend/Servico.Sessao.js

import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import repositorioSessao from '../Repositorios/Repositorio.Sessao.js';
import Log from '../Logs/BK.Log.Supremo.js';
import Sessao from '../models/Models.Estrutura.Sessao.js';

const logger = Log.createLogger('Servico.Sessao');
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt_super_secreto';

/**
 * Prepara os dados de uma nova sessão e gera um token JWT, sem persistir no banco.
 */
const prepararNovaSessao = async (data) => {
    const { usuario, dadosRequisicao } = data;

    if (!usuario || !usuario.id) {
        throw new Error('Dados de usuário inválidos para criar sessão.');
    }

    logger.info('SESSION_PREPARE_START', { userId: usuario.id });

    const payload = { user: usuario.paraRespostaHttp() };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    const dadosSessao = {
        idUsuario: usuario.id,
        token,
        userAgent: dadosRequisicao.userAgent,
        enderecoIp: dadosRequisicao.ipAddress,
    };
    
    return { token, dadosSessao };
};

/**
 * Salva os dados de uma sessão validada no repositório.
 */
const salvarSessao = async (dadosSessaoValidados) => {
    logger.info('SESSION_SAVE_START', { userId: dadosSessaoValidados.idUsuario });
    
    const novaSessao = new Sessao({
        id: uuidv4(),
        ...dadosSessaoValidados,
        dataExpiracao: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
    });

    await repositorioSessao.criar(novaSessao.paraBancoDeDados());
    logger.info('SESSION_SAVE_SUCCESS', { userId: dadosSessaoValidados.idUsuario });
};


/**
 * Invalida um token de sessão (logout).
 */
const encerrarSessao = async (token) => {
    logger.info('SESSION_END_START', { message: "Iniciando processo de logout." });

    await repositorioSessao.invalidar(token);

    logger.info('SESSION_END_SUCCESS', { message: "Sessão invalidada com sucesso." });
    return { message: "Logout bem-sucedido" };
};

export default {
    prepararNovaSessao,
    salvarSessao,
    encerrarSessao,
};