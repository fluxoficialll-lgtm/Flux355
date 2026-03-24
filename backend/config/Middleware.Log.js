
// backend/config/Middleware.Log.js
import * as Log from '../Logs/BK.Log.Supremo.js';

export const configurarLog = (app) => {
    // Middleware de Debug para todas as requisições
    app.use((req, res, next) => {
        // Ignora o log para o próprio endpoint de logs do frontend
        if (req.path !== '/api/log/frontend') {
            console.log(`[DEBUG] Requisição Recebida: ${req.method} ${req.path}`);
        }
        next();
    });

    // Middleware de log de requisições do sistema supremo
    app.use(Log.requestLoggerMiddleware);
};
