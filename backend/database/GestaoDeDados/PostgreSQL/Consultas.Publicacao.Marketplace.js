
// backend/database/GestãoDeDados/PostgreSQL/Consultas.Publicacao.Marketplace.js
import pool from '../../Processo.Conexao.Banco.Dados.js';

const create = async (itemData) => {
    const {
        user_id, title, description, price, category, location, image_urls
    } = itemData;
    
    const query = `
        INSERT INTO marketplace_items (user_id, title, description, price, category, location, image_urls, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *;
    `;
    
    const values = [user_id, title, description, price, category, location, JSON.stringify(image_urls || [])];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const findAll = async ({ limit = 20, offset = 0, category, min_price, max_price, location }) => {
    let query = `
        SELECT m.*, u.username, u.avatar_url
        FROM marketplace_items m
        JOIN users u ON m.user_id = u.id
        WHERE 1=1
    `;
    const values = [];
    
    if (category) {
        values.push(category);
        query += ` AND m.category ILIKE $${values.length}`;
    }
    if (min_price) {
        values.push(min_price);
        query += ` AND m.price >= $${values.length}`;
    }
    if (max_price) {
        values.push(max_price);
        query += ` AND m.price <= $${values.length}`;
    }
    if (location) {
        values.push(`%${location}%`);
        query += ` AND m.location ILIKE $${values.length}`;
    }
    
    values.push(limit, offset);
    query += ` ORDER BY m.created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;
    
    const { rows } = await pool.query(query, values);
    return rows;
};

const findById = async (itemId) => {
    const query = `
        SELECT m.*, u.username, u.avatar_url, u.contact_info
        FROM marketplace_items m
        JOIN users u ON m.user_id = u.id
        WHERE m.id = $1;
    `;
    const { rows } = await pool.query(query, [itemId]);
    return rows[0];
};

const update = async (itemId, updates) => {
    const {
        title, description, price, category, location, image_urls
    } = updates;
    
    const query = `
        UPDATE marketplace_items
        SET 
            title = COALESCE($1, title),
            description = COALESCE($2, description),
            price = COALESCE($3, price),
            category = COALESCE($4, category),
            location = COALESCE($5, location),
            image_urls = COALESCE($6, image_urls),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *;
    `;
    
    const values = [title, description, price, category, location, image_urls ? JSON.stringify(image_urls) : null, itemId];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const remove = async (itemId) => {
    const { rowCount } = await pool.query('DELETE FROM marketplace_items WHERE id = $1', [itemId]);
    return rowCount > 0;
};

export default {
    create,
    findAll,
    findById,
    update,
    remove
};
