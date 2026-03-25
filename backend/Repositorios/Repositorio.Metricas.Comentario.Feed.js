// backend/Repositorios/Repositorio.Metricas.Comentario.Feed.js
import {
    trackComment as trackCommentQuery,
    trackCommentLike as trackCommentLikeQuery,
    trackCommentReply as trackCommentReplyQuery
} from '../database/GestaoDeDados/PostgreSQL/Consultas.Metricas.Comentario.Feed.js';

export async function trackComment(commentData) {
    return await trackCommentQuery(commentData);
}

export async function trackCommentLike(commentId) {
    return await trackCommentLikeQuery(commentId);
}

export async function trackCommentReply(commentId, replyData) {
    return await trackCommentReplyQuery(commentId, replyData);
}
