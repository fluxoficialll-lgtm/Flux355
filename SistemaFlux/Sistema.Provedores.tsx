
import React, { Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ProvedorModal } from '../Componentes/ComponenteDeInterfaceDeUsuario/Sistema.Modal';
import { GlobalTracker } from '../Componentes/layout/GlobalTracker';
import { DeepLinkHandler } from '../Componentes/layout/DeepLinkHandler';
import { AuthProvider } from '../ServiçosFrontend/ServiçoDeAutenticação/Provedor.Autenticacao';
import MonitorDeErrosDeInterface from '../Componentes/ComponentesDePrevençãoDeErros/MonitorDeErrosDeInterface';

// Instância do QueryClient
const queryClient = new QueryClient();

// Fallback de Carregamento
const LoadingFallback = () => (
    <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
        <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
            Carregando...
        </span>
    </div>
);

export const SistemaProvedores: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // É seguro buscar a variável de ambiente aqui, pois este código roda no cliente.
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  return (
    <MonitorDeErrosDeInterface>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <ProvedorModal>
              <HashRouter>
                <GlobalTracker />
                <DeepLinkHandler />
                <Suspense fallback={<LoadingFallback />}>
                  {children}
                </Suspense>
              </HashRouter>
            </ProvedorModal>
          </AuthProvider>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </MonitorDeErrosDeInterface>
  );
};
