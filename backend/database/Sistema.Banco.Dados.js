// backend/database/Sistema.Banco.Dados.js
import { db } from './InicializacaoDoPostgreSQL.js';
import { auditorDoPostgreSQL } from './AuditoresDeBancos/AuditorDoPostgreSQL.js';

export { db, auditorDoPostgreSQL };
