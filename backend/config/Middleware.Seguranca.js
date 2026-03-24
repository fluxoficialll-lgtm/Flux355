
// backend/config/Middleware.Seguranca.js
import cors from 'cors';
import helmet from 'helmet';

export const configurarSeguranca = (app) => {
    // Configurações de segurança
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
        referrerPolicy: { policy: "no-referrer-when-downgrade" }
    }));

    app.use(cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'X-Flux-Client-ID', 'X-Flux-Trace-ID', 'X-Admin-Action', 'X-Protocol-Version'],
        exposedHeaders: ['X-Flux-Trace-ID']
    }));

    // Confia no primeiro proxy (necessário para ambientes como Heroku, Render, etc.)
    app.set('trust proxy', 1);
};
