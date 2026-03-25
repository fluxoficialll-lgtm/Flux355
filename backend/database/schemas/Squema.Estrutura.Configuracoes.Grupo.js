
// backend/database/schemas/Squema.Estrutura.Configuracoes.Grupo.js

export const ConfiguracoesGrupoModel = {
    table: 'group_settings',
    columns: {
        group_id: 'UUID PRIMARY KEY', // Foreign key to groups table
        name: 'TEXT',
        description: 'TEXT',
        privacy: 'TEXT', // e.g., 'public', 'private'
        guidelines: 'TEXT',
        notifications: 'JSONB' // Storing notification preferences as a JSON object
    }
};
