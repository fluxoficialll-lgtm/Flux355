
import { config } from '../ValidaçãoDeAmbiente/config';
import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';

// Importa as implementações real e simulada
import * as APIGoogle from '../APIs/APIsServicoAutenticacao/API.Servico.Metodo.Google';
import * as SimulacaoGoogle from '../ServiçoDeSimulação/simulacoes/Simulacao.Servico.Metodo.Google';

/**
 * @file Módulo seletor que exporta a implementação da API de autenticação do Google (real ou simulada)
 * com base na configuração do ambiente.
 */

// --- Definição da Interface do Serviço ---
// Garante que ambas as implementações (real e simulada) sigam o mesmo contrato.
interface IServicoMetodoGoogle {
    redirectToGoogleAuth(): void;
    handleAuthCallback(code: string, referredBy?: string): Promise<{ token: string; user: Usuario | null, isNewUser?: boolean }>;
}

// --- Seleção da Implementação ---
let servicoMetodoGoogle: IServicoMetodoGoogle;

if (config.VITE_APP_ENV === 'simulation') {
    console.log("INFO: [Servico.Metodo.Google] Usando MODO DE SIMULAÇÃO.");
    servicoMetodoGoogle = SimulacaoGoogle;
} else {
    console.log("INFO: [Servico.Metodo.Google] Usando API REAL.");
    servicoMetodoGoogle = APIGoogle;
}

// --- Exportação do Serviço Selecionado ---

class ServicoMetodoGoogleSingleton {
    private static instancia: IServicoMetodoGoogle;

    private constructor() { }

    public static getInstancia(): IServicoMetodoGoogle {
        if (!ServicoMetodoGoogleSingleton.instancia) {
            ServicoMetodoGoogleSingleton.instancia = servicoMetodoGoogle;
        }
        return ServicoMetodoGoogleSingleton.instancia;
    }
}

export const getInstancia = () => ServicoMetodoGoogleSingleton.getInstancia();
