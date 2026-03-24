
// backend/controles/Controles.Provedor.Stripe.js
import Stripe from 'stripe';
import * as Log from '../Logs/BK.Log.Supremo.js';
import config from '../config/Variaveis.Backend.js';
import SistemaTaxasStripe from '../ServicosBackend/Sistema.Taxas.Stripe.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';

let stripe = null;

if (config.stripeSecretKey) {
    stripe = new Stripe(config.stripeSecretKey);
    Log.controller.info('Stripe inicializado', { event: 'STRIPE_INITIALIZED' });
} else {
    Log.controller.warn('Stripe não inicializado', { event: 'STRIPE_NOT_INITIALIZED', message: 'Stripe secret key not found' });
}

const getSellerStripeAccountId = async (sellerEmail) => {
    Log.controller.info('Obtendo ID da conta Stripe do vendedor', { event: 'STRIPE_GET_SELLER_ACCOUNT_ID', sellerEmail });
    // TODO: Implementar lógica real para buscar o ID da conta Stripe do vendedor
    return 'acct_1PGGceR5gdo2V8nF';
};

const createPaymentIntent = async (req, res) => {
    if (!stripe) {
        Log.controller.error('Erro ao criar intenção de pagamento Stripe: Stripe não configurado', { event: 'STRIPE_PAYMENT_INTENT_ERROR', errorMessage: 'Stripe not configured' });
        return ServicoHTTPResposta.servicoIndisponivel(res, "O sistema de pagamentos não está configurado. Contate o suporte.");
    }

    const { amount, currency, creatorEmail } = req.body;
    Log.controller.info('Iniciando criação de intenção de pagamento Stripe', { event: 'STRIPE_CREATE_PAYMENT_INTENT_START', amount, currency, creatorEmail });

    if (!creatorEmail) {
        Log.controller.warn('O e-mail do criador é obrigatório', { event: 'STRIPE_CREATE_PAYMENT_INTENT_WARN', message: 'Creator email is required' });
        return ServicoHTTPResposta.requisicaoMalSucedida(res, "O e-mail do criador é obrigatório para processar o pagamento.");
    }

    try {
        const destinationAccountId = await getSellerStripeAccountId(creatorEmail);

        if (!destinationAccountId) {
            Log.controller.warn('Conta de destino não encontrada', { event: 'STRIPE_CREATE_PAYMENT_INTENT_WARN', message: 'Destination account not found' });
            return ServicoHTTPResposta.naoEncontrado(res, "A conta de pagamento do vendedor não foi encontrada ou não está conectada.");
        }

        const applicationFee = SistemaTaxasStripe.calcularTaxaPlataforma(amount);
        Log.controller.info('Taxa da plataforma calculada', { event: 'STRIPE_APPLICATION_FEE_CALCULATED', applicationFee });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            application_fee_amount: applicationFee,
            transfer_data: {
                destination: destinationAccountId,
            },
        });

        Log.controller.info('Intenção de pagamento Stripe criada com sucesso', { event: 'STRIPE_CREATE_PAYMENT_INTENT_SUCCESS', paymentIntentId: paymentIntent.id });
        ServicoHTTPResposta.criado(res, { clientSecret: paymentIntent.client_secret });

    } catch (error) {
        Log.controller.error('Erro ao criar intenção de pagamento Stripe', { event: 'STRIPE_CREATE_PAYMENT_INTENT_ERROR', errorMessage: error.message, amount, currency, creatorEmail });
        ServicoHTTPResposta.erro(res, error.message, 400, error.message);
    }
};

const checkSessionStatus = async (req, res) => {
    if (!stripe) {
        Log.controller.error('Erro ao verificar status da sessão Stripe: Stripe não configurado', { event: 'STRIPE_CHECK_SESSION_STATUS_ERROR', errorMessage: 'Stripe not configured' });
        return ServicoHTTPResposta.servicoIndisponivel(res, "O sistema de pagamentos não está configurado. Contate o suporte.");
    }

    const { sessionId } = req.params;
    Log.controller.info('Iniciando verificação de status da sessão Stripe', { event: 'STRIPE_CHECK_SESSION_STATUS_START', sessionId });

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        Log.controller.info('Status da sessão Stripe verificado com sucesso', { event: 'STRIPE_CHECK_SESSION_STATUS_SUCCESS', sessionId, status: session.status });
        ServicoHTTPResposta.sucesso(res, { status: session.status, payment_status: session.payment_status });
    } catch (error) {
        Log.controller.error('Erro ao verificar status da sessão Stripe', { event: 'STRIPE_CHECK_SESSION_STATUS_ERROR', errorMessage: error.message, sessionId });
        ServicoHTTPResposta.erro(res, error.message, 400, error.message);
    }
};

export default {
    createPaymentIntent,
    checkSessionStatus
};
