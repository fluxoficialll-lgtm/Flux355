
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createLogger } from '../../ServiçosFrontend/SistemaObservabilidade/Sistema.Mensageiro.Cliente.Backend';

const globalLogger = createLogger('Telemetria.Global');
const routeLogger = createLogger('Telemetria.Navegacao');

/**
 * Componente que centraliza a lógica de telemetria (logging) da aplicação.
 * Ele não renderiza nada visualmente, mas ativa listeners e hooks para capturar
 * e enviar eventos importantes.
 */
export const ProvedorTelemetria = () => {
  // Hook para logs globais do app (online/offline, início do app)
  useEffect(() => {
    globalLogger.info('App iniciado');
    const onOnline = () => globalLogger.info('Conexão com a internet restaurada');
    const onOffline = () => globalLogger.warn('Conexão com a internet perdida');

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // Hook para log de navegação de rotas
  const location = useLocation();
  useEffect(() => {
    routeLogger.info(`Navegou para a rota: ${location.pathname}`);
  }, [location]);

  return null; // Este componente não renderiza nada
};
