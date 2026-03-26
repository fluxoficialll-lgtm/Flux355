
import { config } from '../ValidaçãoDeAmbiente/config';
import { RegistroUsuarioDTO, LoginUsuarioDTO } from '../../../types/Entrada/Dto.Estrutura.Usuario';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import { servicoGestaoSessao } from './Servico.Gestao.Sessao';
import { servicoSincronizacao } from './Servico.Sincronizacao';
import authApi from '../APIs/API.Sistema.Autenticacao.Supremo';
import { UsuarioAutenticado } from '../Contratos/Contrato.Autenticacao';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';

const authLogger = createServiceLogger('Sistema.Autenticacao.Supremo');

// --- Types & Interfaces ---
interface User extends Usuario {}
interface AuthState {
    user: User | UsuarioAutenticado | null;
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
        listeners.forEach(listener => listener(currentState));
    };

    const initialize = async () => {
        authLogger.logOperationStart('initialize');
        if (validationController) validationController.abort();
        validationController = new AbortController();
        const { signal } = validationController;

        try {
            const userFromStorage = servicoGestaoSessao.getCurrentUser();
            if (userFromStorage) setState({ user: userFromStorage, loading: false });
            
            const validatedUser = await servicoGestaoSessao.validateSession(signal);
            if (!signal.aborted) {
                setState({ user: validatedUser, loading: false });
                authLogger.logOperationSuccess('initialize', { userId: validatedUser?.id });
            }
        } catch (error: any) {
            if (!signal.aborted) {
                authLogger.logOperationError('initialize', error);
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
            authLogger.logOperationStart('register', { email: dadosRegistro.email });
            setState({ loading: true, error: null });
            try {
                const data = await authApi.register(dadosRegistro);
                setState({ loading: false });
                authLogger.logOperationSuccess('register');
                return data;
            } catch (error: any) {
                authLogger.logOperationError('register', error, { email: dadosRegistro.email });
                setState({ loading: false, error });
                throw error;
            }
        },
        async login(dadosLogin: LoginUsuarioDTO) {
            authLogger.logOperationStart('login', { email: dadosLogin.email });
            setState({ loading: true, error: null });
            try {
                const { usuario, token } = await authApi.login(dadosLogin);
                localStorage.setItem('userToken', token);
                localStorage.setItem('user', JSON.stringify(usuario));
                setState({ user: usuario, loading: false });
                authLogger.logOperationSuccess('login', { userId: usuario.id });
                return { usuario, token };
            } catch (error: any) {
                authLogger.logOperationError('login', error, { email: dadosLogin.email });
                setState({ user: null, loading: false, error });
                throw error;
            }
        },
        async loginWithGoogle(credential: string, referredBy?: string) {
            authLogger.logOperationStart('loginWithGoogle');
            setState({ loading: true, error: null });

            try {
                const { usuario, token, isNewUser } = await authApi.resolverSessaoLogin({ token: credential });
                
                localStorage.setItem('userToken', token);
                localStorage.setItem('user', JSON.stringify(usuario));

                authLogger.logOperationSuccess('loginWithGoogle', { userId: usuario.id, isNewUser });
                setState({ user: usuario, loading: false, error: null });

                if (config.VITE_APP_ENV === 'production') {
                    const targetUrl = isNewUser ? '/completar-perfil' : '/feed';
                    window.location.href = targetUrl;
                }
                
                return { usuario, token, isNewUser };
            } catch (error: any) {
                authLogger.logOperationError('loginWithGoogle', error, { context: 'submissao_login' });
                setState({ user: null, loading: false, error });
                throw error;
            }
        },
        async logout() {
            const userId = currentState.user?.id;
            authLogger.logOperationStart('logout', { userId });
            setState({ loading: true, error: null });
            try {
                localStorage.removeItem('userToken');
                localStorage.removeItem('user');
                setState({ user: null, loading: false });
                authLogger.logOperationSuccess('logout', { userId });
            } catch (error: any) {
                authLogger.logOperationError('logout', error, { userId });
                setState({ loading: false, error });
                throw error;
            }
        },
        async sincronizarDados() {
            const userId = currentState.user?.id;
            authLogger.logOperationStart('sincronizarDados', { userId });
            setState({ loading: true, error: null });
            try {
                const updatedUser = await servicoSincronizacao.sincronizarDadosUsuario();
                setState({ user: updatedUser, loading: false });
                authLogger.logOperationSuccess('sincronizarDados', { userId: updatedUser.id });
                return updatedUser;
            } catch (error: any) {
                authLogger.logOperationError('sincronizarDados', error, { userId });
                setState({ loading: false, error });
                throw error;
            }
        },
        reinitialize: initialize,
    };
    
    initialize();
    return service;
};

const SistemaAutenticacaoSupremo = createAuthService();

authLogger.logInfo(`Sistema de Autenticação (full-cycle) inicializado em modo: ${config.VITE_APP_ENV}`);

export default SistemaAutenticacaoSupremo;
