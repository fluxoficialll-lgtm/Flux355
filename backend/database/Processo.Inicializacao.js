import pool from './Processo.Conexao.Banco.Dados.js';

const db = {
    /**
     * Inicializa o pool de conexões com o banco de dados.
     * Tenta conectar e, em caso de falha, encerra a aplicação.
     */
    init: async () => {
        try {
            await pool.query('SELECT NOW()'); // Testa a conexão
            console.log('Conexão com o banco de dados estabelecida com sucesso.');
        } catch (err) {
            console.error('Não foi possível conectar ao banco de dados na inicialização.', err);
            process.exit(1); // Encerra a aplicação em caso de falha na conexão
        }
    },
};

export { db };
