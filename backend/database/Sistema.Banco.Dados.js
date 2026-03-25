// backend/database/Sistema.Banco.Dados.js
import { db } from './Processo.Inicializacao.js';
import { auditorDoPostgreSQL } from './AuditoresDeBancos/AuditorDoPostgreSQL.js';

export { db, auditorDoPostgreSQL };
