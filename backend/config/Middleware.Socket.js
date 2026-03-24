
// backend/config/Middleware.Socket.js

export const configurarSocket = (io) => {
    return (req, res, next) => {
        req.io = io;
        next();
    };
};
