
import { useState, useCallback } from 'react';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { LogSupremo } from '../ServiçosFrontend/SistemaObservabilidade/Log.Supremo';

// Garante que o objeto de log para Hook.Login.Google exista.
if (!LogSupremo.Hook.LoginGoogle) {
    LogSupremo.Hook.LoginGoogle = {
        log: (estagio, dados) => LogSupremo.log('Hook.Login.Google', estagio, dados),
        inicioFluxo: () => LogSupremo.Hook.LoginGoogle.log('inicio_fluxo', {}),
        callbackRecebido: (credencial) => LogSupremo.Hook.LoginGoogle.log('callback_recebido', { credencial }),
        loginSucesso: (usuarioId, isNewUser) => LogSupremo.Hook.LoginGoogle.log('login_sucesso', { usuarioId, isNewUser }),
        loginFalha: (erro, estagio) => LogSupremo.Hook.LoginGoogle.log('login_falha', { erro: erro.message, estagio }),
    };
}

export const useLoginGoogle = () => {
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState('');

    const loginComGoogle = useCallback(async (credentialResponse: any) => {
        LogSupremo.Hook.LoginGoogle.inicioFluxo();

        if (!credentialResponse || !credentialResponse.credential) {
            const credencialInvalidaErro = new Error("A credencial do Google fornecida é inválida ou nula.");
            LogSupremo.Hook.LoginGoogle.loginFalha(credencialInvalidaErro, 'validacao_credencial');
            setErro(credencialInvalidaErro.message);
            return;
        }

        LogSupremo.Hook.LoginGoogle.callbackRecebido(credentialResponse.credential.substring(0, 15) + '...');
        setProcessando(true);
        setErro('');

        try {
            const { user: loggedInUser, isNewUser } = await SistemaAutenticacaoSupremo.loginWithGoogle(credentialResponse.credential, undefined);
            LogSupremo.Hook.LoginGoogle.loginSucesso(loggedInUser.id, isNewUser);
        } catch (err: any) {
            LogSupremo.Hook.LoginGoogle.loginFalha(err, 'submissao_login');
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
