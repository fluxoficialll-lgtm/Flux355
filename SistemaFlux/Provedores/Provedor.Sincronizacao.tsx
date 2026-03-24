
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

interface ProvedorSincronizacaoProps {
  children: React.ReactNode;
}

/**
 * Componente que configura o React Query para gerenciamento de estado assíncrono,
 * cache de dados e sincronização com o servidor.
 */
export const ProvedorSincronizacao: React.FC<ProvedorSincronizacaoProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
