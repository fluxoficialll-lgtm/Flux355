
// backend/database/schemas/Squema.Estrutura.Usuario.js

export const UsuarioModel = {
    table: 'users',
    columns: {
        id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        name: 'TEXT NOT NULL',
        email: 'TEXT NOT NULL UNIQUE',
        nickname: 'TEXT UNIQUE',
        password_hash: 'TEXT',
        google_id: 'TEXT UNIQUE',
        bio: 'TEXT',
        website: 'TEXT',
        photo_url: 'TEXT',
        is_private: 'BOOLEAN DEFAULT FALSE',
        profile_completed: 'BOOLEAN DEFAULT FALSE',
        created_at: 'TIMESTAMPTZ NOT NULL DEFAULT NOW()',
        updated_at: 'TIMESTAMPTZ NOT NULL DEFAULT NOW()'
    }
};
