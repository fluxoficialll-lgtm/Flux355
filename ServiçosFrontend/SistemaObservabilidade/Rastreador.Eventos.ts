
import LogProvider from './Sistema.Mensageiro.Cliente.Backend';

interface EventContext {
    component?: string;
    page?: string;
    hook?: string;
}

class RastreadorDeEventos {
    constructor() {
        LogProvider.info('RastreadorDeEventos', 'Inicializado');
    }

    private formatContext(context: EventContext): string {
        const { component, page, hook } = context;
        if (component) return `Componente: ${component}`;
        if (page) return `Página: ${page}`;
        if (hook) return `Hook: ${hook}`;
        return 'Contexto não especificado';
    }

    trackPageView(path: string) {
        const pageName = path.split('/').filter(Boolean).pop() || 'home';
        LogProvider.info('RastreadorDeEventos', `Visualização de Página: ${pageName}`, { page: pageName, path });
    }

    trackEvent(category: string, action: string, context: EventContext, data: object = {}) {
        const formattedContext = this.formatContext(context);
        LogProvider.info('RastreadorDeEventos', `Evento: ${category} - ${action} (${formattedContext})`, { ...data, ...context });
    }

    trackCriticalError(error: Error | string, context: EventContext, additionalInfo: object = {}) {
        const formattedContext = this.formatContext(context);
        const errorData = {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            ...context,
            ...additionalInfo,
        };
        LogProvider.error('RastreadorDeEventos', `Erro Crítico em ${formattedContext}`, errorData);
    }

    trackNetworkRequest(requestData: object) {
        LogProvider.info('RastreadorDeEventos', 'Requisição de Rede', requestData);
    }

    trackNetworkRequestError(requestErrorData: object) {
        LogProvider.error('RastreadorDeEventos', 'Erro de Rede', requestErrorData);
    }
}

export const rastreadorDeEventos = new RastreadorDeEventos();
