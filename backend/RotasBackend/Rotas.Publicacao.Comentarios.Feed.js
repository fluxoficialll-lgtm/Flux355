
import express from 'express';
import comentariosController from '../controles/Controles.Publicacao.Comentarios.Feed.js';

const router = express.Router();

// @route   PUT /:commentId
// @desc    Atualizar um comentário específico do feed
// @access  Private
router.put('/:commentId', comentariosController.atualizarComentario);

// @route   DELETE /:commentId
// @desc    Deletar um comentário específico do feed
// @access  Private
router.delete('/:commentId', comentariosController.deletarComentario);

export default router;
