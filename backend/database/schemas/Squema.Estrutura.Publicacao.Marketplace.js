
// backend/database/schemas/Squema.Estrutura.Publicacao.Marketplace.js

export const PublicacaoMarketplaceModel = {
    table: 'marketplace_listings',
    columns: {
        id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        user_id: 'UUID NOT NULL', // Foreign key to users table
        title: 'TEXT NOT NULL',
        description: 'TEXT',
        price: 'DECIMAL(10, 2) NOT NULL',
        category: 'TEXT',
        location: 'TEXT',
        image_urls: 'JSONB', // Storing an array of image URLs
        created_at: 'TIMESTAMPTZ NOT NULL DEFAULT NOW()',
        updated_at: 'TIMESTAMPTZ NOT NULL DEFAULT NOW()'
    }
};
