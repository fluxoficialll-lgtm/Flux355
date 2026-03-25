
// backend/database/schemas/Squema.Estrutura.Publicacao.Reels.js

export const PublicacaoReelsModel = {
    table: 'reels',
    columns: {
        id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        user_id: 'UUID NOT NULL', // Foreign key to users table
        video_url: 'TEXT NOT NULL',
        description: 'TEXT',
        music_id: 'TEXT',
        hashtags: 'JSONB', // Storing an array of hashtags
        location: 'TEXT',
        likes_count: 'INTEGER DEFAULT 0',
        comments_count: 'INTEGER DEFAULT 0',
        created_at: 'TIMESTAMPTZ NOT NULL DEFAULT NOW()',
        updated_at: 'TIMESTAMPTZ NOT NULL DEFAULT NOW()'
    }
};
