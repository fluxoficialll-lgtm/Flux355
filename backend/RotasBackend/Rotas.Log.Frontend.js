
import express from 'express';
import { frontendLogger } from '../config/Sistema.Escritor.Logs.js';

const router = express.Router();

// Rota para receber logs do frontend
router.post('/', (req, res) => {
  const logEntry = req.body;

  // Determina o nível do log ou usa 'info' como padrão
  const level = logEntry.level ? logEntry.level.toLowerCase() : 'info';

  // Monta a mensagem de log final
  const message = `[Frontend] ${logEntry.message}`;

  // Cria um objeto de log estruturado para manter a consistência
  const structuredLog = {
      camada: "FRONTEND",
      event: "LOG",
      http: {
          traceId: logEntry.traceId,
      },
      ...logEntry,
  };

  // Verifica se o método de log existe no logger antes de chamar
  if (typeof frontendLogger[level] === 'function') {
      frontendLogger[level](message, structuredLog);
  } else {
      frontendLogger.info(message, structuredLog); // Fallback para .info
  }

  res.status(200).send('Log received');
});

export default router;
