
// backend/controles/Controles.Provedor.SyncPay.js
import * as Log from '../Logs/BK.Log.Supremo.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';

// Funções de controle para o provedor SyncPay

const saveCredentials = (req, res) => {
    Log.controller.info('Requisição para salvar credenciais do SyncPay', { event: 'SYNCPAY_SAVE_CREDENTIALS_REQUESTED' });
    ServicoHTTPResposta.criado(res, null, "Rota para salvar credenciais do SyncPay funcionando!");
};

const disconnectAccount = (req, res) => {
    Log.controller.info('Requisição para desconectar conta do SyncPay', { event: 'SYNCPAY_DISCONNECT_ACCOUNT_REQUESTED' });
    ServicoHTTPResposta.sucesso(res, null, "Rota para desconectar conta do SyncPay funcionando!");
};

const createPayment = (req, res) => {
    Log.controller.info('Requisição para criar pagamento com SyncPay', { event: 'SYNCPAY_CREATE_PAYMENT_REQUESTED' });
    ServicoHTTPResposta.criado(res, null, "Rota para criar pagamento com SyncPay funcionando!");
};

const checkTransactionStatus = (req, res) => {
    Log.controller.info('Requisição para verificar status de transação do SyncPay', { event: 'SYNCPAY_CHECK_TRANSACTION_STATUS_REQUESTED' });
    ServicoHTTPResposta.sucesso(res, null, "Rota para verificar status de transação do SyncPay funcionando!");
};

export default {
    saveCredentials,
    disconnectAccount,
    createPayment,
    checkTransactionStatus
};
