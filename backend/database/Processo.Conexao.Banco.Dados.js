
import pg from 'pg';
import dotenv from 'dotenv';
import { backendConfig } from '../config/ambiente.js';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
    console.error("❌ ERRO CRÍTICO: DATABASE_URL não definida no ambiente.");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    max: 25
});

export default pool;
