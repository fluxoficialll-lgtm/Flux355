
import { v4 as uuidv4 } from 'uuid';
import LoggerParaInfra from '../SistemaObservabilidade/Log.Infra';

const logger = new LoggerParaInfra('Provider.Usuario');

/**
 * Esta classe é a camada de infraestrutura para operações de usuário.
 * É a ÚNICA responsável por fazer requisições HTTP para a API.
 * Ela NÃO deve conter nenhuma lógica de validação de dados (Zod), pois assume
 * que os dados recebidos já foram validados pela camada de serviço ou aplicação.
 */
class InfraProviderUsuario {
    private baseURL = '/api'; // Simplificado, sem dependência de config externa
    private isRefreshing = false;
    private failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void; }[] = [];

    // ... (Lógica interna de customFetch, refresh token, etc. permanece a mesma)
    private processQueue(error: any, token: string | null = null) { /* ... */ }
    private async customFetch(endpoint: string, options: RequestInit = {}, isRetry = false): Promise<any> { /* ... */ }
    public get<T = any>(url: string, config?: any): Promise<T> { /* ... */ }
    public post<T = any>(url: string, data?: any, config?: any): Promise<T> { /* ... */ }
    public put<T = any>(url: string, data?: any, config?: any): Promise<T> { /* ... */ }
    public delete<T = any>(url: string, config?: any): Promise<T> { /* ... */ }


    // --- MÉTODOS ESPECÍFICOS DA API DE USUÁRIO ---

    public async login(loginData: any): Promise<any> {
        return this.post("/auth/login", loginData);
    }

    public async criarUsuario(dadosUsuario: any): Promise<any> {
        return this.post("/auth/register", dadosUsuario);
    }

    public async completarPerfil(perfilData: any): Promise<any> {
        return this.put("/usuarios/perfil", perfilData);
    }

    public async lidarComLoginSocial(dadosLogin: any): Promise<any> {
        return this.post("/auth/google/login", dadosLogin);
    }

    public async buscarUsuarioPorId(id: string): Promise<any> {
        return this.get(`/usuarios/${id}`);
    }

    public async buscarUsuarioPorEmail(email: string): Promise<any> {
        const result = await this.get(`/usuarios?email=${email}`);
        // A API pode retornar um array. A lógica de negócio decide como tratar.
        return Array.isArray(result) && result.length > 0 ? result[0] : result;
    }
}

export const infraProvider = new InfraProviderUsuario();

// Implementações completas dos métodos auxiliares que foram omitidos por brevidamente
InfraProviderUsuario.prototype["processQueue"] = function(error: any, token: string | null = null) {
    (this as any).failedQueue.forEach((prom: { reject: (arg0: any) => void; resolve: (arg0: string | null) => void; }) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    (this as any).failedQueue = [];
};

InfraProviderUsuario.prototype["customFetch"] = async function(endpoint: string, options: RequestInit = {}, isRetry = false): Promise<any> {
    const self = this as any;
    const fullUrl = self.baseURL + endpoint;
    const headers = new Headers(options.headers || { 'Content-Type': 'application/json' });
    headers.set('x-trace-id', uuidv4());

    const token = localStorage.getItem('userToken');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const config: RequestInit = { ...options, headers };

    logger.logInfo(`Iniciando requisição: ${config.method || 'GET'} ${fullUrl}`);
    const response = await fetch(fullUrl, config);

    if (response.status === 401 && !isRetry) {
        if (self.isRefreshing) {
            return new Promise((resolve, reject) => {
                self.failedQueue.push({ resolve, reject });
            }).then(newToken => {
                headers.set('Authorization', `Bearer ${newToken}`);
                return self.customFetch(endpoint, { ...options, headers }, true);
            });
        }
        self.isRefreshing = true;
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('Nenhum refresh token disponível.');
            const refreshResponse = await fetch(`${self.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });
            if (!refreshResponse.ok) throw new Error('Falha ao renovar o token.');
            const { token: newToken } = await refreshResponse.json();
            localStorage.setItem('userToken', newToken);
            self.processQueue(null, newToken);
            headers.set('Authorization', `Bearer ${newToken}`);
            return await self.customFetch(endpoint, { ...options, headers }, true);
        } catch (error) {
            logger.error('Erro ao renovar o token, deslogando usuário.', error);
            self.processQueue(error, null);
            localStorage.removeItem('userToken');
            localStorage.removeItem('refreshToken');
            window.dispatchEvent(new Event('authChange'));
            return Promise.reject(error);
        } finally {
            self.isRefreshing = false;
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        logger.error(`Erro na requisição para ${fullUrl}`, { status: response.status, data: errorData });
        const error = new Error(errorData.message || `Requisição falhou com status ${response.status}`);
        (error as any).response = { data: errorData, status: response.status };
        throw error;
    }

    return response.json();
};

InfraProviderUsuario.prototype["get"] = function<T = any>(url: string, config?: any): Promise<T> {
    return (this as any).customFetch(url, { ...config, method: 'GET' });
};

InfraProviderUsuario.prototype["post"] = function<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return (this as any).customFetch(url, { ...config, method: 'POST', body: data ? JSON.stringify(data) : null });
};

InfraProviderUsuario.prototype["put"] = function<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return (this as any).customFetch(url, { ...config, method: 'PUT', body: data ? JSON.stringify(data) : null });
};

InfraProviderUsuario.prototype["delete"] = function<T = any>(url: string, config?: any): Promise<T> {
    return (this as any).customFetch(url, { ...config, method: 'DELETE' });
};
