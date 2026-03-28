
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../ServiçosFrontend/serviços/provedor/AuthProvider';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application';

export const GoogleAuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const { erro, autenticado, usuario } = useAuth();

    useEffect(() => {
        // Extrai o fragmento da URL (parte após o '#')
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const idToken = params.get('id_token');

        if (idToken) {
            // Usa o id_token para finalizar o login
            servicoAutenticacao.finalizarLoginComGoogle(idToken);
        } else {
            console.error("Nenhum id_token encontrado no callback do Google.");
            navigate('/login?error=auth_failed');
        }
    }, [navigate]);

    // Lida com erros durante o processo
    useEffect(() => {
        if (erro) {
            navigate(`/login?error=${erro}`);
        }
    }, [erro, navigate]);

    // Redireciona o usuário após a autenticação
    useEffect(() => {
        if (autenticado) {
            if (usuario && !usuario.perfilCompleto) {
                navigate('/CompleteProfile'); 
            } else {
                navigate('/Feed');
            }
        }
    }, [autenticado, usuario, navigate]);

    return (
        <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
            <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
                Finalizando autenticação...
            </span>
        </div>
    );
};
