
import { useEffect } from 'react';
import { useAuth } from '../ServiçosFrontend/ServiçoDeAutenticação/Provedor.Autenticacao';
import { createHookLogger } from '../ServiçosFrontend/SistemaObservabilidade/Log.Hook';

const hookLogger = createHookLogger('useSessao');

export const useSessao = () => {
  const { user, loading: carregandoSessao, error: erroSessao } = useAuth();

  useEffect(() => {
    if (carregandoSessao) {
      hookLogger.logStart('verificacaoSessao');
    } else {
      if (user) {
        hookLogger.logSuccess('verificacaoSessao', { 
          status: 'estabelecida', 
          user: { id: user.id, nome_usuario: user.nome_usuario, email: user.email }
        });
      } else {
        hookLogger.logSuccess('verificacaoSessao', { status: 'anonima' });
      }
    }
  }, [user, carregandoSessao]);

  useEffect(() => {
    if (erroSessao) {
      hookLogger.logError('verificacaoSessao', erroSessao);
    }
  }, [erroSessao]);

  return {
    usuario: user,
    carregandoSessao,
    erroSessao,
  };
};
