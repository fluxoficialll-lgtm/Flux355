
import { Server } from 'socket.io';
import createServerLogger from './Log.Servidor.js';

export function configureSocket(httpServer) {
    const logger = createServerLogger(import.meta.url);

    logger.info('Configurando o servidor Socket.IO', { componente: 'Socket.IO' });

    const io = new Server(httpServer, {
        cors: {
            origin: true,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'X-Flux-Client-ID', 'X-Flux-Trace-ID', 'X-Admin-Action', 'X-Protocol-Version'],
        }
    });

    io.on('connection', (socket) => {
        logger.info(`Novo cliente conectado: ${socket.id}`, { componente: 'Socket.IO' });

        socket.on('disconnect', () => {
            logger.info(`Cliente desconectado: ${socket.id}`, { componente: 'Socket.IO' });
        });
    });

    return io;
}
