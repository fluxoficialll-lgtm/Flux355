
import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';
import authApi from '../APIs/API.Sistema.Autenticacao.Supremo';
import { config } from '../ValidaçãoDeAmbiente/config';
import { servicoGestaoSessao } from './Servico.Gestao.Sessao';
import { LogSupremo } from '../SistemaObservabilidade/Log.Supremo1'; // Caminho do log corrigido

interface User extends Usuario {}

/**
 * @function sincronizarDadosUsuario
 * @description Busca os dados mais recentes do usuário no backend e atualiza o estado local.
 * @returns {Promise<User>} Os dados do usuário atualizados.
 */
const sincronizarDadosUsuario = async (): Promise<User> => {
    try {
        // Presume-se que a API de autenticação tenha um endpoint para obter dados do usuário logado.
        const { data } = await authApi.syncUserData(); // Assumindo que essa chamada exista em authApi

        if (data && data.user) {
            // Atualiza o usuário no localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            LogSupremo.Log.info('[SyncService] Dados do usuário sincronizados com sucesso.', data.user);
            return data.user;
        }
        
        throw new Error('Resposta da sincronização de perfil inválida.');

    } catch (error) {
        LogSupremo.Log.error('[SyncService] Falha ao sincronizar dados do usuário:', error);
        // Em caso de falha, poderia decidir se deve limpar a sessão ou não.
        // Por enquanto, apenas propaga o erro.
        throw error;
    }
};

/**
 * @function simulatedSincronizarDadosUsuario
 * @description Simula a busca de dados do usuário.
 * @returns {Promise<User>} Os dados do usuário simulados.
 */
const simulatedSincronizarDadosUsuario = async (): Promise<User> => {
    LogSupremo.Log.info('[SyncService] Iniciando sincronização simulada...');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula latência de rede
    
    const currentUser = servicoGestaoSessao.getCurrentUser();
    
    if (!currentUser) {
        throw new Error("Simulação: Usuário não encontrado para sincronização.");
    }
    
    // Na simulação, podemos apenas retornar o usuário atual
    // ou talvez adicionar um campo para mostrar que foi "sincronizado"
    const syncedUser = { ...currentUser, lastSynced: new Date().toISOString() };
    LogSupremo.Log.info('[SyncService] Sincronização simulada concluída.', syncedUser);

    return syncedUser as User;
};


// --- Exportação do Serviço ---

const servicoSincronizacaoReal = {
    sincronizarDadosUsuario,
};

const servicoSincronizacaoSimulado = {
    sincronizarDadosUsuario: simulatedSincronizarDadosUsuario,
};

export const servicoSincronizacao = config.VITE_APP_ENV === 'simulation'
    ? servicoSincronizacaoSimulado
    : servicoSincronizacaoReal;
