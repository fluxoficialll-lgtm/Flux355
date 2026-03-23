
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo'; 
import { trackingService } from '../ServiçosFrontend/ServiçoDeRastreamento/ServiçoDeRastreamento.js';
import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';
import { LogSupremo } from '../ServiçosFrontend/SistemaObservabilidade/Log.Supremo'; // Importa o logger supremo

// Hook especializado para o login com Email/Senha
export const useLoginEmailSenha = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState('');
    const [mostrarFormEmail, setMostrarFormEmail] = useState(false);

    const [email, definirEmail] = useState('');
    const [senha, definirSenha] = useState('');

    // Captura parâmetros de URL para tracking de afiliados
    useEffect(() => {
        try {
            trackingService.captureUrlParams();
        } catch (error) {
            console.error("Falha ao capturar parâmetros de URL para rastreamento:", error);
        }
    }, [location]);

    const handleRedirect = useCallback((user: Usuario) => {
        setProcessando(false);
        const targetPath = user.perfilCompleto ? '/feed' : '/complete-profile';
        navigate(targetPath, { replace: true });
    }, [navigate]);

    const submeterLoginEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !senha || processando) return;
        
        setProcessando(true);
        setErro('');
        LogSupremo.Hook.LoginEmailSenha.inicioLogin(email); // Log de início

        try {
            const result = await SistemaAutenticacaoSupremo.login({ email, senha });
            if (result && result.user) {
                LogSupremo.Hook.LoginEmailSenha.loginSucesso(result.user.id, email); // Log de sucesso
                handleRedirect(result.user);
            }
        } catch (err: any) {
            LogSupremo.Hook.LoginEmailSenha.loginFalha(email, err); // Log de falha
            setErro(err.message || 'Credenciais inválidas.');
            setProcessando(false);
        }
    };

    return {
        processando,
        erro,
        mostrarFormEmail,
        setMostrarFormEmail,
        email,
        definirEmail,
        senha,
        definirSenha,
        submeterLoginEmail,
    };
};
