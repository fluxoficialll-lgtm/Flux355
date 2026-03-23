
import { LoginUsuarioDTO as LoginDto } from '../../../types/Entrada/Dto.Estrutura.Usuario';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import ClienteBackend from '../Cliente.Backend';
import servicoMetodoGoogle from './Servico.Metodo.Google';
import { servicoMetodoEmailSenha } from './Servico.Metodo.EmailSenha';
import { LogSupremo } from '../SistemaObservabilidade/Log.Supremo';

/**
 * @file Gerencia o processo de login, seja por email/senha ou via Google,
 * e armazena a sessão do usuário após um login bem-sucedido.
 */

// --- Manipulador Central da Sessão ---
// Função auxiliar para padronizar o que acontece após qualquer tipo de login bem-sucedido.
const handleSuccessfulLogin = (authResult: { token: string; user: Usuario | null, isNewUser?: boolean }) => {
    LogSupremo.Depuracao.log("Iniciando handleSuccessfulLogin com:", authResult);
    const { token, user, isNewUser } = authResult;
    if (token && user) {
        localStorage.setItem('userToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        ClienteBackend.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        LogSupremo.Depuracao.log("Sessão do usuário armazenada com sucesso.", { token, user, isNewUser });
        return { token, user, isNewUser };
    }
    LogSupremo.Depuracao.error("handleSuccessfulLogin falhou: token ou usuário ausente.");
    throw new Error('Resultado de autenticação inválido recebido.');
};

// --- Implementação do Serviço de Gestão de Login ---
const servicoGestaoLogin = {
    /**
     * Autentica um usuário usando email e senha.
     */
    login: async (dadosLogin: LoginDto) => {
        const authResult = await servicoMetodoEmailSenha.autenticar(dadosLogin);
        return handleSuccessfulLogin(authResult);
    },

    /**
     * Inicia o fluxo de autenticação com o Google, redirecionando o usuário.
     */
    redirectToGoogle: () => {
        servicoMetodoGoogle.redirectToGoogleAuth();
    },

    /**
     * Lida com o callback do Google, trocando o código de autorização por um token de sessão.
     * @param code O código de autorização fornecido pelo Google no redirecionamento.
     * @param referredBy O código de referência de afiliado (opcional).
     */
    handleGoogleCallback: async (code: string, referredBy?: string) => {
        LogSupremo.Depuracao.log("handleGoogleCallback chamado com:", { code, referredBy });
        try {
            const authResult = await servicoMetodoGoogle.handleAuthCallback(code, referredBy);
            LogSupremo.Depuracao.log("Resultado recebido de handleAuthCallback:", authResult);
            return handleSuccessfulLogin(authResult);
        } catch (error) {
            LogSupremo.Depuracao.error("Erro em handleGoogleCallback:", error);
            throw error;
        }
    },
};

export { servicoGestaoLogin };
