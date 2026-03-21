
import { config } from '../ValidaçãoDeAmbiente/config';
import logger from '../logger';
import { LoginUsuarioDTO as LoginDto } from '../../../types/Entrada/Dto.Estrutura.Usuario';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import { servicoGestaoSessao } from './Servico.Gestao.Sessao';
import { servicoGestaoLogin } from './Servico.Gestao.Login';
import { servicoGestaoLogout } from './Servico.Gestao.Logout';

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
        logger.log('[AuthService] Notificando listeners:', currentState);
        listeners.forEach(listener => listener(currentState));
    };

    const initialize = async () => {
        if (validationController) validationController.abort();
        validationController = new AbortController();
        const { signal } = validationController;

        try {
            const userFromStorage = servicoGestaoSessao.getCurrentUser();
            if (userFromStorage) setState({ user: userFromStorage });
            
            const validatedUser = await servicoGestaoSessao.validateSession(signal);
            if (!signal.aborted) setState({ user: validatedUser, loading: false });

        } catch (error: any) {
            if (!signal.aborted) {
                logger.error('[AuthService] Falha na validação inicial:', error);
                setState({ user: null, loading: false, error });
            }
        }
    };

    const service = {
        getState: () => currentState,
        subscribe: (listener: AuthChangeListener) => {
            listeners.push(listener);
            return () => { listeners = listeners.filter(l => l !== listener); };
        },
        async login(dadosLogin: LoginDto) {
            setState({ loading: true, error: null });
            try {
                const data = await servicoGestaoLogin.login(dadosLogin);
                setState({ user: data.user, loading: false });
                return data;
            } catch (error: any) {
                setState({ loading: false, error });
                throw error;
            }
        },
        async loginWithGoogle(credential: string, referredBy?: string) {
            setState({ loading: true, error: null });
            try {
                const data = await servicoGestaoLogin.loginComGoogle(credential, referredBy);
                setState({ user: data.user, loading: false });
                return data;
            } catch (error: any) {
                setState({ loading: false, error });
                throw error;
            }
        },
        logout() {
            servicoGestaoLogout.logout();
            setState({ user: null, loading: false, error: null });
        },
        async completeProfile(profileData: Partial<Usuario>) {
            setState({ loading: true, error: null });
            try {
                const updatedUser = await servicoGestaoLogin.completeProfile(profileData);
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

logger.log(`[AuthService] Sistema de Autenticação inicializado em modo: ${config.VITE_APP_ENV}`);

export default SistemaAutenticacaoSupremo;
