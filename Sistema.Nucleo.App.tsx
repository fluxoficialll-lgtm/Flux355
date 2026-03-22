
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter } from 'react-router-dom';
import { ProvedorModal } from './Componentes/ComponenteDeInterfaceDeUsuario/Sistema.Modal';
import { GlobalTracker } from './Componentes/layout/GlobalTracker';
import { DeepLinkHandler } from './Componentes/layout/DeepLinkHandler';
import AppRoutes from './routes/AppRoutes';
import { inicializarBoot } from './Sistema.Flux.Boot';
import { configurarAmbiente } from './Sistema.Flux.Ambiente';
import MonitorDeErrosDeInterface from './Componentes/ComponentesDePrevençãoDeErros/MonitorDeErrosDeInterface.jsx';
import { AuthProvider } from './ServiçosFrontend/ServiçoDeAutenticação/Provedor.Autenticacao.tsx'; // Corrigido o caminho

// Importações da lógica de sincronização
import SistemaAutenticacaoSupremo from './ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
// [Gemini] As seguintes importações foram comentadas porque os arquivos não foram encontrados, o que estava causando a falha no build.
// import { servicoDeSincronizacaoDeSessao } from './ServiçosFrontend/ServiçoDeSincronização/ServicoDeSincronizacaoDeSessao.js';
// import { SyncState } from './ServiçosFrontend/ServiçoDeSincronização/EstadoDeSincronizacao.js';
// import { socketService } from './ServiçosFrontend/ServiçoDeSincronização/Servico.Sincronizacao.Tempo.Real.js';

const Maintenance = lazy(() => import('./pages/Maintenance'));

const LoadingFallback = () => (
    <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
        <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
            Iniciando Protocolos...
        </span>
    </div>
);

const SistemaNucleoApp: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        inicializarBoot();
        configurarAmbiente();
        
        const config = { maintenanceMode: false }; 
        setIsMaintenance(config.maintenanceMode);

        // [Gemini] A lógica de sincronização foi comentada porque os arquivos de serviço não foram encontrados.
        // O app irá inicializar sem a sincronização de sessão em tempo real ou em background.
        // const user = SistemaAutenticacaoSupremo.getCurrentUser();
        // if (user?.email) {
        //     socketService.connect();
        //     if (SyncState.shouldDoFullSync()) {
        //         await servicoDeSincronizacaoDeSessao.performFullSync();
        //     } else {
        //         await servicoDeSincronizacaoDeSessao.performBackgroundSync();
        //     }
        // } else {
        //     await servicoDeSincronizacaoDeSessao.performBackgroundSync();
        // }

      } catch (e) {
        console.error("Erro crítico no boot do sistema:", e);
        setIsMaintenance(false); 
      } finally {
        setIsReady(true);
      }
    };
    
    initializeApp();

    // [Gemini] A sincronização em background foi desativada porque os arquivos de serviço não foram encontrados.
    // const backgroundSyncInterval = setInterval(() => {
    //   if (SistemaAutenticacaoSupremo.getCurrentUser()) {
    //     servicoDeSincronizacaoDeSessao.performBackgroundSync();
    //   }
    // }, 300000); // A cada 5 minutos

    return () => {
      // clearInterval(backgroundSyncInterval);
      // socketService.disconnect();
    };
  }, []);

  if (!isReady) {
    return <LoadingFallback />;
  }

  if (isMaintenance) {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Maintenance />
        </Suspense>
    );
  }

  return (
    <MonitorDeErrosDeInterface>
      <AuthProvider>
        <ProvedorModal>
          <HashRouter>
            <GlobalTracker />
            <DeepLinkHandler />
            <Suspense fallback={<LoadingFallback />}>
              <AppRoutes />
            </Suspense>
          </HashRouter>
        </ProvedorModal>
      </AuthProvider>
    </MonitorDeErrosDeInterface>
  );
};

export default SistemaNucleoApp;
