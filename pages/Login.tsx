
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAutenticacao } from '../hooks/Hook.Autenticacao';
import { CardOpcoesLogin } from '../Componentes/ComponentesDeAuth/Componentes/Card.Opcoes.Login';
import { CardLoginEmailSenha } from '../Componentes/ComponentesDeAuth/Componentes/Card.Login.Email.Senha';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const {
        usuario: user,
        carregandoSessao: authLoading,
        processandoLoginEmail,
        erroLoginEmail,
        loginComEmail,
        processandoLoginGoogle,
        erroLoginGoogle,
        loginComGoogle,
    } = useAutenticacao();

    const [mostrarFormEmail, setMostrarFormEmail] = useState(false);
    const [email, definirEmail] = useState('');
    const [senha, definirSenha] = useState('');

    useEffect(() => {
        if (!authLoading && user) {
            const targetUrl = user.profile_completed ? '/feed' : '/complete-profile';
            navigate(targetUrl, { replace: true });
        }
    }, [user, authLoading, navigate]);

    const submeterLoginEmail = (e: React.FormEvent) => {
        e.preventDefault();
        loginComEmail({ email, senha });
    };

    if (authLoading) {
        return (
            <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
                <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
                    Verificando Credenciais...
                </span>
            </div>
        );
    }

    const isLoading = processandoLoginEmail || processandoLoginGoogle;
    const erro = erroLoginEmail || erroLoginGoogle;

    const CamadaDeProcessamento = () => (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-[32px] flex items-center justify-center z-50">
            <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
        </div>
    );

    const BotaoGoogle = () => {
        if (!GOOGLE_CLIENT_ID) {
            return (
                <div className="w-full text-center p-4 bg-red-900/50 border border-red-500/50 rounded-lg">
                    <p className="text-white text-xs">VITE_GOOGLE_CLIENT_ID não configurada.</p>
                </div>
            );
        }
        return (
            <div className="w-full flex justify-center">
                <GoogleLogin
                    onSuccess={loginComGoogle}
                    onError={() => console.error(erroLoginGoogle || 'Login com Google falhou')}
                    shape="rectangular"
                    size="large"
                    theme="filled_black"
                />
            </div>
        );
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white font-['Inter'] relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px]"></div>
            </div>
            <div className="w-full max-w-[400px] mx-4 bg-white/5 backdrop-blur-2xl rounded-[32px] p-10 border border-white/10 shadow-2xl relative z-10 flex flex-col items-center">
                {mostrarFormEmail ? (
                    <CardLoginEmailSenha 
                        email={email}
                        definirEmail={definirEmail}
                        senha={senha}
                        definirSenha={definirSenha}
                        aoSubmeter={submeterLoginEmail}
                        aoVoltar={() => setMostrarFormEmail(false)}
                        carregando={processandoLoginEmail}
                        erro={erroLoginEmail}
                    />
                ) : (
                    <CardOpcoesLogin 
                        onSelecionarEmail={() => setMostrarFormEmail(true)}
                        slotBotaoGoogle={<BotaoGoogle />}
                    />
                )}
                
                {isLoading && <CamadaDeProcessamento />}
            </div>
        </div>
    );
};
