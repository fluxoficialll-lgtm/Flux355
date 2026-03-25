
import pool from '../../Processo.Conexao.Banco.Dados.js';

export const atualizarConfiguracoes = async (configData) => {
    const { idGrupo, nome, descricao, privacidade } = configData;
    const query = `
        UPDATE grupos_configuracoes 
        SET nome = $1, descricao = $2, privacidade = $3
        WHERE id_grupo = $4;
    `;
    const values = [nome, descricao, privacidade, idGrupo];
    const resultado = await pool.query(query, values);
    return resultado;
};

export const obterConfiguracoes = async (idGrupo) => {
    const query = `
        SELECT * FROM grupos_configuracoes WHERE id_grupo = $1;
    `;
    const { rows } = await pool.query(query, [idGrupo]);
    return rows[0];
};

export const obterDiretrizes = async (idGrupo) => {
    const query = `
        SELECT diretrizes FROM grupos_configuracoes WHERE id_grupo = $1;
    `;
    const { rows } = await pool.query(query, [idGrupo]);
    return rows[0];
};

export const atualizarDiretrizes = async (idGrupo, diretrizes) => {
    const query = `
        UPDATE grupos_configuracoes 
        SET diretrizes = $1
        WHERE id_grupo = $2;
    `;
    const values = [diretrizes, idGrupo];
    const resultado = await pool.query(query, values);
    return resultado;
};
