import provedor from './Provedor.Log.js';

const logErro = (err, req, res, next) => {
    provedor.error({
        message: "Erro na aplicação",
        error: {
            message: err.message,
            stack: err.stack
        },
        http: {
            requestMethod: req.method,
            requestUrl: req.originalUrl
        }
    });
    // Garante que o próximo middleware de erro (se houver) seja chamado
    next(err); 
};

export default logErro;
