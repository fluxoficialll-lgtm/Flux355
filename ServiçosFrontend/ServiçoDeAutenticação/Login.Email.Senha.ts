
import { config } from '../ValidaçãoDeAmbiente/config';
import { UsuarioAutenticado, LoginRequest } from '../../Contratos/Contrato.Autenticacao';
import sessaoApi from '../APIs/API.Sistema.Sessao';
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
        const response = await sessaoApi.login(dadosLogin);
        
        if (response && response.token && response.usuario) {
            console.log("Real Email/Senha Auth: Autenticação bem-sucedida.");
            return { token: response.token, user: response.usuario };
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
