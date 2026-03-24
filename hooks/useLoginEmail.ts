
import { useState } from 'react';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { LogSupremo } from '../ServiçosFrontend/SistemaObservabilidade/Log.Supremo';

export const useLoginEmail = () => {
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState('');

    const loginComEmail = async ({ email, senha }: { email: string; senha: string }) => {
        if (!email || !senha) {
            setErro('Email e senha são obrigatórios.');
            return;
        }
        
        setProcessando(true);
        setErro('');
        LogSupremo.Hook.LoginEmailSenha.inicioLogin(email);

        try {
            const result = await SistemaAutenticacaoSupremo.login({ email, senha });
            if (result && result.user) {
                LogSupremo.Hook.LoginEmailSenha.loginSucesso(result.user.id, email);
            }
        } catch (err: any) {
            LogSupremo.Hook.LoginEmailSenha.loginFalha(email, err);
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
