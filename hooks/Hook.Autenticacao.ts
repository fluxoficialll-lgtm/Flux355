
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { LoginRequest } from '../ServiçosFrontend/Contratos/Contrato.Autenticacao';

export const useAutenticacao = () => {
  const [authState, setAuthState] = useState(servicoAutenticacao.getState());
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthStateChange = (newState) => {
      setAuthState(newState);
      if (newState.isAuthenticated) {
        if (newState.isNewUser) {
          navigate('/completar-perfil');
        } else {
          navigate('/feed');
        }
      }
    };

    const unsubscribe = servicoAutenticacao.subscribe(handleAuthStateChange);
    return () => unsubscribe();
  }, [navigate]);

  const loginComEmail = useCallback(async (credentials: LoginRequest) => {
    try {
      await servicoAutenticacao.login(credentials);
    } catch (error) {
      console.error("Falha no login com email:", error);
    }
  }, []);

  const iniciarLoginComGoogle = useCallback(() => {
    servicoAutenticacao.iniciarLoginComGoogle();
  }, []);

  const logout = useCallback(async () => {
    await servicoAutenticacao.logout();
    navigate('/login');
  }, [navigate]);

  return {
    usuario: authState.user,
    autenticado: authState.isAuthenticated,
    processando: authState.loading,
    erro: authState.error,
    loginComEmail,
    iniciarLoginComGoogle,
    logout,
  };
};
