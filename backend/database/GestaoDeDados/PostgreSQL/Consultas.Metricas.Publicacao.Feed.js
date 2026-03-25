import pool from '../../Processo.Conexao.Banco.Dados.js';

// Contagem de likes para uma publicação
export const countLikes = async (postId) => {
    const res = await pool.query('SELECT COUNT(*) FROM post_likes WHERE post_id = $1', [postId]);
    return parseInt(res.rows[0].count, 10);
};

// Contagem de visualizações para uma publicação
export const countViews = async (postId) => {
    const res = await pool.query('SELECT COUNT(*) FROM post_views WHERE post_id = $1', [postId]);
    return parseInt(res.rows[0].count, 10);
};

// Contagem de compartilhamentos para uma publicação
export const countShares = async (postId) => {
    const res = await pool.query('SELECT COUNT(*) FROM post_shares WHERE post_id = $1', [postId]);
    return parseInt(res.rows[0].count, 10);
};

// Contagem de comentários para uma publicação
export const countComments = async (postId) => {
    const res = await pool.query('SELECT COUNT(*) FROM comments WHERE post_id = $1', [postId]);
    return parseInt(res.rows[0].count, 10);
};
