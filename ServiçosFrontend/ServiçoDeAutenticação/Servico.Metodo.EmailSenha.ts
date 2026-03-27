
import { config } from '../ValidaçãoDeAmbiente/config';
import { UsuarioAutenticado, LoginRequest } from '../../Contratos/Contrato.Autenticacao';
import authApi from '../APIs/API.Sistema.Autenticacao.Supremo';
import { mockServicoPerfilUsuario } from '../ServiçoDeSimulação/simulacoes/Simulacao.Perfil.Usuario';

// A interface de resposta esperada pelo Servico.Gestao.Login
interface LoginResponse {
    token: string;
    user: UsuarioAutenticado | null;
}

// --- Interface ---
export interface IServicoEmailSenhaAuth {
    autenticar(dadosLogin: LoginRequest): Promise<LoginResponse>;
}

// --- Implementação Real ---
class ServicoEmailSenhaAuthReal implements IServicoEmailSenhaAuth {
    async autenticar(dadosLogin: LoginRequest): Promise<LoginResponse> {
        console.log("Real Email/Senha Auth: Iniciando autenticação...");
        // A API real retorna a resposta dentro de `data`
        const response = await authApi.login(dadosLogin.email, dadosLogin.password);
        
        if (response && response.data && response.data.token && response.data.user) {
            console.log("Real Email/Senha Auth: Autenticação bem-sucedida.");
            // A API real usa 'user', não 'usuario'.
            return { token: response.data.token, user: response.data.user };
        }

        throw new Error('Resposta de login inválida do servidor.');
    }
}

// --- Implementação Simulada ---
class ServicoEmailSenhaAuthSimulado implements IServicoEmailSenhaAuth {
    async autenticar(dadosLogin: LoginRequest): Promise<LoginResponse> {
        console.log(`Simulated Email/Senha Auth: Logando com ${dadosLogin.email}...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const user = await mockServicoPerfilUsuario.getOwnProfile();
        
        // CORREÇÃO: O campo deve se chamar `user`, não `usuario`.
        const simulatedResponse: LoginResponse = {
            token: `simulated-email-jwt-token-for-${dadosLogin.email}`,
            user: user,
        };

        console.log("Simulated Email/Senha Auth: Autenticação bem-sucedida.");
        return simulatedResponse;
    }
}

// --- Seleção do Serviço ---
let servicoSelecionado: IServicoEmailSenhaAuth;

if (config.VITE_APP_ENV === 'simulation') {
    console.log("INFO: Usando MODO DE SIMULAÇÃO para o Serviço de Autenticação Email/Senha.");
    servicoSelecionado = new ServicoEmailSenhaAuthSimulado();
} else {
    console.log("INFO: Usando Serviço de Autenticação Email/Senha REAL (Produção).");
    servicoSelecionado = new ServicoEmailSenhaAuthReal();
}

export const servicoMetodoEmailSenha = servicoSelecionado;
