import pool from '../../Processo.Conexao.Banco.Dados.js';

// Contagem de likes para um reel
export const countLikes = async (reelId) => {
    const res = await pool.query('SELECT COUNT(*) FROM reel_likes WHERE reel_id = $1', [reelId]);
    return parseInt(res.rows[0].count, 10);
};

// Contagem de visualizações para um reel
export const countViews = async (reelId) => {
    const res = await pool.query('SELECT COUNT(*) FROM reel_views WHERE reel_id = $1', [reelId]);
    return parseInt(res.rows[0].count, 10);
};

// Contagem de compartilhamentos para um reel
export const countShares = async (reelId) => {
    const res = await pool.query('SELECT COUNT(*) FROM reel_shares WHERE reel_id = $1', [reelId]);
    return parseInt(res.rows[0].count, 10);
};

// Contagem de comentários para um reel
export const countComments = async (reelId) => {
    const res = await pool.query('SELECT COUNT(*) FROM comments WHERE reel_id = $1', [reelId]);
    return parseInt(res.rows[0].count, 10);
};
