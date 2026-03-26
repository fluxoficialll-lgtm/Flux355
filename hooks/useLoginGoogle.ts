
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInstanciaSuprema } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
const authService = getInstanciaSuprema();
import { createHookLogger } from '../ServiçosFrontend/SistemaObservabilidade/Log.Hook';

const hookLogger = createHookLogger('useLoginGoogle');

export const useLoginGoogle = () => {
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

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
            const response = await authService.resolverSessaoLogin({ code: credentialResponse.credential, referredBy: undefined });
            hookLogger.logSuccess('loginComGoogle');

            if (response.isNewUser) {
                navigate("/completar-perfil");
            } else {
                navigate("/feed");
            }

        } catch (err: any) {
            hookLogger.logError('loginComGoogle', err);
            setErro(err.message || 'Falha no login com Google.');
        } finally {
            setProcessando(false);
        }
    }, [navigate]);

    return {
        processandoLoginGoogle: processando,
        erroLoginGoogle: erro,
        setErroLoginGoogle: setErro,
        loginComGoogle,
    };
};
