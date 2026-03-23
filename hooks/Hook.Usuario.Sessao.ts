
import { useEffect } from 'react';
import { useAuth } from '../ServiçosFrontend/ServiçoDeAutenticação/Provedor.Autenticacao.tsx';
import { LogSupremo } from '../ServiçosFrontend/SistemaObservabilidade/Log.Supremo';

/**
 * Hook customizado para acessar os dados da sessão do usuário com logging centralizado.
 * 
 * Este hook abstrai o `useAuth`, utiliza o `LogSupremo` para monitorar a sessão 
 * e fornece uma interface direta para `user` e `loading`.
 * 
 * @returns Objeto com `user` (dados do usuário ou `null`) e `loading` (booleano).
 */
export const useUsuarioSessao = () => {
  const { user, loading, error } = useAuth();

  useEffect(() => {
    if (loading) {
      LogSupremo.Hook.Sessao.inicioVerificacao();
    }
  }, []); // Executa apenas na montagem inicial

  useEffect(() => {
    if (!loading) {
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
  }, [user, loading]);

  useEffect(() => {
    if (error) {
      LogSupremo.Hook.Sessao.erroAoCarregar(error);
    }
  }, [error]);

  return { user, loading };
};
