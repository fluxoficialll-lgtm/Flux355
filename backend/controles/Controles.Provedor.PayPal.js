
import Log from '../Logs/BK.Log.Supremo.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';

const logger = Log.createLogger('PayPalProvider');

// Funções de controle para o provedor PayPal

const createAccountLink = (req, res) => {
    logger.info('PAYPAL_CREATE_ACCOUNT_LINK_REQUESTED');
    const data = { url: "https://www.paypal.com/br/home" };
    ServicoHTTPResposta.sucesso(res, data, "Rota para criar link de conta PayPal funcionando!");
};

const getAccountDetails = (req, res) => {
    logger.info('PAYPAL_GET_ACCOUNT_DETAILS_REQUESTED');
    ServicoHTTPResposta.sucesso(res, null, "Rota para buscar detalhes de conta PayPal funcionando!");
};

const disconnectAccount = (req, res) => {
    logger.info('PAYPAL_DISCONNECT_ACCOUNT_REQUESTED');
    ServicoHTTPResposta.sucesso(res, null, "Rota para desconectar conta PayPal funcionando!");
};

const createOrder = (req, res) => {
    logger.info('PAYPAL_CREATE_ORDER_REQUESTED');
    ServicoHTTPResposta.criado(res, null, "Rota para criar ordem de pagamento PayPal funcionando!");
};

const checkOrderStatus = (req, res) => {
    logger.info('PAYPAL_CHECK_ORDER_STATUS_REQUESTED', { orderId: req.params.orderId });
    ServicoHTTPResposta.sucesso(res, null, `Rota para verificar status da ordem ${req.params.orderId} do PayPal funcionando!`);
};

export default {
    createAccountLink,
    getAccountDetails,
    disconnectAccount,
    createOrder,
    checkOrderStatus
};
