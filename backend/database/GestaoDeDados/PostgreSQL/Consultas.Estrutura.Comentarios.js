
import pool from '../../Processo.Conexao.Banco.Dados.js';

// IMPORTANTE: Os parâmetros tableName e parentIdColumn não são parametrizados nas queries
// e são injetados diretamente na string SQL. Isso geralmente é inseguro e pode levar
// a injeção de SQL se esses valores vierem da entrada do usuário. Nesta aplicação, esses valores
// são codificados na camada de serviço, tornando-a segura. Não exponha esses parâmetros
// à entrada controlada pelo usuário.

const criar = async (tableName, parentIdColumn, commentData) => {
    const { user_id, content } = commentData;
    const parentId = commentData[parentIdColumn];
    const query = `
        INSERT INTO ${tableName} (${parentIdColumn}, user_id, content, created_at, updated_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [parentId, user_id, content]);
    return rows[0];
};

const buscarPorParentId = async (tableName, parentIdColumn, parentId, { limit = 10, offset = 0 }) => {
    const query = `
        SELECT c.*, u.username, u.avatar_url
        FROM ${tableName} c
        JOIN users u ON c.user_id = u.id
        WHERE c.${parentIdColumn} = $1
        ORDER BY c.created_at DESC
        LIMIT $2 OFFSET $3;
    `;
    const { rows } = await pool.query(query, [parentId, limit, offset]);
    return rows;
};

const buscarPorId = async (tableName, commentId) => {
    const query = `
        SELECT * FROM ${tableName} WHERE id = $1;
    `;
    const { rows } = await pool.query(query, [commentId]);
    return rows[0];
};

const atualizar = async (tableName, commentId, updates) => {
    const { content } = updates;
    const query = `
        UPDATE ${tableName}
        SET content = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [content, commentId]);
    return rows[0];
};

const remover = async (tableName, commentId) => {
    const query = `DELETE FROM ${tableName} WHERE id = $1`;
    const { rowCount } = await pool.query(query, [commentId]);
    return rowCount > 0;
};

export default {
    criar,
    buscarPorParentId,
    buscarPorId,
    atualizar,
    remover
};
