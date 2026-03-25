import pool from './Processo.Conexao.Banco.Dados.js';
import * as schemas from './schemas/000.index.js';

async function getExistingColumns(tableName) {
    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = $1;
        `, [tableName]);
        return res.rows.map(row => row.column_name);
    } finally {
        client.release();
    }
}

async function tableExists(tableName) {
    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT to_regclass($1);
        `, [`public.${tableName}`]);
        return res.rows[0].to_regclass !== null;
    } finally {
        client.release();
    }
}

async function createTable(client, schema) {
    const columns = Object.entries(schema.columns)
        .map(([name, type]) => `"${name}" ${type}`)
        .join(',\n');
    const createTableQuery = `CREATE TABLE "${schema.table}" (\n${columns}\n);`;
    
    console.log(`[Sincronizador] Tabela "${schema.table}" não encontrada. Criando...`);
    await client.query(createTableQuery);
    console.log(`[Sincronizador] Tabela "${schema.table}" criada com sucesso.`);
}

async function addMissingColumns(client, schema, existingColumns) {
    for (const [columnName, columnType] of Object.entries(schema.columns)) {
        if (!existingColumns.includes(columnName)) {
            console.log(`[Sincronizador] Coluna "${columnName}" não encontrada na tabela "${schema.table}". Adicionando...`);
            const addColumnQuery = `ALTER TABLE "${schema.table}" ADD COLUMN "${columnName}" ${columnType}`;
            await client.query(addColumnQuery);
            console.log(`[Sincronizador] Coluna "${columnName}" adicionada com sucesso.`);
        }
    }
}

async function sincronizarModelos() {
    console.log('[Sincronizador] Iniciando a sincronização de modelos com o banco de dados...');
    const client = await pool.connect();
    
    try {
        for (const schemaName in schemas) {
            const schema = schemas[schemaName];

            if (!schema || !schema.table || !schema.columns) {
                console.warn(`[Sincronizador] Esquema inválido, pulando: ${schemaName}`);
                continue;
            }
            
            const exists = await tableExists(schema.table);

            if (!exists) {
                await createTable(client, schema);
            } else {
                const existingColumns = await getExistingColumns(schema.table);
                await addMissingColumns(client, schema, existingColumns);
            }
        }
        console.log('[Sincronizador] Sincronização concluída com sucesso.');
    } catch (error) {
        console.error('[Sincronizador] Erro durante a sincronização:', error);
        // Propaga o erro para impedir a inicialização do servidor
        throw error;
    } finally {
        client.release();
    }
}

export default sincronizarModelos;
