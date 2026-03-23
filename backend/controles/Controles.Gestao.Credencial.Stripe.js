
import Log from '../Logs/BK.Log.Supremo.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import Stripe from 'stripe';
import config from '../config/Variaveis.Backend.js';

const logger = Log.createLogger('StripeConnect');

let stripe = null;
if (config.stripeSecretKey) {
    stripe = new Stripe(config.stripeSecretKey);
    logger.info('STRIPE_CONNECT_INITIALIZED');
} else {
    logger.warn('STRIPE_CONNECT_NOT_CONFIGURED');
}

const createAccountLink = async (req, res) => {
    if (!stripe) {
        logger.error('STRIPE_CONNECT_UNAVAILABLE', { errorMessage: 'Stripe not configured' });
        return ServicoHTTPResposta.erro(res, "O sistema de pagamentos não está configurado. Contate o suporte.", 503);
    }

    const { accountId, refresh_url, return_url } = req.body;
    logger.info('STRIPE_CREATE_ACCOUNT_LINK_START', { accountId });

    try {
        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: refresh_url,
            return_url: return_url,
            type: 'account_onboarding',
        });

        logger.info('STRIPE_CREATE_ACCOUNT_LINK_SUCCESS', { accountId });
        return ServicoHTTPResposta.sucesso(res, { url: accountLink.url });
    } catch (error) {
        logger.error('STRIPE_CREATE_ACCOUNT_LINK_ERROR', { errorMessage: error.message, accountId });
        return ServicoHTTPResposta.erro(res, 'Falha ao criar link de conta Stripe.', 400, error.message);
    }
};

const getAccountDetails = async (req, res) => {
    if (!stripe) {
        logger.error('STRIPE_CONNECT_UNAVAILABLE', { errorMessage: 'Stripe not configured' });
        return ServicoHTTPResposta.erro(res, "O sistema de pagamentos não está configurado. Contate o suporte.", 503);
    }

    const { accountId } = req.params;
    logger.info('STRIPE_GET_ACCOUNT_DETAILS_START', { accountId });

    try {
        const account = await stripe.accounts.retrieve(accountId);
        logger.info('STRIPE_GET_ACCOUNT_DETAILS_SUCCESS', { accountId });
        return ServicoHTTPResposta.sucesso(res, account);
    } catch (error) {
        logger.error('STRIPE_GET_ACCOUNT_DETAILS_ERROR', { errorMessage: error.message, accountId });
        return ServicoHTTPResposta.erro(res, 'Falha ao obter detalhes da conta Stripe.', 400, error.message);
    }
};

const disconnectAccount = (req, res) => {
    const { accountId } = req.body;
    logger.warn('STRIPE_DISCONNECT_ACCOUNT_REQUESTED', { accountId });

    if (!stripe) {
        logger.error('STRIPE_CONNECT_UNAVAILABLE', { errorMessage: 'Stripe not configured' });
        return ServicoHTTPResposta.erro(res, "O sistema de pagamentos não está configurado. Contate o suporte.", 503);
    }
    
    logger.info('STRIPE_DISCONNECT_ACCOUNT_IMPLEMENTATION_PENDING', { accountId });

    return ServicoHTTPResposta.sucesso(res, { message: "A funcionalidade de desconexão da conta Stripe foi registrada, mas a implementação final está pendente." });
};

export default {
    createAccountLink,
    getAccountDetails,
    disconnectAccount
};
