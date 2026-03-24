
// backend/config/Sistema.Middleware.js

import { configurarSeguranca } from './Middleware.Seguranca.js';
import { configurarOtimizacao } from './Middleware.Otimizacao.js';
import { configurarLog } from './Middleware.Log.js';
import { configurarSocket } from './Middleware.Socket.js';

export const setupMiddlewares = (app, io) => {
    // Aplica as configurações de segurança
    configurarSeguranca(app);

    // Aplica as configurações de otimização e parsing
    configurarOtimizacao(app);

    // Configura o sistema de logging
    configurarLog(app);

    // Anexa o 'io' do Socket.IO a cada requisição
    app.use(configurarSocket(io));
};
