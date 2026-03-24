
import express from 'express';
// CORREÇÃO: Os nomes das funções no controlador de feed foram atualizados
import feedControle from '../controles/Controles.Publicacao.Feed.js';
import comentariosFeedControle from '../controles/Controles.Publicacao.Comentarios.Feed.js';

const router = express.Router();

// --- Rotas de Posts ---

// @route   POST /
// @desc    Criar um novo post no feed
// @access  Private
router.post('/', feedControle.criarPost);

// @route   GET /
// @desc    Obter todos os posts do feed
// @access  Public
router.get('/', feedControle.obterTodosOsPosts);

// @route   GET /:postId
// @desc    Obter um post específico do feed
// @access  Public
router.get('/:postId', feedControle.obterPostPorId);

// @route   PUT /:postId
// @desc    Atualizar um post do feed
// @access  Private
router.put('/:postId', feedControle.atualizarPost);

// @route   DELETE /:postId
// @desc    Deletar um post do feed
// @access  Private
router.delete('/:postId', feedControle.deletarPost);

// --- Rotas de Comentários Aninhados ---

// @route   POST /:postId/comments
// @desc    Adicionar um comentário a um post
// @access  Private
router.post('/:postId/comments', comentariosFeedControle.criarComentario);

// @route   GET /:postId/comments
// @desc    Buscar todos os comentários de um post
// @access  Public
router.get('/:postId/comments', comentariosFeedControle.obterComentariosPorPostId);

export default router;
