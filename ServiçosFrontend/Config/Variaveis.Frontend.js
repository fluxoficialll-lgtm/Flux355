// Arquivo: ServiçosFrontend/Config/Variaveis.Frontend.js

/**
 * Centraliza a definição e o acesso às variáveis de ambiente do Frontend.
 * Este arquivo determina a URL base da API e outras configurações cruciais
 * com base no ambiente de execução (Produção vs. Desenvolvimento).
 */

// --- Processamento do Ambiente ---

const env = import.meta.env;
const isProduction = env.MODE === 'production';

// --- Definição das Configurações ---

const VariaveisFrontend = {
    // Define a URL da API para sempre usar o proxy, tanto em produção quanto em desenvolvimento.
    // Isso é crucial para evitar problemas de CORS em produção.
    apiBaseUrl: '/api',

    // Chave pública do Stripe
    stripePublicKey: env.VITE_STRIPE_PUBLIC_KEY || 'CHAVE_NAO_DEFINIDA',

    // Client ID do Google
    googleClientId: env.VITE_GOOGLE_CLIENT_ID || 'CHAVE_NAO_DEFINIDA',

    // Adiciona o modo atual para referência, se necessário
    mode: env.MODE
};

// --- Validação (Opcional, mas recomendado) ---

if (isProduction) {
    if (VariaveisFrontend.stripePublicKey === 'CHAVE_NAO_DEFINIDA') {
        console.error("[Configuração do Frontend] A variável de ambiente obrigatória 'VITE_STRIPE_PUBLIC_KEY' não foi definida para produção.");
    }
    if (VariaveisFrontend.googleClientId === 'CHAVE_NAO_DEFINIDA') {
        console.error("[Configuração do Frontend] A variável de ambiente obrigatória 'VITE_GOOGLE_CLIENT_ID' não foi definida para produção.");
    }
}

// Congela o objeto para evitar mutações acidentais em outras partes do código.
export default Object.freeze(VariaveisFrontend);
