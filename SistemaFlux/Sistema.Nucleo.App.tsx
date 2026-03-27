
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ProvedorInterface } from './Provedores/Provedor.Interface';
import { ProvedorNavegacao } from './Provedores/Provedor.Navegacao';
import AppRoutes from '../routes/AppRoutes';

const Maintenance = lazy(() => import('../pages/Maintenance'));

const LoadingFallback = () => (
    <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
        <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
            Carregando...
        </span>
    </div>
);

// Este hook buscaria a configuração de uma API ou arquivo JSON.
const useMaintenanceStatus = () => {
  const [isMaintenance, setMaintenance] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // Exemplo buscando de um JSON público
    fetch('/config.json')
      .then(res => res.json())
      .then(config => {
        setMaintenance(config.maintenanceMode || false);
        setLoading(false);
      })
      .catch(() => {
        // Em caso de erro, assumimos que não está em manutenção
        setMaintenance(false);
        setLoading(false);
      });
  }, []);

  return { isLoading, isMaintenance };
};


const SistemaNucleoApp: React.FC = () => {
  const { isLoading, isMaintenance } = useMaintenanceStatus();

  if (isLoading) {
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
    <ProvedorInterface>
      <ProvedorNavegacao>
        <AppRoutes />
      </ProvedorNavegacao>
    </ProvedorInterface>
  );
};

export default SistemaNucleoApp;
