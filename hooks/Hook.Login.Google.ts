
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { trackingService } from '../ServiçosFrontend/ServiçoDeRastreamento/ServiçoDeRastreamento.js';
import { LogSupremo } from '../ServiçosFrontend/SistemaObservabilidade/Log.Supremo';

export const useGoogleLogin = () => {
    const location = useLocation();
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState<any>(null);

    useEffect(() => {
        try {
            trackingService.captureUrlParams();
        } catch (error: any) {
            // Usando o logger de falhas do próprio hook para consistência
            LogSupremo.Hook.LoginGoogle.loginFalha(error, 'captura_parametros_url');
        }
    }, [location]);

    const submeterLoginGoogle = useCallback(async (credentialResponse: any) => {
        LogSupremo.Hook.LoginGoogle.inicioFluxo();

        if (!credentialResponse || !credentialResponse.credential) {
            const credencialInvalidaErro = new Error("A credencial do Google fornecida é inválida ou nula.");
            LogSupremo.Hook.LoginGoogle.loginFalha(credencialInvalidaErro, 'validacao_credencial');
            setErro(credencialInvalidaErro);
            return;
        }

        LogSupremo.Hook.LoginGoogle.callbackRecebido(credentialResponse.credential.substring(0, 15) + '...');
        setProcessando(true);
        setErro(null);

        try {
            const referredBy = trackingService.getAffiliateRef() || undefined;
            // Supondo que o serviço de autenticação retorne o usuário e se ele é novo
            const { user, isNewUser } = await SistemaAutenticacaoSupremo.loginWithGoogle(credentialResponse.credential, referredBy);
            
            LogSupremo.Hook.LoginGoogle.loginSucesso(user.id, isNewUser);

        } catch (err: any) {
            LogSupremo.Hook.LoginGoogle.loginFalha(err, 'submissao_login');
            setErro(err);
        } finally {
            setProcessando(false);
        }
    }, []);

    return {
        processando,
        erro,
        submeterLoginGoogle,
    };
};
