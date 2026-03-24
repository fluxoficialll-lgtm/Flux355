
import React from 'react';
import { ProvedorAutenticacao } from './Provedor.Autenticacao';
import { ProvedorInterface } from './Provedor.Interface';
import { ProvedorNavegacao } from './Provedor.Navegacao';
import { ProvedorSincronizacao } from './Provedor.Sincronizacao';

interface SistemaProvedoresProps {
  children: React.ReactNode;
}

/**
 * Componente unificador que combina todos os provedores da aplicação em uma única árvore.
 * A ordem dos provedores é importante para garantir que as dependências sejam resolvidas corretamente.
 */
export const SistemaProvedores: React.FC<SistemaProvedoresProps> = ({ children }) => {
  return (
    <ProvedorInterface>
      <ProvedorSincronizacao>
        <ProvedorAutenticacao>
          <ProvedorNavegacao>
            {children}
          </ProvedorNavegacao>
        </ProvedorAutenticacao>
      </ProvedorSincronizacao>
    </ProvedorInterface>
  );
};
