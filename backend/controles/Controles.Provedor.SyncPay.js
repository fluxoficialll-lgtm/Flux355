
import Log from '../Logs/BK.Log.Supremo.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';

const logger = Log.createLogger('SyncPayProvider');

// Funções de controle para o provedor SyncPay

const saveCredentials = (req, res) => {
    logger.info('SYNCPAY_SAVE_CREDENTIALS_REQUESTED');
    ServicoHTTPResposta.criado(res, null, "Rota para salvar credenciais do SyncPay funcionando!");
};

const disconnectAccount = (req, res) => {
    logger.info('SYNCPAY_DISCONNECT_ACCOUNT_REQUESTED');
    ServicoHTTPResposta.sucesso(res, null, "Rota para desconectar conta do SyncPay funcionando!");
};

const createPayment = (req, res) => {
    logger.info('SYNCPAY_CREATE_PAYMENT_REQUESTED');
    ServicoHTTPResposta.criado(res, null, "Rota para criar pagamento com SyncPay funcionando!");
};

const checkTransactionStatus = (req, res) => {
    logger.info('SYNCPAY_CHECK_TRANSACTION_STATUS_REQUESTED');
    ServicoHTTPResposta.sucesso(res, null, "Rota para verificar status de transação do SyncPay funcionando!");
};

export default {
    saveCredentials,
    disconnectAccount,
    createPayment,
    checkTransactionStatus
};
