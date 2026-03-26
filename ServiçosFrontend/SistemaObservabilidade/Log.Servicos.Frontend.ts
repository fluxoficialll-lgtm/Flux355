
// ServiçosFrontend/SistemaObservabilidade/Log.Servicos.Frontend.ts

import { createLogger } from './Sistema.Mensageiro.Cliente.Backend';

/**
 * Cria uma instância de logger para um arquivo de Serviço específico.
 * Este logger padroniza o formato das mensagens de log para serviços.
 * 
 * @param serviceName - O nome do serviço que está usando o logger.
 * @returns Um objeto logger com métodos para registrar operações.
 */
export const createServiceLogger = (serviceName: string) => {
    // Cria um logger base, passando o nome do Serviço como o "módulo".
    const logger = createLogger(`Service-${serviceName}`);

    return {
        /**
         * Log para o início da execução de uma operação no serviço.
         * @param operation - O nome da operação sendo executada.
         * @param params - Dados iniciais ou parâmetros da operação.
         */
        logOperationStart: (operation: string, params?: object) => {
            logger.info(`[Start] Executando operação: ${operation}`, { operation, params });
        },

        /**
         * Log para a conclusão bem-sucedida de uma operação no serviço.
         * @param operation - O nome da operação que completou.
         * @param result - Os dados de resultado da operação.
         */
        logOperationSuccess: (operation: string, result?: object) => {
            logger.info(`[Success] Operação '${operation}' concluída com sucesso.`, { operation, result });
        },

        /**
         * Log para um erro ocorrido durante uma operação no serviço.
         * @param operation - O nome da operação que falhou.
         * @param error - O objeto de erro capturado.
         * @param context - Dados de contexto que podem ter causado o erro.
         */
        logOperationError: (operation: string, error: any, context?: object) => {
            logger.error(`[Error] Erro na operação '${operation}'.`, {
                operation,
                error: {
                    message: error.message,
                    stack: error.stack,
                },
                context,
            });
        },

        /**
         * Log para informações gerais ou eventos no serviço.
         * @param message - A mensagem de log.
         * @param data - Dados adicionais para o log.
         */
        logInfo: (message: string, data?: object) => {
            logger.info(message, data);
        },

        /**
         * Log para avisos ou condições não críticas no serviço.
         * @param message - A mensagem de aviso.
         * @param data - Dados adicionais para o log.
         */
        logWarn: (message: string, data?: object) => {
            logger.warn(message, data);
        }
    };
};
