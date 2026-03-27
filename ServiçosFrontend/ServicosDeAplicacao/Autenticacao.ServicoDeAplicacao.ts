
import { servicoAutenticacao } from '../ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { createApplicationServiceLogger } from '../SistemaObservabilidade/Log.Aplication';
import { ILoginEmailParams } from '../Contratos/Contrato.Autenticacao';

const appServiceLogger = createApplicationServiceLogger('Autenticacao.ServicoDeAplicacao');

const loginComEmail = async (params: ILoginEmailParams) => {
    const { email, senha } = params;
    appServiceLogger.logOperationStart('loginComEmail', { email });

    if (!email || !senha) {
        const errorMessage = 'Email e senha são obrigatórios.';
        appServiceLogger.logOperationError('loginComEmail', new Error(errorMessage), { email, reason: 'credenciais_ausentes' });
        throw new Error(errorMessage);
    }

    try {
        const result = await servicoAutenticacao.login({ email, senha });
        
        if (result && result.user) {
            appServiceLogger.logOperationSuccess('loginComEmail', { userId: result.user.id, email });
            return result;
        } else {
            const errorMessage = 'Resposta inesperada do serviço de autenticação.';
            appServiceLogger.logOperationError('loginComEmail', new Error(errorMessage), { email });
            throw new Error(errorMessage);
        }
    } catch (err: any) {
        appServiceLogger.logOperationError('loginComEmail', err, { email });
        throw err;
    }
};

const iniciarLoginComGoogle = () => {
    appServiceLogger.logOperationStart('iniciarLoginComGoogle');
    try {
        servicoAutenticacao.iniciarLoginComGoogle();
        appServiceLogger.logOperationSuccess('iniciarLoginComGoogle', { message: 'Redirecionamento para o Google iniciado.' });
    } catch (err: any) {
        appServiceLogger.logOperationError('iniciarLoginComGoogle', err, { message: err.message });
        throw new Error(err.message || 'Ocorreu um erro ao tentar redirecionar para o login do Google.');
    }
};

const logout = async () => {
    appServiceLogger.logOperationStart('logout');
    try {
        await servicoAutenticacao.logout();
        appServiceLogger.logOperationSuccess('logout', { message: 'Logout bem-sucedido.' });
    } catch (err: any) {
        appServiceLogger.logOperationError('logout', err);
        throw err;
    }
};

// Repassando os métodos de observabilidade do serviço principal
const subscribe = (listener: (state: any) => void) => {
    return servicoAutenticacao.subscribe(listener);
};

const getState = () => {
    return servicoAutenticacao.getState();
};



export const servicoDeAplicacaoDeAutenticacao = {
    loginComEmail,
    iniciarLoginComGoogle,
    logout,
    subscribe,
    getState,
};
