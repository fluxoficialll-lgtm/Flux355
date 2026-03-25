
// backend/database/schemas/Squema.Estrutura.Publicacao.Feed.js

export const PublicacaoFeedModel = {
    table: 'posts',
    columns: {
        id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        author_id: 'UUID NOT NULL', // Foreign key to users table
        content: 'TEXT',
        media_url: 'TEXT',
        parent_post_id: 'UUID', // Foreign key to another post (for replies)
        type: 'TEXT DEFAULT \'text\'', // e.g., text, poll, media
        poll_options: 'JSONB', // To store poll options as an array of objects
        cta_link: 'TEXT',
        cta_text: 'TEXT',
        is_adult_content: 'BOOLEAN DEFAULT FALSE',
        created_at: 'TIMESTAMPTZ NOT NULL DEFAULT NOW()',
        updated_at: 'TIMESTAMPTZ NOT NULL DEFAULT NOW()'
    }
};
