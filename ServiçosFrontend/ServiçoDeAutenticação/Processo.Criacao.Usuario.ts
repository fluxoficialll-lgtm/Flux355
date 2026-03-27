
import { LoginUsuarioDTO as CriarContaDTO } from '../../../types/Entrada/Dto.Estrutura.Usuario';
import usuarioApi from '../APIs/API.Sistema.Usuario';
import { config } from '../ValidaçãoDeAmbiente/config';

// --- Funções de Criação de Conta ---

const criarContaReal = async (dados: CriarContaDTO) => {
    const data = await usuarioApi.criarConta(dados);
    if (data && data.user && data.token) {
        return { user: data.user, token: data.token };
    }
    throw new Error('Resposta de criação de conta inválida.');
}

const criarContaSimulada = async (dados: CriarContaDTO) => {
    console.log("Simulação: Criando conta para", dados.email);
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser = {
        id: 'mock-user-id',
        nome: 'Usuário Simulado',
        email: dados.email,
        // ... outros campos do usuário mock
    };
    return { user: mockUser, token: 'mock-token' };
};


// --- Exportação do Processo ---

export const processoCriacaoUsuario = {
    criarConta: config.VITE_APP_ENV === 'simulation' ? criarContaSimulada : criarContaReal,
};
