
// backend/database/schemas/Squema.Estrutura.Sessao.js

export const SessaoModel = {
    table: 'sessions',
    columns: {
        id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        user_id: 'UUID NOT NULL', // Foreign key to users table
        token: 'TEXT NOT NULL',
        expires_at: 'TIMESTAMPTZ NOT NULL',
        user_agent: 'TEXT',
        ip_address: 'TEXT',
        created_at: 'TIMESTAMPTZ NOT NULL DEFAULT NOW()'
    }
};
