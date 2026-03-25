// backend/database/GestaoDeDados/PostgreSQL/Consultas.Metricas.Comentario.Feed.js
import pool from '../../Processo.Conexao.Banco.Dados.js';

export const trackComment = async (commentData) => {
    const { userId, postId, content } = commentData;
    const query = 'INSERT INTO feed_comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *';
    const values = [userId, postId, content];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const trackCommentLike = async (commentId) => {
    const query = 'UPDATE feed_comments SET likes = likes + 1 WHERE id = $1 RETURNING *';
    const values = [commentId];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const trackCommentReply = async (commentId, replyData) => {
    const { userId, content } = replyData;
    const query = 'INSERT INTO feed_comment_replies (comment_id, user_id, content) VALUES ($1, $2, $3) RETURNING *';
    const values = [commentId, userId, content];
    const result = await pool.query(query, values);
    return result.rows[0];
}
