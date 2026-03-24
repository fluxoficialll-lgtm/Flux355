
import { useEffect } from 'react';
import { useAuth } from '../ServiçosFrontend/ServiçoDeAutenticação/Provedor.Autenticacao';
import { LogSupremo } from '../ServiçosFrontend/SistemaObservabilidade/Log.Supremo';

export const useSessao = () => {
  const { user, loading: carregandoSessao, error: erroSessao } = useAuth();

  useEffect(() => {
    if (carregandoSessao) {
      LogSupremo.Hook.Sessao.inicioVerificacao();
    }
  }, [carregandoSessao]);

  useEffect(() => {
    if (!carregandoSessao) {
      if (user) {
        LogSupremo.Hook.Sessao.sessaoEstabelecida({
          id: user.id,
          nome_usuario: user.nome_usuario,
          email: user.email
        });
      } else {
        LogSupremo.Hook.Sessao.sessaoAnonima();
      }
    }
  }, [user, carregandoSessao]);

  useEffect(() => {
    if (erroSessao) {
      LogSupremo.Hook.Sessao.erroAoCarregar(erroSessao);
    }
  }, [erroSessao]);

  return {
    usuario: user,
    carregandoSessao,
    erroSessao,
  };
};
