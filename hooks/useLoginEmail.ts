
import { useState } from 'react';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { createHookLogger } from '../ServiçosFrontend/SistemaObservabilidade/Log.Hook';

const hookLogger = createHookLogger('useLoginEmail');

export const useLoginEmail = () => {
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState('');

    const loginComEmail = async ({ email, senha }: { email: string; senha: string }) => {
        hookLogger.logStart('loginComEmail', { email });

        if (!email || !senha) {
            const errorMessage = 'Email e senha são obrigatórios.';
            hookLogger.logError('loginComEmail', new Error(errorMessage), { email, reason: 'credenciais_ausentes' });
            setErro(errorMessage);
            return;
        }
        
        setProcessando(true);
        setErro('');

        try {
            const result = await SistemaAutenticacaoSupremo.login({ email, senha });
            if (result && result.user) {
                hookLogger.logSuccess('loginComEmail', { userId: result.user.id, email });
            }
        } catch (err: any) {
            hookLogger.logError('loginComEmail', err, { email });
            setErro(err.message || 'Credenciais inválidas.');
        } finally {
            setProcessando(false);
        }
    };

    return {
        processandoLoginEmail: processando,
        erroLoginEmail: erro,
        setErroLoginEmail: setErro,
        loginComEmail,
    };
};
