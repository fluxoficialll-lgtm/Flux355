
// backend/ServicosBackend/Servico.Sessao.js

import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import repositorioSessao from '../Repositorios/Repositorio.Sessao.js';
import Sessao from '../models/Models.Estrutura.Sessao.js';
import createServicoLogger from '../config/Log.Servicos.Backend.js';

const logger = createServicoLogger('Servico.Sessao.js');

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt_super_secreto';
const JWT_EXPIRES_IN = '24h';

const calcularDataExpiracao = () => {
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
};

const prepararNovaSessao = async ({ usuario, dadosRequisicao }) => {
    if (!usuario || !usuario.id) {
        throw new Error('Dados de usuário inválidos para criar a sessão.');
    }

    logger.info(`Preparando nova sessão para o usuário ${usuario.id}.`);

    const payload = { user: usuario.paraRespostaHttp() };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const dadosSessao = {
        user_id: usuario.id,
        token,
        expires_at: calcularDataExpiracao(),
        ipAddress: dadosRequisicao.ipAddress,
        userAgent: dadosRequisicao.userAgent,
    };
    
    return { token, dadosSessao };
};

const salvarSessao = async (dadosSessaoValidados) => {
    logger.info(`Iniciando salvamento da sessão para o usuário ${dadosSessaoValidados.user_id}.`);
    
    const novaSessao = new Sessao({
        id: uuidv4(),
        ...dadosSessaoValidados,
    });

    await repositorioSessao.criar(novaSessao.paraBancoDeDados());
    logger.info(`Sessão para o usuário ${dadosSessaoValidados.user_id} salva com sucesso.`);
};

const encerrarSessao = async (token) => {
    logger.info('Iniciando processo de encerramento de sessão.');

    await repositorioSessao.deletarPorToken(token);

    logger.info('Sessão encerrada e removida com sucesso.');
    return { message: 'Logout realizado com sucesso.' };
};

export default {
    prepararNovaSessao,
    salvarSessao,
    encerrarSessao,
};
