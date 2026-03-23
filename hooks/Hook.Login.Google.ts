import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { trackingService } from '../ServiçosFrontend/ServiçoDeRastreamento/ServiçoDeRastreamento.js';
import { LogSupremo } from '../ServiçosFrontend/SistemaObservabilidade/Log.Supremo.ts';

export const useGoogleLogin = () => {
    const location = useLocation();
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState<any>(null);

    useEffect(() => {
        try {
            trackingService.captureUrlParams();
        } catch (error) {
            LogSupremo.Depuracao.error("Falha ao capturar parâmetros de URL para rastreamento:", error);
        }
    }, [location]);

    const submeterLoginGoogle = useCallback(async (credentialResponse: any) => {
        LogSupremo.Depuracao.log("Iniciando login com Google...");

        if (!credentialResponse || !credentialResponse.credential) {
            LogSupremo.Depuracao.error("Credencial do Google inválida.");
            setErro(new Error("Credencial do Google inválida."));
            return;
        }

        setProcessando(true);
        setErro(null);

        try {
            const referredBy = trackingService.getAffiliateRef() || undefined;
            LogSupremo.Depuracao.log("Referral code:", referredBy);
            await SistemaAutenticacaoSupremo.loginWithGoogle(credentialResponse.credential, referredBy);
            LogSupremo.Depuracao.log("Login com Google concluído com sucesso.");
        } catch (err) {
            LogSupremo.Depuracao.error("Erro durante o login com Google:", err);
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
