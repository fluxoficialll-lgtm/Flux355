
import React, { Suspense } from 'react';
import { ProvedorModal } from '../../Componentes/ComponenteDeInterfaceDeUsuario/Sistema.Modal';
import MonitorDeErrosDeInterface from '../../Componentes/ComponentesDePrevençãoDeErros/MonitorDeErrosDeInterface';

// Componente de fallback para o Suspense
const LoadingFallback = () => (
    <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
        <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
            Carregando...
        </span>
    </div>
);

interface ProvedorInterfaceProps {
  children: React.ReactNode;
}

/**
 * Componente que gerencia os elementos da interface do usuário, como modais,
 * monitoramento de erros e o fallback de carregamento para componentes lazy-loaded.
 */
export const ProvedorInterface: React.FC<ProvedorInterfaceProps> = ({ children }) => {
  return (
    <MonitorDeErrosDeInterface>
      <ProvedorModal>
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </ProvedorModal>
    </MonitorDeErrosDeInterface>
  );
};
