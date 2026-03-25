
// backend/database/GestaoDeDados/PostgreSQL/Consultas.Publicacao.Feed.js
import pool from '../../Processo.Conexao.Banco.Dados.js';

export const criar = async (postData) => {
    const { content, author_id, mediaUrl, parentPostId, type, pollOptions, ctaLink, ctaText } = postData;
    const query = `
        INSERT INTO posts (author_id, content, media_url, parent_post_id, type, poll_options, cta_link, cta_text)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;
    const values = [author_id, content, mediaUrl, parentPostId, type || 'text', JSON.stringify(pollOptions || null), ctaLink, ctaText];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const obterTodos = async ({ limit = 10, cursor, locationFilter, allowAdultContent = 'false' }) => {
    let params = [];
    let whereClauses = ['p.parent_post_id IS NULL'];

    if (cursor) {
        const numericCursor = parseInt(cursor, 10);
        if (isNaN(numericCursor)) {
            throw new Error('Cursor inválido.');
        }
        params.push(numericCursor);
        whereClauses.push(`p.id < $${params.length}`);
    }

    if (locationFilter && locationFilter !== 'Global') {
        params.push(locationFilter);
        whereClauses.push(`up.country = $${params.length}`);
    }
    
    if (allowAdultContent === 'false') {
        whereClauses.push('p.is_adult_content = false');
    }

    params.push(parseInt(limit, 10) || 10);
    const limitParamIndex = params.length;

    const query = `
        SELECT 
            p.*, 
            u.username, 
            u.avatar_url, 
            up.name, 
            up.nickname, 
            up.country
        FROM posts p
        JOIN users u ON p.author_id = u.id
        LEFT JOIN user_profiles up ON p.author_id = up.user_id
        WHERE ${whereClauses.join(' AND ')}
        ORDER BY p.id DESC
        LIMIT $${limitParamIndex};
    `;
    
    const { rows } = await pool.query(query, params);

    let nextCursor = null;
    if (rows.length === (parseInt(limit, 10) || 10)) {
        nextCursor = rows[rows.length - 1].id;
    }

    return { data: rows, nextCursor };
};

export const obterPorId = async (postId) => {
    const query = `
        SELECT p.*, u.username, u.avatar_url, up.name, up.nickname
        FROM posts p
        JOIN users u ON p.author_id = u.id
        LEFT JOIN user_profiles up ON p.author_id = up.user_id
        WHERE p.id = $1;
    `;
    const { rows } = await pool.query(query, [postId]);
    return rows[0];
};

export const atualizar = async (postId, postData) => {
    const { content } = postData;
    const query = `
        UPDATE posts
        SET content = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [content, postId]);
    return rows[0];
};

export const remover = async (postId) => {
    const { rowCount } = await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    return rowCount > 0;
};
