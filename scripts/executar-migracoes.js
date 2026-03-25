import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs/promises';
import path from 'path';
import pool from '../backend/database/Processo.Conexao.Banco.Dados.js';
import { backendConfig } from '../backend/config/ambiente.js';

const { ambiente: ambienteAtual } = backendConfig;

const MIGRATIONS_DIR = path.join(process.cwd(), 'backend', 'database', 'migrations');
const MIGRATIONS_TABLE = 'schema_migrations';

const ensureMigrationsTable = async (client) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

const getAppliedMigrations = async (client) => {
    const result = await client.query(`SELECT name FROM ${MIGRATIONS_TABLE}`);
    return new Set(result.rows.map(row => row.name));
};

const applyMigration = async (client, fileName) => {
    console.log(`  -> Aplicando: ${fileName}...`);
    const filePath = path.join(MIGRATIONS_DIR, fileName);
    try {
        const sql = await fs.readFile(filePath, 'utf-8');
        await client.query(sql);
        await client.query(`INSERT INTO ${MIGRATIONS_TABLE} (name) VALUES ($1)`, [fileName]);
        console.log(`     ✔️ Sucesso.`);
    } catch (error) {
        console.error(`     ❌ Erro ao aplicar ${fileName}:`, error.message);
        throw error;
    }
};

export const run = async () => {
    console.log(`\n🚀 Iniciando a verificação e migração do banco de dados no ambiente: ${ambienteAtual.toUpperCase()}...\n`);
    
    let client;
    try {
        client = await pool.connect();
        console.log('🔌 Conexão com o banco de dados estabelecida com sucesso.');

        await client.query('BEGIN');
        
        await ensureMigrationsTable(client);

        const allFiles = await fs.readdir(MIGRATIONS_DIR);
        const migrationFiles = allFiles.filter(file => file.endsWith('.sql')).sort();
        const appliedMigrations = await getAppliedMigrations(client);

        const pendingMigrations = migrationFiles.filter(file => !appliedMigrations.has(file));

        if (pendingMigrations.length === 0) {
            console.log('✅ Banco de dados já está atualizado. Nenhuma migração necessária.');
            await client.query('COMMIT');
            return;
        }

        console.log(`🔍 Migrações pendentes encontradas. Preparando para aplicar ${pendingMigrations.length} atualizações...`);

        for (const fileName of pendingMigrations) {
            await applyMigration(client, fileName);
        }

        await client.query('COMMIT');
        console.log('🎉 SUCESSO! O banco de dados foi atualizado e todas as tabelas estão prontas.');

    } catch (error) {
        console.error('🔥 ERRO CRÍTICO! Falha ao aplicar as migrações.');
        if (client) {
            try {
                await client.query('ROLLBACK');
                console.error('⏪ Todas as alterações foram revertidas para garantir a segurança do banco.');
            } catch (rollbackError) {
                console.error('!! FALHA NO ROLLBACK. O banco de dados pode estar em estado inconsistente.', rollbackError);
            }
        }
        throw error;
    } finally {
        if (client) {
            client.release();
            console.log('🔌 Conexão com o banco de dados liberada.');
        }
    }
};

run().catch(error => {
    console.error("Falha ao executar o script de migração:", error);
    process.exit(1);
});