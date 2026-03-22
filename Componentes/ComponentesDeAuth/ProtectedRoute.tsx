
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import SistemaAutenticacaoSupremo from '../../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { ModalTelaCarregamento } from '../ComponenteDeInterfaceDeUsuario/Modal.Tela.Carregamento';


interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [authState, setAuthState] = useState(SistemaAutenticacaoSupremo.getState());

  useEffect(() => {
    const unsubscribe = SistemaAutenticacaoSupremo.subscribe(setAuthState);
    return () => unsubscribe();
  }, []);

  if (authState.loading) {
    return <ModalTelaCarregamento />;
  }

  const isUserAuthenticated = !!authState.user;

  if (!isUserAuthenticated) {
    if (location.pathname !== '/' && !location.pathname.includes('login')) {
      sessionStorage.setItem('redirect_after_login', location.pathname + location.search);
    }
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
