import { inserirGrupo } from '../database/GestaoDeDados/PostgreSQL/Consultas.Grupo.js';

class RepositorioEstruturaGrupos {
    
    /**
     * Cria um novo grupo no banco de dados.
     * @param {object} dadosDoGrupo - Objeto contendo os dados do grupo, 
     *                                geralmente vindo de `modelo.paraBancoDeDados()`.
     * @returns {Promise<object>} - O registro do grupo como foi salvo no banco.
     */
    async criar(dadosDoGrupo) { 
        try {
            return await inserirGrupo(dadosDoGrupo);
        } catch (error) {
            // O erro já foi logado na camada de consulta, então apenas o relançamos.
            throw error;
        }
    }

    // Futuramente, outros métodos como buscarPorId, atualizar, etc., podem ser adicionados.
}

export default new RepositorioEstruturaGrupos();
