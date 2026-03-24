
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { GlobalTracker } from '../../Componentes/layout/GlobalTracker';
import { DeepLinkHandler } from '../../Componentes/layout/DeepLinkHandler';
import { ProvedorTelemetria } from './Provedor.Telemetria'; // Importa o provedor de telemetria

interface ProvedorNavegacaoProps {
  children: React.ReactNode;
}

/**
 * Componente que configura o sistema de navegação da aplicação, incluindo
 * o roteador, rastreadores globais, manipuladores de deep link e telemetria de navegação.
 */
export const ProvedorNavegacao: React.FC<ProvedorNavegacaoProps> = ({ children }) => {
  return (
    <HashRouter>
      <GlobalTracker />
      <DeepLinkHandler />
      <ProvedorTelemetria />
      {children}
    </HashRouter>
  );
};
