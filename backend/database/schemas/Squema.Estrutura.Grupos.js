
// backend/database/schemas/Squema.Estrutura.Grupos.js

export const GruposModel = {
    table: 'groups',
    columns: {
        id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        name: 'TEXT NOT NULL',
        description: 'TEXT',
        group_type: 'TEXT NOT NULL', // 'publico', 'privado', 'pago'
        price: 'DECIMAL(10, 2) DEFAULT 0',
        currency: 'TEXT',
        creator_id: 'UUID NOT NULL', // Foreign key to users table
        created_at: 'TIMESTAMPTZ NOT NULL DEFAULT NOW()',
        member_limit: 'INTEGER DEFAULT 0',
        cover_image: 'TEXT',
        access_type: 'TEXT',
        access_config: 'JSONB',
        selected_provider_id: 'TEXT',
        expiration_date: 'TIMESTAMPTZ',
        vip_door: 'JSONB',
        pixel_id: 'TEXT',
        pixel_token: 'TEXT',
        is_vip: 'BOOLEAN DEFAULT FALSE',
        status: 'TEXT DEFAULT \'active\''
    }
};
