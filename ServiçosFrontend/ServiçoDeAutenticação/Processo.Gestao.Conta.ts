
import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';
import usuarioApi from '../APIs/API.Sistema.Usuario'; 
import { config } from '../ValidaçãoDeAmbiente/config';
import { PerfilUsuario } from '../Contratos/Contrato.Perfil.Usuario';

interface User extends Usuario {}

// --- Funções de Gestão de Conta ---

const completeProfile = async (profileData: Partial<Usuario>): Promise<User> => {
    const data = await usuarioApi.updateProfile(profileData);
    if (data && data.user) {
        return data.user;
    }
    throw new Error('Resposta de atualização de perfil inválida.');
};

const simulatedCompleteProfile = async (profileData: Partial<Usuario>, currentUser: User | null): Promise<User> => {
    if (!currentUser) throw new Error("Usuário não encontrado na simulação.");
    const updatedUser = { ...currentUser, ...profileData, perfilCompleto: true };
    await new Promise(resolve => setTimeout(resolve, 500));
    return updatedUser as User;
};

const excluirConta = async () => {
    await usuarioApi.excluirConta();
}

const alterarSenha = async (dados: {senhaAtual: string, novaSenha: string}) => {
    await usuarioApi.alterarSenha(dados);
}

const solicitarRedefinicaoSenha = async (email: string) => {
    await usuarioApi.solicitarRedefinicaoSenha(email);
}

const redefinirSenha = async (dados: {token: string, novaSenha: string}) => {
    await usuarioApi.redefinirSenha(dados);
}

const getOwnProfile = async (): Promise<PerfilUsuario | null> => {
    try {
        return await usuarioApi.getOwnProfile();
    } catch (error) {
        console.error("Erro no processo ao buscar o perfil próprio:", error);
        return null;
    }
};

const getPublicProfileByUsername = async (username: string): Promise<PerfilUsuario | null> => {
    try {
        return await usuarioApi.getProfileByUsername(username);
    } catch (error) {
        console.error(`Erro no processo ao buscar o perfil de ${username}:`, error);
        return null;
    }
};


// --- Exportação do Processo ---

const processoGestaoContaReal = {
    completeProfile,
    excluirConta,
    alterarSenha,
    solicitarRedefinicaoSenha,
    redefinirSenha,
    getOwnProfile,
    getPublicProfileByUsername,
};

const processoGestaoContaSimulado = {
    completeProfile: simulatedCompleteProfile,
    excluirConta, // TODO: Simular se necessário
    alterarSenha, // TODO: Simular se necessário
    solicitarRedefinicaoSenha, // TODO: Simular se necessário
    redefinirSenha, // TODO: Simular se necessário
    getOwnProfile, // TODO: Simular se necessário
    getPublicProfileByUsername, // TODO: Simular se necessário
};

export const processoGestaoConta = config.VITE_APP_ENV === 'simulation'
    ? processoGestaoContaSimulado
    : processoGestaoContaReal;
