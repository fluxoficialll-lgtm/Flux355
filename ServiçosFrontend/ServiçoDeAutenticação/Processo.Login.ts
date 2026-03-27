
import { LoginUsuarioDTO as LoginDto } from '../../../types/Entrada/Dto.Estrutura.Usuario';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import { getInstancia as getInstanciaGoogle } from './Login.Google';
import { servicoMetodoEmailSenha } from './Login.Email.Senha';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';

const log = createServiceLogger('Servico.Gestao.Login');
const servicoMetodoGoogle = getInstanciaGoogle();


// --- Implementação do Serviço de Gestão de Login ---
const servicoGestaoLogin = {
    /**
     * Autentica um usuário usando email e senha.
     */
    login: async (dadosLogin: LoginDto) => {
        const authResult = await servicoMetodoEmailSenha.autenticar(dadosLogin);
        return authResult;
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
            return authResult;
        } catch (error) {
            log.logOperationError(operation, error);
            throw error;
        }
    },
};

export { servicoGestaoLogin };
