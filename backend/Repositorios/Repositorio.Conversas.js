
import {
    obterConversasPorUsuario as obterConversasPorUsuarioQuery
} from '../database/GestaoDeDados/PostgreSQL/Consultas.Conversas.js';

const obterConversasPorUsuario = async (userId) => {
    return await obterConversasPorUsuarioQuery(userId);
};

export default {
    obterConversasPorUsuario,
};
