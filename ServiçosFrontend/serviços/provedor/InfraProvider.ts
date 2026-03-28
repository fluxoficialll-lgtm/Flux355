
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { servicoDeAplicacaoDeAutenticacao } from '../../ServicosDeAplicacao/Autenticacao.ServicoDeAplicacao';

// Função para obter o token de autenticação
const obterToken = (): string | null => {
    // Acessa o estado mais recente do serviço de autenticação para pegar o token
    const state = servicoDeAplicacaoDeAutenticacao.getState();
    return state.token;
};

class InfraProvider {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: '/api/v1', // Você pode substituir por uma variável de ambiente
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Interceptor para adicionar o token de autenticação em cada requisição
        this.api.interceptors.request.use((config: AxiosRequestConfig) => {
            const token = obterToken();
            if (token) {
                if (!config.headers) {
                    config.headers = {};
                }
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        // Interceptor para tratar erros de resposta globalmente
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    // Se o erro for 401 (Não Autorizado), o serviço de autenticação fará o logout
                    servicoDeAplicacaoDeAutenticacao.logout();
                }
                return Promise.reject(error);
            }
        );
    }

    // Métodos para realizar as requisições HTTP
    public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.get<T>(url, config);
    }

    public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.post<T>(url, data, config);
    }

    public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.put<T>(url, data, config);
    }

    public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.delete<T>(url, config);
    }
}

// Exporta uma instância única do provider
export const infraProvider = new InfraProvider();
