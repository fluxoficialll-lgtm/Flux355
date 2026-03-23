
import ClienteBackend from './Cliente.Backend.js';
import { LogSupremo } from './SistemaObservabilidade/Log.Supremo1.ts';

const ServicoConversas = {
    obterConversas: async () => {
        const contexto = "ServicoConversas.obterConversas";

        try {
            // Refatorado: Usa o ClienteBackend para a requisição GET.
            // O token e o traceId são adicionados automaticamente.
            // O log de requisição, resposta e erro também são automáticos.
            const response = await ClienteBackend.get('/conversas');

            // O traceId pode ser acessado para logs de serviço específicos, se necessário.
            const traceId = response.config.metadata.traceId;
            LogSupremo.Log.info('Conversas obtidas com sucesso.', { contexto, traceId });

            return response.data; // Retorna apenas os dados, como o axios faz.

        } catch (error) {
            // O erro já foi logado pelo interceptor do ClienteBackend.
            // Podemos adicionar um log contextual aqui se quisermos, mas o essencial já foi feito.
            const errorMessage = error.response?.data?.message || 'Falha ao buscar conversas.';
            LogSupremo.Log.error(errorMessage, { 
                contexto,
                // Opcional: obter o traceId do erro para consistência
                traceId: error.config?.metadata?.traceId 
            });
            throw new Error(errorMessage);
        }
    },
};

export default ServicoConversas;
