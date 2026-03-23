
import Stripe from 'stripe';
import Log from '../Logs/BK.Log.Supremo.js';
import config from '../config/Variaveis.Backend.js';
import SistemaTaxasStripe from '../ServicosBackend/Sistema.Taxas.Stripe.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';

const logger = Log.createLogger('StripeProvider');
let stripe = null;

if (config.stripeSecretKey) {
    stripe = new Stripe(config.stripeSecretKey);
    logger.info('STRIPE_INITIALIZED');
} else {
    logger.warn('STRIPE_NOT_INITIALIZED', { message: 'Stripe secret key not found' });
}

const getSellerStripeAccountId = async (sellerEmail) => {
    logger.info('STRIPE_GET_SELLER_ACCOUNT_ID', { sellerEmail });
    // TODO: Implement actual logic to fetch the seller's Stripe account ID
    return 'acct_1PGGceR5gdo2V8nF';
};

const createPaymentIntent = async (req, res) => {
    if (!stripe) {
        logger.error('STRIPE_PAYMENT_INTENT_ERROR', { errorMessage: 'Stripe not configured' });
        return ServicoHTTPResposta.servicoIndisponivel(res, "O sistema de pagamentos não está configurado. Contate o suporte.");
    }

    const { amount, currency, creatorEmail } = req.body;
    logger.info('STRIPE_CREATE_PAYMENT_INTENT_START', { amount, currency, creatorEmail });

    if (!creatorEmail) {
        logger.warn('STRIPE_CREATE_PAYMENT_INTENT_WARN', { message: 'Creator email is required' });
        return ServicoHTTPResposta.requisicaoMalSucedida(res, "O e-mail do criador é obrigatório para processar o pagamento.");
    }

    try {
        const destinationAccountId = await getSellerStripeAccountId(creatorEmail);

        if (!destinationAccountId) {
            logger.warn('STRIPE_CREATE_PAYMENT_INTENT_WARN', { message: 'Destination account not found' });
            return ServicoHTTPResposta.naoEncontrado(res, "A conta de pagamento do vendedor não foi encontrada ou não está conectada.");
        }

        const applicationFee = SistemaTaxasStripe.calcularTaxaPlataforma(amount);
        logger.info('STRIPE_APPLICATION_FEE_CALCULATED', { applicationFee });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            application_fee_amount: applicationFee,
            transfer_data: {
                destination: destinationAccountId,
            },
        });

        logger.info('STRIPE_CREATE_PAYMENT_INTENT_SUCCESS', { paymentIntentId: paymentIntent.id });
        ServicoHTTPResposta.criado(res, { clientSecret: paymentIntent.client_secret });

    } catch (error) {
        logger.error('STRIPE_CREATE_PAYMENT_INTENT_ERROR', { errorMessage: error.message, amount, currency, creatorEmail });
        ServicoHTTPResposta.erro(res, error.message, 400, error.message);
    }
};

const checkSessionStatus = async (req, res) => {
    if (!stripe) {
        logger.error('STRIPE_CHECK_SESSION_STATUS_ERROR', { errorMessage: 'Stripe not configured' });
        return ServicoHTTPResposta.servicoIndisponivel(res, "O sistema de pagamentos não está configurado. Contate o suporte.");
    }

    const { sessionId } = req.params;
    logger.info('STRIPE_CHECK_SESSION_STATUS_START', { sessionId });

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        logger.info('STRIPE_CHECK_SESSION_STATUS_SUCCESS', { sessionId, status: session.status });
        ServicoHTTPResposta.sucesso(res, { status: session.status, payment_status: session.payment_status });
    } catch (error) {
        logger.error('STRIPE_CHECK_SESSION_STATUS_ERROR', { errorMessage: error.message, sessionId });
        ServicoHTTPResposta.erro(res, error.message, 400, error.message);
    }
};

export default {
    createPaymentIntent,
    checkSessionStatus
};
