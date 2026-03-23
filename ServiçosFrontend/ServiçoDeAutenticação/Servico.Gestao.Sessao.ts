
import { LogSupremo } from '../SistemaObservabilidade/Log.Supremo1'; // Caminho do log corrigido
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import authApi from '../APIs/API.Sistema.Autenticacao.Supremo';
import ClienteBackend from '../Cliente.Backend';
import { config } from '../ValidaçãoDeAmbiente/config';

interface User extends Usuario {}

// --- Real Session Service ---
const realSessionService = {
    getCurrentUser: (): User | null => {
        try {
            const item = localStorage.getItem('user');
            return item ? JSON.parse(item) : null;
        } catch (error) {
            LogSupremo.Log.error('[SessionManager] Erro ao buscar usuário do localStorage:', error);
            return null;
        }
    },
    validateSession: async (signal: AbortSignal): Promise<User | null> => {
        const token = localStorage.getItem('userToken');
        if (!token) return null;
        ClienteBackend.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
            const { data } = await authApi.validateToken();
            if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
            const user = data.user;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            if (!signal.aborted) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('user');
                delete ClienteBackend.defaults.headers.common['Authorization'];
            }
            throw error;
        }
    },
};

// --- Simulated Session Service ---
const simulatedSessionService = {
    getCurrentUser: (): User | null => {
        try {
            const item = localStorage.getItem('user');
            return item ? JSON.parse(item) : null;
        } catch { return null; }
    },
    validateSession: (signal: AbortSignal): Promise<User | null> => {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => resolve(simulatedSessionService.getCurrentUser()), 300);
            signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new DOMException('Aborted', 'AbortError'));
            });
        });
    },
};

// --- Exporting the correct service based on environment ---
export const servicoGestaoSessao = config.VITE_APP_ENV === 'simulation' 
    ? simulatedSessionService 
    : realSessionService;
