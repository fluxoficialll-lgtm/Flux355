
import { useState, useCallback } from 'react';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { createHookLogger } from '../ServiçosFrontend/SistemaObservabilidade/Log.Hook';

const hookLogger = createHookLogger('useLoginGoogle');

export const useLoginGoogle = () => {
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState('');

    const loginComGoogle = useCallback(async (credentialResponse: any) => {
        hookLogger.logStart('loginComGoogle', { hasCredential: !!credentialResponse?.credential });

        if (!credentialResponse || !credentialResponse.credential) {
            const errorMessage = "A credencial do Google fornecida é inválida ou nula.";
            hookLogger.logError('loginComGoogle', new Error(errorMessage), { reason: 'validacao_credencial' });
            setErro(errorMessage);
            return;
        }

        setProcessando(true);
        setErro('');

        try {
            await SistemaAutenticacaoSupremo.loginWithGoogle(credentialResponse.credential, undefined);
            hookLogger.logSuccess('loginComGoogle');
        } catch (err: any) {
            hookLogger.logError('loginComGoogle', err);
            setErro(err.message || 'Falha no login com Google.');
        } finally {
            setProcessando(false);
        }
    }, []);

    return {
        processandoLoginGoogle: processando,
        erroLoginGoogle: erro,
        setErroLoginGoogle: setErro,
        loginComGoogle,
    };
};
