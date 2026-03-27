
import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';
import ClienteBackend from '../Cliente.Backend';

// --- Funções de Gestão de Sessão ---

const iniciarSessao = (token: string, usuario: Usuario) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(usuario));
    ClienteBackend.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const atualizarUsuarioSessao = (usuario: Usuario) => {
    localStorage.setItem('user', JSON.stringify(usuario));
};

const encerrarSessao = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete ClienteBackend.defaults.headers.common['Authorization'];
};

const getToken = (): string | null => {
    return localStorage.getItem('token');
};

const getCurrentUser = (): Usuario | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// --- Exportação do Processo ---

export const processoGestaoSessao = {
    iniciarSessao,
    atualizarUsuarioSessao,
    encerrarSessao,
    getToken,
    getCurrentUser,
};
