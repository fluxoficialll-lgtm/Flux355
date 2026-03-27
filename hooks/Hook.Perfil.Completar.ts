
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { servicoDeAplicacaoDeAutenticacao, AuthApplicationState } from '../ServiçosFrontend/ServicosDeAplicacao/Autenticacao.ServicoDeAplicacao';

const authService = servicoDeAplicacaoDeAutenticacao;

export const useCompleteProfile = () => {
    const navigate = useNavigate();
    const [authState, setAuthState] = useState<AuthApplicationState>(authService.getState());

    // Estado para o upload e corte da imagem de perfil
    const [previaImagem, setPreviaImagem] = useState<string | null>(null);
    const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
    const [cortarAberto, setCortarAberto] = useState(false);
    const [imagemOriginal, setImagemOriginal] = useState<string>('');

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<any>({ mode: 'onChange' });

    // Inscreve-se nas atualizações do serviço de aplicação unificado
    useEffect(() => {
        const unsubscribe = authService.subscribe(setAuthState);
        return () => unsubscribe();
    }, []);

    // Reage às mudanças de estado de autenticação
    useEffect(() => {
        const { user, loading, isAuthenticated } = authState;
        if (!loading) {
            // Se não estiver autenticado, volta para a tela de login.
            if (!isAuthenticated) {
                navigate('/login');
            } 
            // Se o usuário já tiver o perfil completo (isNewUser é false), redireciona para o feed.
            else if (user && !user.isNewUser) {
                navigate('/feed');
            }
        }
    }, [navigate, authState]);

    // Funções de manipulação da imagem de perfil
    const aoMudarImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImagemOriginal(ev.target?.result as string);
                setCortarAberto(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const aoSalvarImagemCortada = (base64Cortada: string) => {
        setPreviaImagem(base64Cortada);
        fetch(base64Cortada)
          .then(res => res.blob())
          .then(blob => {
              const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
              setArquivoSelecionado(file);
          });
    };

    const aoSubmeter = async (data: any) => {
        try {
            // TODO: Adicionar lógica de upload da imagem de perfil (arquivoSelecionado)
            // const urlDaFoto = arquivoSelecionado ? await uploadService.upload(arquivoSelecionado) : '';

            await authService.completarPerfil({
                ...data,
                // urlFoto: urlDaFoto
            });

            // A navegação pode ser removida, pois o `handleAuthChange` no serviço de aplicação
            // já cuida do redirecionamento para o feed após o perfil ser completado.
            // navigate('/feed');

        } catch (err: any) {
            console.error("Falha ao completar o perfil:", err);
            const errorMessage = err.message || 'Ocorreu um erro desconhecido.';
            
            if (errorMessage.includes('APELIDO_TAKEN')) {
                setError('nickname', { type: 'manual', message: 'Este apelido já está em uso.' });
            } else {
                setError('root.serverError', { type: 'manual', message: 'Não foi possível finalizar o cadastro.' });
            }
        }
    };

    const aoSair = () => {
        authService.logout();
        navigate('/login');
    };

    return {
        register,
        handleSubmit: handleSubmit(aoSubmeter),
        errors,
        isSubmitting,
        previaImagem,
        cortarAberto,
        setCortarAberto,
        imagemOriginal,
        aoMudarImagem,
        aoSalvarImagemCortada,
        aoSair
    };
};
