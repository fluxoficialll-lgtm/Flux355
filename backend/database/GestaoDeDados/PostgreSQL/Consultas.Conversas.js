// backend/database/GestaoDeDados/PostgreSQL/Consultas.Conversas.js
import pool from '../../Processo.Conexao.Banco.Dados.js';

export const obterConversasPorUsuario = async (userId) => {
    const query = `
        SELECT 
            c.id, 
            c.ultimo_nome_da_conversa AS "ultimoNomeDaConversa",
            c.criado_em AS "criadoEm",
            c.atualizado_em AS "atualizadoEm",
            u.username AS "nomeDoOutroUsuario",
            u.avatar_url AS "avatarDoOutroUsuario"
        FROM conversas c
        JOIN usuarios u ON u.id = c.id_usuario_alternativo
        WHERE c.id_usuario_principal = $1
        ORDER BY c.atualizado_em DESC;
    `;

    try {
        const { rows } = await pool.query(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Erro ao buscar conversas no repositório:', error);
        throw new Error('Erro no banco de dados ao buscar conversas.');
    }
};
