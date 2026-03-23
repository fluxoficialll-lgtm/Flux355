
import { config } from '../ValidaçãoDeAmbiente/config';
import { LogSupremo } from '../SistemaObservabilidade/Log.Supremo1'; // Caminho do log corrigido
import { RegistroUsuarioDTO, LoginUsuarioDTO } from '../../../types/Entrada/Dto.Estrutura.Usuario';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import { servicoGestaoSessao } from './Servico.Gestao.Sessao';
import { servicoSincronizacao } from './Servico.Sincronizacao';
import {
    processarRequisicao, 
    criarRequisicaoLoginEmail,
    criarRequisicaoRegistroEmail,
    criarRequisicaoLoginGoogle,
    criarRequisicaoLogout,
    RequisicaoAutenticacao // Importando o tipo para checagem
} from '../../GestaoRequisicoes/Sistema.Requisicoes.Supremo';
import {
    processarRespostaSuprema,
    criarRespostaLogin,
    criarRespostaRegistro,
    criarRespostaLogout
} from '../../GestaoRespostas/Sistema.Respostas.Supremo';

// --- Types & Interfaces ---
interface User extends Usuario {}
interface AuthState {
    user: User | null;
    loading: boolean;
    error: Error | null;
}
type AuthChangeListener = (state: AuthState) => void;

// --- O cérebro: Máquina de Estado de Autenticação ---
const createAuthService = () => {
    let listeners: AuthChangeListener[] = [];
    let currentState: AuthState = { user: null, loading: true, error: null };
    let validationController: AbortController | null = null;

    const setState = (newState: Partial<AuthState>) => {
        const oldState = { ...currentState };
        currentState = { ...currentState, ...newState };
        const userChanged = JSON.stringify(oldState.user) !== JSON.stringify(currentState.user);
        if (oldState.loading !== currentState.loading || oldState.error !== currentState.error || userChanged) {
            notify();
        }
    };

    const notify = () => {
        LogSupremo.Log.info('[AuthService] Notificando listeners:', currentState);
        listeners.forEach(listener => listener(currentState));
    };

    const initialize = async () => {
        if (validationController) validationController.abort();
        validationController = new AbortController();
        const { signal } = validationController;

        try {
            const userFromStorage = servicoGestaoSessao.getCurrentUser();
            if (userFromStorage) setState({ user: userFromStorage, loading: false });
            
            const validatedUser = await servicoGestaoSessao.validateSession(signal);
            if (!signal.aborted) setState({ user: validatedUser, loading: false });

        } catch (error: any) {
            if (!signal.aborted) {
                LogSupremo.Log.error('[AuthService] Falha na validação inicial:', error);
                setState({ user: null, loading: false, error });
                await service.logout();
            }
        }
    };

    const executeAuthRequest = async (request: RequisicaoAutenticacao) => {
        setState({ loading: true, error: null });
        
        // 1. Executa a requisição e obtém o resultado bruto.
        const resultadoRequisicao = await processarRequisicao(request);

        // 2. Cria uma resposta estruturada com base no contexto da requisição.
        let respostaEstruturada;
        switch (request.tipo) {
            case 'LOGIN_EMAIL':
            case 'LOGIN_GOOGLE':
                respostaEstruturada = criarRespostaLogin(resultadoRequisicao.sucesso, resultadoRequisicao.dados, resultadoRequisicao.mensagem);
                break;
            case 'REGISTRO_EMAIL':
                respostaEstruturada = criarRespostaRegistro(resultadoRequisicao.sucesso, resultadoRequisicao.mensagem);
                break;
            case 'LOGOUT':
                respostaEstruturada = criarRespostaLogout(resultadoRequisicao.sucesso, resultadoRequisicao.mensagem);
                break;
            default:
                // Fallback para um tipo de requisição não esperado.
                const erroMsg = "Tipo de requisição de autenticação não reconhecido no Sistema Supremo.";
                LogSupremo.Log.error(erroMsg, request);
                setState({ loading: false, error: new Error(erroMsg) });
                throw new Error(erroMsg);
        }

        // 3. Delega o processamento de efeitos colaterais (logs, UI, etc.) ao sistema de respostas.
        processarRespostaSuprema(respostaEstruturada);

        // 4. Mantém o contrato original: atualiza o estado local e retorna/lança o resultado.
        if (resultadoRequisicao.sucesso) {
            const user = resultadoRequisicao.dados ? resultadoRequisicao.dados.user : null;
            setState({ user, loading: false });
            return resultadoRequisicao.dados;
        } else {
            const error = new Error(resultadoRequisicao.mensagem);
            setState({ user: null, loading: false, error });
            throw error;
        }
    };

    const service = {
        getState: () => currentState,
        getCurrentUser: () => currentState.user,
        subscribe: (listener: AuthChangeListener) => {
            listeners.push(listener);
            return () => { listeners = listeners.filter(l => l !== listener); };
        },
        async register(dadosRegistro: RegistroUsuarioDTO) {
            const request = criarRequisicaoRegistroEmail(dadosRegistro);
            return executeAuthRequest(request);
        },
        async login(dadosLogin: LoginUsuarioDTO) {
            const request = criarRequisicaoLoginEmail(dadosLogin);
            return executeAuthRequest(request);
        },
        async loginWithGoogle(code: string, referredBy?: string) {
            const request = criarRequisicaoLoginGoogle(code, referredBy);
            const response = await executeAuthRequest(request);
            if (response && response.user) {
                setState({ user: response.user, loading: false, error: null });
            }
            return response;
        },
        async logout() {
            const request = criarRequisicaoLogout();
            return executeAuthRequest(request);
        },
        async sincronizarDados() {
            setState({ loading: true, error: null });
            try {
                const updatedUser = await servicoSincronizacao.sincronizarDadosUsuario();
                setState({ user: updatedUser, loading: false });
                return updatedUser;
            } catch (error: any) {
                setState({ loading: false, error });
                throw error;
            }
        },
        reinitialize: initialize,
    };
    
    initialize();
    return service;
};

// --- Singleton Export ---
const SistemaAutenticacaoSupremo = createAuthService();

LogSupremo.Log.info(`[AuthService] Sistema de Autenticação (full-cycle) inicializado em modo: ${config.VITE_APP_ENV}`);

export default SistemaAutenticacaoSupremo;
