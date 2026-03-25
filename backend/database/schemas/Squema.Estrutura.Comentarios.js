
// backend/database/schemas/Squema.Estrutura.Comentarios.js

export const ComentariosModel = {
    table: 'comments',
    columns: {
        id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        post_id: 'UUID NOT NULL', // Foreign key to posts table
        user_id: 'UUID NOT NULL', // Foreign key to users table
        content: 'TEXT NOT NULL',
        created_at: 'TIMESTAMPTZ NOT NULL DEFAULT NOW()',
        updated_at: 'TIMESTAMPTZ NOT NULL DEFAULT NOW()'
    }
};
