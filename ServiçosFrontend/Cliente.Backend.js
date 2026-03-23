import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import VariaveisFrontend from './Config/Variaveis.Frontend.js';
import { LogSupremo } from './SistemaObservabilidade/Log.Supremo1';

const ClienteBackend = axios.create({
    baseURL: VariaveisFrontend.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flag para evitar múltiplas tentativas de refresh simultâneas
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Interceptor de Requisição
ClienteBackend.interceptors.request.use(
    (config) => {
        const traceId = config.metadata?.traceId || uuidv4();
        config.metadata = { ...config.metadata, startTime: Date.now(), traceId };
        config.headers['X-Flux-Trace-ID'] = traceId;

        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        LogSupremo.Log.info(
            'ClienteBackend.Request',
            `▶️ ${config.method.toUpperCase()} ${config.url}`,
            { payload: config.data },
            traceId
        );
        return config;
    },
    (error) => {
        LogSupremo.Log.error('ClienteBackend.Request.Error', 'Erro ao configurar a requisição', error);
        return Promise.reject(error);
    }
);

// Interceptor de Resposta
ClienteBackend.interceptors.response.use(
    (response) => {
        const duration = Date.now() - response.config.metadata.startTime;
        const { traceId } = response.config.metadata;

        LogSupremo.Log.info(
            'ClienteBackend.Response',
            `✅ ${response.status} ${response.config.url} em ${duration}ms`,
            { status: response.status, duration },
            traceId
        );
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const { traceId } = originalRequest.metadata;
        const duration = Date.now() - originalRequest.metadata.startTime;
        const contexto = 'ClienteBackend.Response.Error';

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return ClienteBackend(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            LogSupremo.Log.warn(contexto, 'Token expirado. Tentando renovar...', { traceId });

            try {
                // Assumindo que você tem um endpoint para renovar o token.
                const refreshToken = localStorage.getItem('refreshToken'); 
                const { data } = await ClienteBackend.post('/auth/refresh', { refreshToken });
                
                const novoToken = data.token;
                localStorage.setItem('userToken', novoToken);
                ClienteBackend.defaults.headers.common['Authorization'] = 'Bearer ' + novoToken;
                originalRequest.headers['Authorization'] = 'Bearer ' + novoToken;
                
                LogSupremo.Log.info(contexto, 'Token renovado com sucesso.', { traceId });
                processQueue(null, novoToken);

                return ClienteBackend(originalRequest);
            } catch (refreshError) {
                LogSupremo.Log.error(contexto, 'Falha ao renovar o token. Deslogando usuário.', refreshError, traceId);
                processQueue(refreshError, null);

                localStorage.removeItem('userToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.dispatchEvent(new Event('authChange'));
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        const errorMessage = error.response ? `❌ ${error.response.status} ${originalRequest.url} em ${duration}ms` : `Erro de rede em ${originalRequest.url}`;
        LogSupremo.Log.error(contexto, errorMessage, {
            traceId,
            status: error.response?.status,
            duration,
            errorData: error.response?.data,
            message: error.message,
        });

        return Promise.reject(error);
    }
);

export default ClienteBackend;
