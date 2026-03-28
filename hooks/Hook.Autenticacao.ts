
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoDeAplicacaoDeAutenticacao } from '../ServiçosFrontend/ServicosDeAplicacao/Autenticacao.ServicoDeAplicacao';
import { ILoginEmailParams } from '../ServiçosFrontend/Contratos/Contrato.Autenticacao';
import { useAuth } from '../ServiçosFrontend/serviços/provedor/AuthProvider'; // Importa o hook de contexto

export const useAutenticacao = () => {
  const { usuario, autenticado, processando, erro } = useAuth(); // Consome o estado do contexto
  const navigate = useNavigate();

  useEffect(() => {
    // A inscrição agora é feita no AuthProvider.
    // Este useEffect reage às mudanças de estado para realizar a navegação.
    const state = servicoDeAplicacaoDeAutenticacao.getState();
    if (state.postLoginAction === 'navigateToCompleteProfile') {
      navigate('/completar-perfil');
    } else if (state.postLoginAction === 'navigateToFeed') {
      navigate('/feed');
    }
    // Re-executa o efeito quando o estado de autenticado muda.
  }, [autenticado, navigate]);

  // As funções de ação agora são simplesmente passadas do serviço de aplicação.
  const loginComEmail = useCallback(async (credentials: ILoginEmailParams) => {
    try {
      await servicoDeAplicacaoDeAutenticacao.loginComEmail(credentials);
    } catch (error) {
      console.error("Falha no login com email:", error);
    }
  }, []);

  const finalizarLoginComToken = useCallback(async (token: string) => {
    try {
        await servicoDeAplicacaoDeAutenticacao.finalizarLoginComToken(token);
    } catch (error) {
        console.error("Falha ao finalizar login com token:", error);
    }
  }, []);

  const iniciarLoginComGoogle = useCallback(() => {
    servicoDeAplicacaoDeAutenticacao.iniciarLoginComGoogle();
  }, []);

  const logout = useCallback(async () => {
    await servicoDeAplicacaoDeAutenticacao.logout();
    navigate('/login');
  }, [navigate]);

  // Retorna o estado do contexto e as funções de ação.
  return {
    usuario,
    autenticado,
    processando,
    erro,
    loginComEmail,
    iniciarLoginComGoogle,
    finalizarLoginComToken,
    logout,
  };
};
