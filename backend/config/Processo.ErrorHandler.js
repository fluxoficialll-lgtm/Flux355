
import createServerLogger from './Log.Servidor.js';

export function setupErrorHandlers() {
    const logger = createServerLogger(import.meta.url);

    process.on('uncaughtException', (err, origin) => {
        logger.error(`Exceção Não Capturada: ${err.message}`, {
            componente: 'Core',
            dados: { origin },
            error: err
        });
        // Aguarda o log ser escrito antes de encerrar
        setTimeout(() => process.exit(1), 1000); 
    });

    process.on('unhandledRejection', (reason, promise) => {
        const isError = reason instanceof Error;
        const message = isError ? reason.message : 'Rejeição de Promise Não Tratada com motivo não-Erro.';

        logger.error(`Rejeição de Promise Não Tratada: ${message}`.trim(), {
            componente: 'Core',
            dados: { reason: String(reason) },
            error: isError ? reason : undefined
        });
    });
}
