import pool from '../../Processo.Conexao.Banco.Dados.js';

const inserirGrupoQuery = `
    INSERT INTO groups (
        id, 
        name, 
        description, 
        group_type, 
        price, 
        currency, 
        creator_id, 
        created_at, 
        member_limit, 
        cover_image, 
        access_type, 
        selected_provider_id, 
        expiration_date, 
        vip_door, 
        pixel_id, 
        pixel_token,
        is_vip,
        status
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    RETURNING 
        id,
        name,
        description,
        group_type,
        price,
        currency,
        creator_id AS donoId, -- Alias para corresponder ao modelo
        created_at AS dataCriacao, -- Alias
        member_limit AS limiteMembros, -- Alias
        cover_image AS imagemCapa, -- Alias
        access_type AS tipoAcesso, -- Alias
        selected_provider_id AS provedorPagamentoId, -- Alias
        expiration_date AS dataExpiracao, -- Alias
        vip_door AS vipDoor, -- Alias
        pixel_id, -- Manter separado para o objeto pixel
        pixel_token; -- Manter separado para o objeto pixel
`;

export const inserirGrupo = async (dadosDoGrupo) => {
    const values = [
        dadosDoGrupo.id,
        dadosDoGrupo.name,
        dadosDoGrupo.description,
        dadosDoGrupo.group_type,
        dadosDoGrupo.price,
        dadosDoGrupo.currency,
        dadosDoGrupo.creator_id,
        dadosDoGrupo.created_at,
        dadosDoGrupo.member_limit,
        dadosDoGrupo.cover_image,
        dadosDoGrupo.access_type,
        dadosDoGrupo.selected_provider_id,
        dadosDoGrupo.expiration_date,
        dadosDoGrupo.vip_door,
        dadosDoGrupo.pixel_id,
        dadosDoGrupo.pixel_token,
        dadosDoGrupo.is_vip,
        dadosDoGrupo.status
    ];

    try {
        const { rows } = await pool.query(inserirGrupoQuery, values);
        return rows[0];
    } catch (error) {
        console.error("Erro em Consultas.Grupo.js ao inserir grupo:", error);
        throw new Error("Falha ao salvar o grupo no banco de dados.");
    }
};
