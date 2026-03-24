
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { useAuth } from '../ServiçosFrontend/ServiçoDeAutenticação/Provedor.Autenticacao';
import { LogSupremo } from '../ServiçosFrontend/SistemaObservabilidade/Log.Supremo';

export const useLogout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState('');

    const submeterLogout = async () => {
        setProcessando(true);
        setErro('');
        LogSupremo.log('Hook.Autenticacao', 'inicio_logout', { userId: user?.id });
        try {
            await SistemaAutenticacaoSupremo.logout();
            LogSupremo.log('Hook.Autenticacao', 'logout_sucesso', { userId: user?.id });
            navigate('/login');
        } catch (err: any) {
            LogSupremo.log('Hook.Autenticacao', 'logout_falha', { userId: user?.id, erro: err.message });
            setErro(err.message || 'Falha ao fazer logout.');
        } finally {
            setProcessando(false);
        }
    };

    return {
        processando,
        erro,
        setErro,
        submeterLogout,
    };
};
