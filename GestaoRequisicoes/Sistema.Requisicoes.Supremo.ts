
import { LogSupremo } from "../ServiçosFrontend/SistemaObservabilidade/Log.Supremo1";
import {
    manipularRequisicaoAutenticacao,
    RequisicaoAutenticacao,
    LogEntry // Importando o tipo LogEntry
} from "./Requisicao.Autenticacao";
import {
    manipularRequisicaoPerfil,
    RequisicaoPerfil
} from "./Requisicao.GestaoPerfil";

// --- Tipos Agregados ---

export type RequisicaoSuprema = RequisicaoAutenticacao | RequisicaoPerfil;

// --- Type Guards para identificar o tipo da requisição ---

const isRequisicaoAutenticacao = (req: RequisicaoSuprema): req is RequisicaoAutenticacao => {
    const tiposAuth: Array<RequisicaoAutenticacao['tipo']> = ['LOGIN_EMAIL', 'REGISTRO_EMAIL', 'LOGIN_GOOGLE', 'LOGOUT'];
    return tiposAuth.includes(req.tipo as any);
};

const isRequisicaoPerfil = (req: RequisicaoSuprema): req is RequisicaoPerfil => {
    const tiposPerfil: Array<RequisicaoPerfil['tipo']> = ['GET_OWN_PROFILE', 'GET_PUBLIC_PROFILE', 'UPDATE_PROFILE'];
    return tiposPerfil.includes(req.tipo as any);
};

/**
 * Processa uma lista de eventos de log usando o logger central.
 */
const processarLogs = (logs: LogEntry[]) => {
    const logger = LogSupremo.Log;
    logs.forEach(log => {
        (logger as any)[log.level](...log.messages);
    });
};

/**
 * Processador central para todas as requisições do sistema.
 * 1. Delega a requisição para o manipulador apropriado.
 * 2. O manipulador retorna o resultado e uma lista de eventos de log.
 * 3. Este processador executa os logs.
 * 4. Retorna apenas o resultado da operação para o chamador.
 */
export const processarRequisicao = async (req: RequisicaoSuprema) => {
    let resultado;

    if (isRequisicaoAutenticacao(req)) {
        const { resposta, logs } = await manipularRequisicaoAutenticacao(req);
        processarLogs(logs);
        resultado = resposta;
    } else if (isRequisicaoPerfil(req)) {
        const { resposta, logs } = await manipularRequisicaoPerfil(req);
        processarLogs(logs);
        resultado = resposta;
    } else {
        const errorMessage = `Tipo de requisição desconhecido: ${(req as any).tipo}`;
        LogSupremo.Log.error(errorMessage);
        resultado = { 
            sucesso: false, 
            mensagem: errorMessage 
        };
    }
    
    return resultado;
};

// --- Re-exportando as Funções Fábrica para um ponto de acesso único ---

export {
    criarRequisicaoLoginEmail,
    criarRequisicaoRegistroEmail,
    criarRequisicaoLoginGoogle,
    criarRequisicaoLogout
} from './Requisicao.Autenticacao';

export {
    criarRequisicaoGetOwnProfile,
    criarRequisicaoGetPublicProfile,
    criarRequisicaoUpdateProfile
} from './Requisicao.GestaoPerfil';
