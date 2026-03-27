
import { UsuarioAutenticado } from '../../Contratos/Contrato.Autenticacao';

// Esta é a estrutura de dados simulada para um usuário.
const usuarioSimulado: UsuarioAutenticado = {
    id: 'user-simulado-123',
    nome: 'Usuário Simulado',
    email: 'simulado@example.com',
    apelido: 'Simulado',
    bio: 'Este é um perfil de usuário simulado para testes de frontend.',
    site: 'https://example-frontend.com',
    urlFoto: 'https://i.pravatar.cc/150?u=frontend',
    privado: false,
    // CORREÇÃO: Propriedade renomeada para corresponder ao que a `pages/Login.tsx` espera.
    profile_completed: true, 
    termosAceitos: true,
    contagemSeguidores: 150,
    contagemSeguindo: 75,
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString(),
};

// Mock para o serviço de perfil de usuário.
export const mockServicoPerfilUsuario = {
  async getOwnProfile(): Promise<UsuarioAutenticado> {
    console.log("SIMULAÇÃO: Obtendo perfil próprio simulado.");
    return Promise.resolve(usuarioSimulado);
  },

  async getPublicProfileByUsername(username: string): Promise<UsuarioAutenticado> {
    console.log(`SIMULAÇÃO: Obtendo perfil público simulado para ${username}.`);
    return Promise.resolve({
        ...usuarioSimulado,
        id: `user-simulado-${username}`,
        nome: username,
        email: `${username}@example.com`,
        apelido: username,
    });
  },

  async updateProfile(userId: string, profileData: Partial<UsuarioAutenticado>): Promise<UsuarioAutenticado> {
    console.log(`SIMULAÇÃO: Atualizando perfil simulado para ${userId}.`);
    const perfilAtualizado = { ...usuarioSimulado, ...profileData };
    return Promise.resolve(perfilAtualizado);
  },
};
