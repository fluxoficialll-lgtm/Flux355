
import { config } from '../ValidaçãoDeAmbiente/config';
import apiPerfilUsuario from '../APIs/APIsServicoPerfil/API.Servico.Perfil.Usuario';
import { mockServicoPerfilUsuario } from '../ServiçoDeSimulação/simulacoes/Simulacao.Perfil.Usuario';
import { UsuarioAutenticado } from '../../Contratos/Contrato.Autenticacao';

// --- Interface Comum ---
// Utiliza o tipo do frontend, `UsuarioAutenticado`, garantindo o desacoplamento.
export interface IServicoPerfilUsuario {
    getOwnProfile(): Promise<UsuarioAutenticado | null>;
    getPublicProfileByUsername(username: string): Promise<UsuarioAutenticado | null>;
    updateProfile(userId: string, profileData: Partial<UsuarioAutenticado>): Promise<UsuarioAutenticado | null>;
}

// --- Implementação Real ---
// Retorna diretamente os dados da API, que devem ser compatíveis com a interface.
class ServicoPerfilUsuarioReal implements IServicoPerfilUsuario {
    async getOwnProfile(): Promise<UsuarioAutenticado | null> {
        try {
            // A API já deve retornar um objeto compatível com UsuarioAutenticado
            return await apiPerfilUsuario.getMeuPerfil();
        } catch (error) {
            console.error("Erro no serviço real ao buscar o perfil próprio:", error);
            return null;
        }
    }

    async getPublicProfileByUsername(username: string): Promise<UsuarioAutenticado | null> {
        try {
            return await apiPerfilUsuario.getPerfilUsuarioPorNome(username);
        } catch (error) {
            console.error(`Erro no serviço real ao buscar o perfil de ${username}:`, error);
            return null;
        }
    }

    async updateProfile(userId: string, profileData: Partial<UsuarioAutenticado>): Promise<UsuarioAutenticado | null> {
        // Este método ainda não está implementado na API real.
        console.warn("O método updateProfile não está implementado no serviço real.");
        return null;
    }
}

// --- Seleção e Exportação ---
let servicoSelecionado: IServicoPerfilUsuario;

if (config.VITE_APP_ENV === 'simulation') {
    console.log("INFO: Usando MODO DE SIMULAÇÃO para o Serviço de Perfil de Usuário.");
    // O mock já está tipado corretamente.
    servicoSelecionado = mockServicoPerfilUsuario;
} else {
    console.log("INFO: Usando Serviço de Perfil de Usuário REAL (Produção).");
    servicoSelecionado = new ServicoPerfilUsuarioReal();
}

export const servicoGestaoPerfil = servicoSelecionado;
