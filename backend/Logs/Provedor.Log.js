import pino from 'pino';
import { createNamespace } from 'cls-hooked';

// Cria um namespace para armazenar o contexto da requisição (traceId)
const session = createNamespace('request-session');

const provedor = pino({
    level: 'info',
    formatters: {
        log: (obj) => {
            // Adiciona o traceId ao log se estiver disponível no contexto
            const traceId = session.get('traceId');
            if (traceId) {
                obj.traceId = traceId;
            }
            return obj;
        },
    },
    // Outras configurações do Pino, se necessário
});

export default provedor;
