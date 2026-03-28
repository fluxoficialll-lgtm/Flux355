
import { infraProvider } from '../serviços/provedor/InfraProvider';
import { createApplicationServiceLogger } from '../SistemaObservabilidade/Log.Aplication';
import { Usuario } from '../../../types/Usuario'; // Ajuste o caminho conforme necessário

const appServiceLogger = createApplicationServiceLogger('AuthApplicationService');

// --- Interfaces ---
export interface AuthApplicationState {
  usuario: Usuario | null;
  token: string | null;
  autenticado: boolean;
  processando: boolean;
  erro: string | null;
  acaoPosLogin?: 'navigateToFeed' | 'navigateToCompleteProfile';
}

export interface LoginEmailParams {
    email: string;
    senha?: string; // Senha pode ser opcional dependendo do fluxo
}

class AuthApplicationService {
  private state: AuthApplicationState;
  private listeners: ((state: AuthApplicationState) => void)[] = [];

  constructor() {
    this.state = this.getInitialState();
    appServiceLogger.logOperationStart('constructor', { initialState: this.state });
  }

  // Inicializa o estado a partir do localStorage para persistência da sessão
  private getInitialState(): AuthApplicationState {
    try {
        const token = localStorage.getItem('authToken');
        const userJson = localStorage.getItem('authUser');
        const usuario = userJson ? JSON.parse(userJson) : null;

        if (token && usuario) {
            return {
                usuario,
                token,
                autenticado: true,
                processando: false,
                erro: null,
            };
        }
    } catch (error) {
        appServiceLogger.logOperationError('getInitialState', error, { message: 'Erro ao ler o localStorage' });
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
    }
    
    return {
        usuario: null,
        token: null,
        autenticado: false,
        processando: false,
        erro: null,
    };
  }

  private updateState(partialState: Partial<AuthApplicationState>) {
    this.state = { ...this.state, ...partialState };
    this.listeners.forEach(listener => listener(this.state));

    // Limpa a ação de pós-login após notificar os listeners
    if (this.state.acaoPosLogin) {
      this.state.acaoPosLogin = undefined;
    }
  }

  // --- MÉTODOS PÚBLICOS ---

  async loginComEmail(params: LoginEmailParams) {
    appServiceLogger.logOperationStart('loginComEmail', { email: params.email });
    this.updateState({ processando: true, erro: null });

    try {
      const response = await infraProvider.post<{ token: string; usuario: Usuario; isNewUser: boolean; }>('/auth/login', params);
      const { token, usuario, isNewUser } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(usuario));

      const acaoPosLogin = isNewUser ? 'navigateToCompleteProfile' : 'navigateToFeed';

      this.updateState({
        usuario,
        token,
        autenticado: true,
        processando: false,
        acaoPosLogin,
      });

      appServiceLogger.logOperationSuccess('loginComEmail', { userId: usuario.id, acao: acaoPosLogin });

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao fazer login';
      appServiceLogger.logOperationError('loginComEmail', err, { email: params.email });
      this.updateState({ erro: errorMessage, processando: false });
      throw new Error(errorMessage);
    }
  }

  async logout() {
    appServiceLogger.logOperationStart('logout');
    this.updateState({ processando: true });

    try {
        await infraProvider.post('/auth/logout');
        appServiceLogger.logOperationSuccess('logout', { message: 'Logout bem-sucedido no backend.' });
    } catch (err: any) {
        // Mesmo que o logout do backend falhe, prosseguimos com a limpeza local.
        appServiceLogger.logOperationError('logout', err, { message: 'Erro no logout do backend, limpando localmente mesmo assim.' });
    } finally {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        
        this.updateState({
            usuario: null,
            token: null,
            autenticado: false,
            processando: false,
            erro: null,
        });
    }
  }

  // --- Métodos de observação ---
  subscribe(listener: (state: AuthApplicationState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState(): AuthApplicationState {
    return this.state;
  }
}

export const servicoDeAplicacaoDeAutenticacao = new AuthApplicationService();
