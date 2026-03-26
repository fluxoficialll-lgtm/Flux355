
// ServiçosFrontend/SistemaObservabilidade/Log.Hook.ts

import { createLogger } from './Sistema.Mensageiro.Cliente.Backend';

/**
 * Cria uma instância de logger para um arquivo de Hook específico.
 * Este logger padroniza o formato das mensagens de log para hooks.
 * 
 * @param hookName - O nome do arquivo ou Hook que está usando o logger.
 * @returns Um objeto logger com métodos para registrar o início, sucesso e erros.
 */
export const createHookLogger = (hookName: string) => {
    // Cria um logger base, passando o nome do Hook como o "módulo".
    const logger = createLogger(`Hook-${hookName}`);

    return {
        /**
         * Log para o início da execução de um hook ou função dentro dele.
         * @param functionName - O nome da função ou lógica sendo executada.
         * @param data - Dados iniciais ou parâmetros.
         */
        logStart: (functionName: string, data?: any) => {
            logger.info(`[Start] Executando: ${functionName}`, data);
        },

        /**
         * Log para a conclusão bem-sucedida de uma operação no hook.
         * @param functionName - O nome da função ou lógica que completou.
         * @param resultData - Os dados de resultado da operação.
         */
        logSuccess: (functionName: string, resultData?: any) => {
            logger.info(`[Success] '${functionName}' concluído com sucesso.`, resultData);
        },

        /**
         * Log para um erro ocorrido dentro do hook.
         * @param functionName - O nome da função ou lógica que falhou.
         * @param error - O objeto de erro capturado.
         * @param contextData - Dados de contexto que podem ter causado o erro.
         */
        logError: (functionName: string, error: any, contextData?: any) => {
            logger.error(`[Error] Erro em '${functionName}'.`, {
                error,
                contextData,
            });
        },
    };
};
