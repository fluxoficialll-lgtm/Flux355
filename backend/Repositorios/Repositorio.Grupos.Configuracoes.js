
import {
    atualizarConfiguracoes as atualizar,
    obterConfiguracoes as obter,
    obterDiretrizes as obterDiretrizes,
    atualizarDiretrizes as atualizarDiretrizes
} from '../database/GestaoDeDados/PostgreSQL/Consultas.Grupos.Configuracoes.js';

class RepositorioGruposConfiguracoes {

    async atualizarConfiguracoes(configData) {
        try {
            return await atualizar(configData);
        } catch (error) {
            console.error('DB_UPDATE_CONFIG_ERROR', error);
            throw error;
        }
    }

    async obterConfiguracoes(idGrupo) {
        try {
            return await obter(idGrupo);
        } catch (error) {
            console.error('DB_GET_CONFIG_ERROR', error);
            throw error;
        }
    }
    
    async obterDiretrizes(idGrupo) {
        try {
            return await obterDiretrizes(idGrupo); 
        } catch (error) {
            console.error('DB_GET_GUIDELINES_ERROR', error);
            throw error;
        }
    }

    async atualizarDiretrizes(idGrupo, diretrizes) {
        try {
            return await atualizarDiretrizes(idGrupo, diretrizes);
        } catch (error) {
            console.error('DB_UPDATE_GUIDELINES_ERROR', error);
            throw error;
        }
    }
}

export default new RepositorioGruposConfiguracoes();
