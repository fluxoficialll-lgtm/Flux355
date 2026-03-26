
// ServiçosFrontend/SistemaObservabilidade/Log.API.ts

import { createLogger } from './Sistema.Mensageiro.Cliente.Backend';

/**
 * Cria uma instância de logger para um arquivo de API específico.
 * Este logger é uma abstração sobre o logger genérico para padronizar
 * o formato das mensagens de log de APIs.
 * 
 * @param apiName - O nome do arquivo ou serviço da API que está usando o logger.
 * @returns Um objeto logger com métodos para registrar requisições, sucessos, e falhas.
 */
export const createApiLogger = (apiName: string) => {
    // Cria um logger base, passando o nome da API como o "módulo".
    const logger = createLogger(`API-${apiName}`);

    return {
        /**
         * Log para o início de uma chamada de API.
         * @param method - O nome do método/função da API sendo chamado.
         * @param data - Dados opcionais da requisição (payload, params, etc.).
         */
        logRequest: (method: string, data?: any) => {
            logger.info(`[Request] Chamando método: ${method}`, data);
        },

        /**
         * Log para uma resposta de sucesso da API.
         * @param method - O nome do método/função da API que respondeu.
         * @param responseData - Dados opcionais do corpo da resposta.
         */
        logSuccess: (method: string, responseData?: any) => {
            logger.info(`[Success] Método '${method}' concluído com sucesso.`, responseData);
        },

        /**
         * Log para uma falha na chamada da API.
         * @param method - O nome do método/função da API que falhou.
         * @param error - O objeto de erro capturado.
         * @param requestData - Dados originais da requisição que podem ter causado o erro.
         */
        logFailure: (method: string, error: any, requestData?: any) => {
            logger.error(`[Failure] Erro no método '${method}'.`, {
                error,
                requestData,
            });
        },
    };
};
