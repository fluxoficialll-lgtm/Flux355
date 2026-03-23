import provedor from './Provedor.Log.js';

const logRequisicao = (req, res, next) => {
    provedor.info({ 
        message: 'Requisição recebida',
        http: {
            requestMethod: req.method,
            requestUrl: req.originalUrl,
            remoteIp: req.ip,
            userAgent: req.headers['user-agent'],
        }
    });
    next();
};

export default logRequisicao;
