
// backend/config/Middleware.Otimizacao.js
import express from 'express';
import compression from 'compression';

export const configurarOtimizacao = (app) => {
    // Otimização e parsing
    app.use(compression());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
};
