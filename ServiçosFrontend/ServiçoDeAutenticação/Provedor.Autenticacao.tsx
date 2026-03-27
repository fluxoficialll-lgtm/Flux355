
// ServiçosFrontend/ServiçoDeAutenticação/Provedor.Autenticacao.tsx

import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo, useCallback } from 'react';
import { getInstanciaSuprema } from './Sistema.Autenticacao.Supremo';
import { UsuarioAutenticado } from '../Contratos/Contrato.Autenticacao';
import api from '../Cliente.Backend';

// --- Tipos & Interfaces ---
type StatusSessao = 'carregando' | 'autenticado' | 'anonimo';

interface EstadoAutenticacao {
  usuario: UsuarioAutenticado | null;
  status: StatusSessao;
  erro: Error | null;
}

interface ContextoAutenticacao extends EstadoAutenticacao {
  servico: any;
}

const AuthContext = createContext<ContextoAutenticacao | undefined>(undefined);

// --- Componente Provedor ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const servicoAutenticacao = useMemo(() => getInstanciaSuprema(api), []);

    const [estado, setEstado] = useState<EstadoAutenticacao>({
        usuario: null,
        status: 'carregando',
        erro: null,
    });

    const verificarSessao = useCallback(async () => {
        console.log("AuthProvider: Verificando a sessão...");
        try {
            // CORREÇÃO CRÍTICA: O serviço retorna o usuário diretamente, não um objeto com a chave 'usuario'.
            const usuario = await servicoAutenticacao.verificarSessao();
            
            if (usuario) {
                console.log("AuthProvider: Usuário autenticado encontrado.", usuario);
                setEstado({ usuario, status: 'autenticado', erro: null });
            } else {
                console.log("AuthProvider: Nenhum usuário autenticado.");
                setEstado({ usuario: null, status: 'anonimo', erro: null });
            }
        } catch (err) {
            console.error("AuthProvider: Erro ao verificar sessão.", err);
            setEstado({ usuario: null, status: 'anonimo', erro: err as Error });
        }
    }, [servicoAutenticacao]);

    useEffect(() => {
        verificarSessao();
        window.addEventListener('authChange', verificarSessao);
        return () => {
            window.removeEventListener('authChange', verificarSessao);
        };
    }, [verificarSessao]);

    const contextoValor = useMemo(() => ({
        ...estado,
        servico: servicoAutenticacao,
    }), [estado, servicoAutenticacao]);

    return (
        <AuthContext.Provider value={contextoValor}>
            {children}
        </AuthContext.Provider>
    );
};

// --- Hook Customizado ---
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
