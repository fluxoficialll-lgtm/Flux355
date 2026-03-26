
import { LoginUsuarioDTO as LoginDto } from '../../../types/Entrada/Dto.Estrutura.Usuario';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import ClienteBackend from '../Cliente.Backend';
import { getInstancia as getInstanciaGoogle } from './Servico.Metodo.Google';
import { servicoMetodoEmailSenha } from './Servico.Metodo.EmailSenha';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';

const log = createServiceLogger('Servico.Gestao.Login');
const servicoMetodoGoogle = getInstanciaGoogle();

/**
 * @file Gerencia o processo de login, seja por email/senha ou via Google,
 * e armazena a sessão do usuário após um login bem-sucedido.
 */

// --- Manipulador Central da Sessão ---
const handleSuccessfulLogin = (authResult: { token: string; user: Usuario | null, isNewUser?: boolean }) => {
    const operation = 'handleSuccessfulLogin';
    log.logOperationStart(operation, authResult);
    const { token, user, isNewUser } = authResult;
    if (token && user) {
        localStorage.setItem('userToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        ClienteBackend.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        log.logOperationSuccess(operation, { token, user, isNewUser });
        return { token, user, isNewUser };
    }
    log.logOperationError(operation, new Error('Token ou usuário ausente.'));
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
     */
    handleGoogleCallback: async (code: string, referredBy?: string) => {
        const operation = 'handleGoogleCallback';
        log.logOperationStart(operation, { code, referredBy });
        try {
            const authResult = await servicoMetodoGoogle.handleAuthCallback(code, referredBy);
            log.logInfo('Resultado recebido de handleAuthCallback:', authResult);
            return handleSuccessfulLogin(authResult);
        } catch (error) {
            log.logOperationError(operation, error);
            throw error;
        }
    },
};

export { servicoGestaoLogin };
