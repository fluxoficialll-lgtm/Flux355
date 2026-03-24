
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../../ServiçosFrontend/ServiçoDeAutenticação/Provedor.Autenticacao';

interface ProvedorAutenticacaoProps {
  children: React.ReactNode;
}

/**
 * Componente que encapsula toda a lógica de autenticação da aplicação.
 * Ele configura o provedor do Google OAuth e o provedor de autenticação interno.
 */
export const ProvedorAutenticacao: React.FC<ProvedorAutenticacaoProps> = ({ children }) => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};
