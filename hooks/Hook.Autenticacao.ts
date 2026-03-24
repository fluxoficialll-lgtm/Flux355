
import { useSessao } from './useSessao';
import { useLoginEmail } from './useLoginEmail';
import { useLoginGoogle } from './useLoginGoogle';
import { useLogout } from './useLogout';

export const useAutenticacao = () => {
  const sessao = useSessao();
  const loginEmail = useLoginEmail();
  const loginGoogle = useLoginGoogle();
  const logout = useLogout();

  // Agrega os estados de "processando" e "erro" de forma mais genérica
  const processando = loginEmail.processandoLoginEmail || loginGoogle.processandoLoginGoogle || logout.processando;
  const erro = loginEmail.erroLoginEmail || loginGoogle.erroLoginGoogle || logout.erro;

  return {
    // Sessão
    ...sessao,

    // Estado Geral (agregado)
    processando,
    erro,

    // Ações e estados de Login com Email
    ...loginEmail,

    // Ações e estados de Login com Google
    ...loginGoogle,

    // Ações e estados de Logout
    ...logout,
  };
};
