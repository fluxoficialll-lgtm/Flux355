
import pool from './Processo.Conexao.Banco.Dados.js';
import { db } from './Processo.Inicializacao.js';
import { auditorDoPostgreSQL } from './AuditoresDeBancos/AuditorDoPostgreSQL.js';
import sincronizarModelos from './Processo.Sincronizacao.js'; // Importa o novo sincronizador

const initDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('Banco de dados conectado com sucesso!');
    client.release();

    // 1. Executa a sincronização automática de modelos
    await sincronizarModelos();
    console.log('Sincronização de modelos com o banco de dados concluída com sucesso!');

    // 2. Processos de inicialização e auditoria existentes
    await db.init();
    console.log('Banco de dados inicializado com sucesso!');
    
    await auditorDoPostgreSQL.inspectDatabases();
    console.log('Auditoria do banco de dados concluída com sucesso!');
    
  } catch (error) {
    console.error('Erro fatal durante a inicialização ou sincronização do banco de dados:', error);
    process.exit(1);
  }
};

export default initDatabase;
