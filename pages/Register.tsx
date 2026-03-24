
import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAutenticacao } from '../hooks/Hook.Autenticacao';
import { useHookCriacaoPerfilFlux } from '../hooks/Hook.Criacao.Perfil.Flux';
import { CardCriacaoContaEmailSenha } from '../Componentes/ComponentesDeAuth/Componentes/Card.Criacao.Conta.Email.Senha';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { usuario: user, carregandoSessao: authLoading } = useAutenticacao();
  const {
    dados,
    updateField,
    errors,
    loading,
    isValid,
    handleSubmit,
  } = useHookCriacaoPerfilFlux();

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

  if (user) {
    return <Navigate to={user.profile_completed ? '/feed' : '/complete-profile'} replace />;
  }

  return (
    <div className="h-screen w-full overflow-y-auto bg-[#0c0f14] text-white font-['Inter'] flex items-center justify-center p-5">
        <header className="fixed top-0 left-0 w-full flex justify-start p-5 z-10">
            <button onClick={() => navigate('/')} className="bg-white/10 p-2 rounded-full border border-[#00c2ff] text-[#00c2ff]">
                <i className="fa-solid fa-arrow-left"></i>
            </button>
        </header>

        <CardCriacaoContaEmailSenha 
            email={dados.email}
            setEmail={(value) => updateField('email', value)}
            password={dados.senha}
            setPassword={(value) => updateField('senha', value)}
            confirmPassword={dados.confirmacaoSenha}
            setConfirmPassword={(value) => updateField('confirmacaoSenha', value)}
            termsAccepted={dados.termosAceitos}
            setTermsAccepted={(value) => updateField('termosAceitos', value)}
            errors={errors} 
            loading={loading} 
            isValid={isValid} 
            referredBy={dados.indicadoPor}
            onSubmit={handleSubmit}
        />
    </div>
  );
};
