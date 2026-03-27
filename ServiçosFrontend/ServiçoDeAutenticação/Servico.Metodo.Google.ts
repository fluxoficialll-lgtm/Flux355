
import { config } from '../ValidaçãoDeAmbiente/config';
import { UsuarioAutenticado } from '../../Contratos/Contrato.Autenticacao';
import APIGoogle from '../APIs/APIsServicoAutenticacao/API.Servico.Metodo.Google';
import { mockServicoPerfilUsuario } from '../ServiçoDeSimulação/simulacoes/Simulacao.Perfil.Usuario';

/**
 * @file Módulo que gerencia a autenticação com o Google, alternando entre a implementação real e a simulada.
 */

// A interface de resposta esperada pelo Servico.Gestao.Login
interface GoogleLoginResponse {
    token: string;
    user: UsuarioAutenticado | null;
    isNewUser?: boolean;
}

// --- Definição da Interface do Serviço ---
interface IServicoMetodoGoogle {
    redirectToGoogleAuth(): void;
    handleAuthCallback(code: string, referredBy?: string): Promise<GoogleLoginResponse>;
}

// --- Implementação Simulada ---
class ServicoGoogleAuthSimulado implements IServicoMetodoGoogle {
    redirectToGoogleAuth(): void {
        console.log("Simulated Google Auth: Redirecionando para a página de login simulada do Google...");
    }

    async handleAuthCallback(code: string, referredBy?: string): Promise<GoogleLoginResponse> {
        console.log("Simulated Google Auth: Lidando com o callback de autenticação...");
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = await mockServicoPerfilUsuario.getOwnProfile();
        
        // CORREÇÃO: O campo deve se chamar `user`, não `usuario`.
        const simulatedResponse: GoogleLoginResponse = {
            token: 'simulated-google-jwt-token',
            user: user,
            isNewUser: Math.random() < 0.5,
        };

        console.log("Simulated Google Auth: Autenticação bem-sucedida.");
        return simulatedResponse;
    }
}

// --- Singleton/Factory ---
class ServicoMetodoGoogleSingleton {
    private static instancia: IServicoMetodoGoogle;

    private constructor() { }

    public static getInstancia(): IServicoMetodoGoogle {
        if (!ServicoMetodoGoogleSingleton.instancia) {
            if (config.VITE_APP_ENV === 'simulation') {
                console.log("INFO: [Servico.Metodo.Google] Usando MODO DE SIMULAÇÃO.");
                ServicoMetodoGoogleSingleton.instancia = new ServicoGoogleAuthSimulado();
            } else {
                console.log("INFO: [Servico.Metodo.Google] Usando API REAL.");
                // A API real deve ser compatível com a interface IServicoMetodoGoogle.
                ServicoMetodoGoogleSingleton.instancia = APIGoogle;
            }
        }
        return ServicoMetodoGoogleSingleton.instancia;
    }
}

export const getInstancia = () => ServicoMetodoGoogleSingleton.getInstancia();
