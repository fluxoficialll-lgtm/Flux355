
import { config } from '../ValidaçãoDeAmbiente/config';
import { LogSupremo } from '../SistemaObservabilidade/Log.Supremo'; // Caminho do log corrigido
import { RegistroUsuarioDTO, LoginUsuarioDTO } from '../../../types/Entrada/Dto.Estrutura.Usuario';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import { servicoGestaoSessao } from './Servico.Gestao.Sessao';
import { servicoSincronizacao } from './Servico.Sincronizacao';
import authApi from '../APIs/API.Sistema.Autenticacao.Supremo';

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

    const service = {
        getState: () => currentState,
        getCurrentUser: () => currentState.user,
        subscribe: (listener: AuthChangeListener) => {
            listeners.push(listener);
            return () => { listeners = listeners.filter(l => l !== listener); };
        },
        async register(dadosRegistro: RegistroUsuarioDTO) {
            setState({ loading: true, error: null });
            try {
                const { data } = await authApi.register(dadosRegistro);
                setState({ loading: false });
                return data;
            } catch (error: any) {
                setState({ loading: false, error });
                throw error;
            }
        },
        async login(dadosLogin: LoginUsuarioDTO) {
            setState({ loading: true, error: null });
            try {
                const { data } = await authApi.login(dadosLogin.email, dadosLogin.password);
                const { user } = data;
                setState({ user, loading: false });
                return data;
            } catch (error: any) {
                setState({ user: null, loading: false, error });
                throw error;
            }
        },
        async loginWithGoogle(code: string, referredBy?: string) {
            LogSupremo.Depuracao.log("loginWithGoogle chamado com:", { code, referredBy });
            setState({ loading: true, error: null });
            try {
                // O método resolverSessaoLogin agora é parte do authApi
                const { data } = await authApi.resolverSessaoLogin(code);
                const { user } = data;
                setState({ user, loading: false, error: null });
                return data;
            } catch (error: any) {
                setState({ user: null, loading: false, error });
                throw error;
            }
        },
        async logout() {
            setState({ loading: true, error: null });
            try {
                // Lógica de logout aqui, se necessário (ex: chamar um endpoint de logout)
                localStorage.removeItem('userToken');
                localStorage.removeItem('user');
                setState({ user: null, loading: false });
            } catch (error: any) {
                setState({ loading: false, error });
                throw error;
            }
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
