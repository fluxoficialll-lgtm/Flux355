
// Arquivo: backend/config/Variaveis.Backend.js

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração de caminho robusta para encontrar o .env na raiz do projeto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');
dotenv.config({ path: path.join(projectRoot, '.env') });

/**
 * Centraliza a definição, validação e acesso às variáveis de ambiente do Backend.
 * Este módulo garante que a aplicação só inicie se todas as variáveis críticas estiverem presentes.
 */

// --- Definição das Variáveis Esperadas --

// Variáveis que são OBRIGATÓRIAS para a aplicação funcionar.
const VARIAVEIS_OBRIGATORIAS = [
    'DATABASE_URL',
    'JWT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'CORS_ORIGIN',
];

// Variáveis OPCIONAIS, que possuem um valor padrão caso não sejam definidas.
const VARIAVEIS_OPCIONAIS = {
    PORT: 3001,
    STRIPE_SECRET_KEY: ''
};

// --- Processamento e Validação ---

const VariaveisBackend = {};

// 1. Processa e valida as variáveis obrigatórias
VARIAVEIS_OBRIGATORIAS.forEach(nome => {
    const valor = process.env[nome];
    if (!valor) {
        throw new Error(`[Configuração do Backend] A variável de ambiente obrigatória "${nome}" não foi definida.`);
    }
    VariaveisBackend[nome] = valor;
});

// 2. Processa as variáveis opcionais com seus valores padrão
Object.entries(VARIAVEIS_OPCIONAIS).forEach(([nome, valorPadrao]) => {
    VariaveisBackend[nome] = process.env[nome] || valorPadrao;
});

// 3. Monta o objeto de configuração final com uma estrutura limpa e aninhada
const configFinal = {
    databaseUrl: VariaveisBackend.DATABASE_URL,
    jwtSecret: VariaveisBackend.JWT_SECRET,
    corsOrigin: VariaveisBackend.CORS_ORIGIN,
    port: VariaveisBackend.PORT,
    stripeSecretKey: VariaveisBackend.STRIPE_SECRET_KEY,
    google: {
        clientId: VariaveisBackend.GOOGLE_CLIENT_ID,
        clientSecret: VariaveisBackend.GOOGLE_CLIENT_SECRET,
    }
};

// 4. Exporte o objeto de configuração final, validado e pronto para uso.
export default configFinal;
