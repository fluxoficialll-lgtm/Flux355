
import express from 'express';
import reelsControle from '../controles/Controles.Publicacao.Reels.js';
import comentariosReelsControle from '../controles/Controles.Publicacao.Comentarios.Reels.js'; // Importando o controle de comentários

const router = express.Router();

// --- Rotas de Reels ---

// @route   POST /
// @desc    Criar um novo Reel
// @access  Private
router.post('/', reelsControle.createReel);

// @route   GET /
// @desc    Obter todos os Reels
// @access  Public
router.get('/', reelsControle.getAllReels);

// @route   GET /:reelId
// @desc    Obter um Reel específico
// @access  Public
router.get('/:reelId', reelsControle.getReelById);

// @route   PUT /:reelId
// @desc    Atualizar um Reel
// @access  Private
router.put('/:reelId', reelsControle.updateReel);

// @route   DELETE /:reelId
// @desc    Deletar um Reel
// @access  Private
router.delete('/:reelId', reelsControle.deleteReel);

// --- Rotas de Comentários Aninhados ---

// @route   POST /:reelId/comments
// @desc    Adicionar um comentário a um Reel
// @access  Private
router.post('/:reelId/comments', comentariosReelsControle.createComment);

// @route   GET /:reelId/comments
// @desc    Buscar todos os comentários de um Reel
// @access  Public
router.get('/:reelId/comments', comentariosReelsControle.getCommentsForReel);

export default router;
