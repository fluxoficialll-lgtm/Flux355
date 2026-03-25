
// backend/Repositorios/Repositorio.Publicacao.Feed.js
import {
    criar as criarPublicacao,
    obterTodos as obterTodasPublicacoes,
    obterPorId as obterPublicacaoPorId,
    atualizar as atualizarPublicacao,
    remover as removerPublicacao
} from '../database/GestaoDeDados/PostgreSQL/Consultas.Publicacao.Feed.js';

const criar = async (postData) => {
    return await criarPublicacao(postData);
};

const obterTodos = async (options) => {
    return await obterTodasPublicacoes(options);
};

const obterPorId = async (postId) => {
    return await obterPublicacaoPorId(postId);
};

const atualizar = async (postId, postData) => {
    return await atualizarPublicacao(postId, postData);
};

const remover = async (postId) => {
    return await removerPublicacao(postId);
};

export default {
    criar,
    obterTodos,
    obterPorId,
    atualizar,
    remover,
};
