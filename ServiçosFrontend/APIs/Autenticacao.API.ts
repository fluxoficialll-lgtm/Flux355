
// Presumimos que um cliente backend genérico já existe e está configurado.
// Este cliente (ex: axios) é quem de fato faz as requisições HTTP.
import { clienteBackend } from '../Cliente.Backend.js'; 
import { ILoginEmailParams } from '../Contratos/Contrato.Autenticacao';
import { IRegistroParams } from '../ServiçoDeAutenticação/Processo.Registrar';
import { IPerfilParaCompletar } from '../ServiçoDeAutenticação/Processo.Completar.Perfil';

/**
 * @file Autenticacao.API.ts
 * @description Módulo centralizado para todas as chamadas de API relacionadas à autenticação.
 */
export const AutenticacaoAPI = {

  // ... outros métodos (loginComEmail, registrar, etc.) ...

  /**
   * Envia as credenciais de email e senha para o endpoint de login da API.
   * @param params As credenciais de login.
   * @returns A resposta da API, contendo o usuário e o token.
   */
  loginComEmail: async (params: ILoginEmailParams): Promise<any> => {
    console.log("API: Enviando requisição de login para o backend", params);
    // Em um cenário real, a chamada seria assim:
    // const { data } = await clienteBackend.post('/auth/login', params);
    // return data;

    // --- Início da Simulação ---
    await new Promise(resolve => setTimeout(resolve, 300));
    if (params.email === "teste@gmail.com" && params.senha === "12345678") {
      return {
        token: "jwt.token.simulado",
        usuario: { id: "usr_123", email: "teste@gmail.com", apelido: "Testador", precisaCompletarPerfil: false }
      };
    }
    throw new Error("Credenciais inválidas");
    // --- Fim da Simulação ---
  },

  /**
   * Envia os dados de registro para o endpoint de criação de usuário.
   * @param params Os dados para o registro.
   */
  registrar: async (params: IRegistroParams): Promise<any> => {
    console.log("API: Enviando requisição de registro para o backend", params);
    // const { data } = await clienteBackend.post('/auth/registrar', params);
    // return data;

    // --- Início da Simulação ---
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      usuario: { id: `usr_${new Date().getTime()}`, email: params.email },
      mensagem: "Usuário registrado com sucesso!"
    };
    // --- Fim da Simulação ---
  },

  /**
   * Envia os dados adicionais do perfil para o backend.
   * @param usuarioId O ID do usuário a ser atualizado.
   * @param dadosPerfil Os dados do perfil a serem salvos.
   */
  completarPerfil: async (usuarioId: string, dadosPerfil: IPerfilParaCompletar): Promise<any> => {
    console.log(`API: Enviando requisição para completar perfil do usuário ${usuarioId}`, dadosPerfil);
    // const { data } = await clienteBackend.put(`/usuarios/${usuarioId}/perfil`, dadosPerfil);
    // return data;
    
    // --- Início da Simulação ---
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: usuarioId,
      email: "exemplo@email.com", // Este dado viria do estado atual
      ...dadosPerfil,
    };
    // --- Fim da Simulação ---
  },

  /**
   * Valida um token de provedor social (ex: Google) com o backend e obtém um token de sessão (JWT).
   * @param params Dados do login social.
   */
  loginComProvedorSocial: async (params: { provedor: string, token: string, email: string, nome: string }): Promise<any> => {
    console.log("API: Enviando requisição de login social para o backend", params);
    // Em um cenário real, a chamada seria assim:
    // const { data } = await clienteBackend.post('/auth/social-login', params);
    // return data;

    // --- Início da Simulação ---
    // Simula que o backend validou o token do Google e retornou um usuário e um token JWT.
    // O backend pode decidir se precisa que o usuário complete o perfil.
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      token: "jwt.token.simulado.social",
      usuario: { 
        id: `usr_social_${new Date().getTime()}`, 
        email: params.email, 
        apelido: params.nome, 
        precisaCompletarPerfil: true // Força o fluxo de completar perfil para testes
      }
    };
    // --- Fim da Simulação ---
  }
};
