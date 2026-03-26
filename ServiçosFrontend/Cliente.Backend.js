import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import VariaveisFrontend from './Config/Variaveis.Frontend.js';
import LogClienteBackend from './SistemaObservabilidade/Log.ClienteBackend.ts';

/**
 * Calcula a duração em milissegundos.
 * @param {number} start - O tempo de início registrado.
 * @returns {number} A duração em milissegundos.
 */
function getDurationInMilliseconds(start) {
  if (!start) return 0;
  return performance.now() - start;
}

const ClienteBackend = axios.create({
    baseURL: VariaveisFrontend.apiBaseUrl,
    headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

// --- INTERCEPTOR DE REQUISIÇÃO ---
ClienteBackend.interceptors.request.use(
    (config) => {
        config.headers['x-trace-id'] = config.headers['x-trace-id'] || uuidv4();
        config.startTime = performance.now();

        LogClienteBackend.logRequest(config);

        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        LogClienteBackend.logError(error);
        return Promise.reject(error);
    }
);

// --- INTERCEPTOR DE RESPOSTA ---
ClienteBackend.interceptors.response.use(
    (response) => {
        const duration = getDurationInMilliseconds(response.config.startTime);
        LogClienteBackend.logResponse(response, duration);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        LogClienteBackend.logError(error);

        // Lógica de renovação de token (preservada)
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return ClienteBackend(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const { data } = await ClienteBackend.post('/auth/refresh', { refreshToken });
                
                localStorage.setItem('userToken', data.token);
                ClienteBackend.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
                originalRequest.headers['Authorization'] = 'Bearer ' + data.token;
                
                processQueue(null, data.token);

                return ClienteBackend(originalRequest);
            } catch (refreshError) {
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

        return Promise.reject(error);
    }
);

export default ClienteBackend;
