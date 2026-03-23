
import { LoginUsuarioDTO as LoginComEmailESenha, RegistroUsuarioDTO as RegistroComEmailESenha } from '../../types/Entrada/Dto.Estrutura.Usuario';
import { servicoGestaoConta } from '../ServiçosFrontend/ServiçoDeAutenticação/Servico.Gestao.Conta';
import { servicoGestaoLogin } from '../ServiçosFrontend/ServiçoDeAutenticação/Servico.Gestao.Login';
import { servicoGestaoLogout } from '../ServiçosFrontend/ServiçoDeAutenticação/Servico.Gestao.Logout';

// --- Tipos de Log ---

// Descreve um evento de log a ser executado pelo sistema central.
export type LogEntry = { level: 'log' | 'warn' | 'error'; messages: any[] };

// --- Definições de Tipos para Requisições ---

export interface RequisicaoLoginEmail {
    tipo: 'LOGIN_EMAIL';
    payload: LoginComEmailESenha;
}

export interface RequisicaoRegistroEmail {
    tipo: 'REGISTRO_EMAIL';
    payload: RegistroComEmailESenha;
}

export interface RequisicaoLoginGoogle {
    tipo: 'LOGIN_GOOGLE';
    payload: { 
        code: string;
        referredBy?: string;
    };
}

export interface RequisicaoLogout {
    tipo: 'LOGOUT';
}

export type RequisicaoAutenticacao =
    | RequisicaoLoginEmail
    | RequisicaoRegistroEmail
    | RequisicaoLoginGoogle
    | RequisicaoLogout;

// O resultado da operação, agora separado dos logs.
export interface RespostaRequisicaoAuth {
    sucesso: boolean;
    mensagem: string;
    dados?: any;
}

// O que o manipulador retorna: o resultado E os logs a serem processados.
export interface RespostaComLogs {
    resposta: RespostaRequisicaoAuth;
    logs: LogEntry[];
}

// --- Validação do Payload (agora sem logging direto) ---

const validarPayloadRequisicaoAuth = (req: RequisicaoAutenticacao): LogEntry[] => {
    const logs: LogEntry[] = [{ level: 'log', messages: [`Validando requisição do tipo: ${req.tipo}`] }];
    
    switch (req.tipo) {
        case 'LOGIN_EMAIL':
            if (!req.payload || !req.payload.email || !req.payload.senha) {
                throw new Error(`Payload inválido para ${req.tipo}: 'email' e 'senha' são obrigatórios.`);
            }
            break;
        case 'REGISTRO_EMAIL':
            if (!req.payload || !req.payload.email || !req.payload.senha || !req.payload.nome) {
                throw new Error(`Payload inválido para ${req.tipo}: 'nome', 'email' e 'senha' são obrigatórios.`);
            }
            break;
        case 'LOGIN_GOOGLE':
            if (!req.payload || typeof req.payload.code !== 'string') {
                throw new Error(`Payload inválido para ${req.tipo}: 'code' (string) é obrigatório.`);
            }
            break;
        case 'LOGOUT':
            break;
        default:
            const _exhaustiveCheck: never = req;
            throw new Error(`Tipo de requisição desconhecido para validação: ${(_exhaustiveCheck as any).tipo}`);
    }
    
    logs.push({ level: 'log', messages: [`Requisição ${req.tipo} validada com sucesso.`] });
    return logs;
};

// --- Manipulador Central (agora sem o parâmetro logger) ---

export const manipularRequisicaoAutenticacao = async (req: RequisicaoAutenticacao): Promise<RespostaComLogs> => {
    let logs: LogEntry[] = [];

    try {
        logs = validarPayloadRequisicaoAuth(req);

        let resultado: any;
        switch (req.tipo) {
            case 'LOGIN_EMAIL':
                resultado = await servicoGestaoLogin.login(req.payload);
                break;
            case 'REGISTRO_EMAIL':
                resultado = await servicoGestaoConta.criarConta(req.payload);
                break;
            case 'LOGIN_GOOGLE':
                resultado = await servicoGestaoLogin.handleGoogleCallback(req.payload.code, req.payload.referredBy);
                break;
            case 'LOGOUT':
                resultado = await servicoGestaoLogout.logout();
                break;
        }

        return {
            resposta: {
                sucesso: true,
                mensagem: `Operação ${req.tipo} realizada com sucesso.`,
                dados: resultado,
            },
            logs: logs,
        };

    } catch (erro) {
        const errorMessage = erro instanceof Error ? erro.message : "Ocorreu um erro desconhecido durante a autenticação.";
        logs.push({ level: 'error', messages: [`[ManipuladorAuth] Erro ao manipular requisição ${req.tipo}:`, erro] });
        
        return {
            resposta: {
                sucesso: false,
                mensagem: errorMessage,
            },
            logs: logs,
        };
    }
};

// --- Funções Fábrica (sem alterações) ---

export const criarRequisicaoLoginEmail = (payload: LoginComEmailESenha): RequisicaoLoginEmail => ({
    tipo: 'LOGIN_EMAIL',
    payload,
});

export const criarRequisicaoRegistroEmail = (payload: RegistroComEmailESenha): RequisicaoRegistroEmail => ({
    tipo: 'REGISTRO_EMAIL',
    payload,
});

export const criarRequisicaoLoginGoogle = (code: string, referredBy?: string): RequisicaoLoginGoogle => ({
    tipo: 'LOGIN_GOOGLE',
    payload: { code, referredBy }
});

export const criarRequisicaoLogout = (): RequisicaoLogout => ({
    tipo: 'LOGOUT',
});
