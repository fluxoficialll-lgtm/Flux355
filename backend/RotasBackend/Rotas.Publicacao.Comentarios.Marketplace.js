
import express from 'express';
import comentariosMarketplaceControle from '../controles/Controles.Publicacao.Comentarios.Marketplace.js';

const router = express.Router();

// @route   PUT /:commentId
// @desc    Atualizar um comentário no marketplace
// @access  Private
router.put('/:commentId', comentariosMarketplaceControle.atualizarComentario);

// @route   DELETE /:commentId
// @desc    Deletar um comentário no marketplace
// @access  Private
router.delete('/:commentId', comentariosMarketplaceControle.deletarComentario);

export default router;
