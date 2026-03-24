
// backend/controles/Controles.Gestao.Credencial.Stripe.js
import * as Log from '../Logs/BK.Log.Supremo.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import Stripe from 'stripe';
import config from '../config/Variaveis.Backend.js';

let stripe = null;
if (config.stripeSecretKey) {
    stripe = new Stripe(config.stripeSecretKey);
    Log.controller.info('Stripe Connect inicializado', { event: 'STRIPE_CONNECT_INITIALIZED' });
} else {
    Log.controller.warn('Stripe Connect não configurado', { event: 'STRIPE_CONNECT_NOT_CONFIGURED' });
}

const createAccountLink = async (req, res) => {
    if (!stripe) {
        Log.controller.error('Stripe Connect não está disponível', { event: 'STRIPE_CONNECT_UNAVAILABLE', errorMessage: 'Stripe not configured' });
        return ServicoHTTPResposta.erro(res, "O sistema de pagamentos não está configurado. Contate o suporte.", 503);
    }

    const { accountId, refresh_url, return_url } = req.body;
    Log.controller.info('Iniciando criação de link de conta Stripe', { event: 'STRIPE_CREATE_ACCOUNT_LINK_START', accountId });

    try {
        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: refresh_url,
            return_url: return_url,
            type: 'account_onboarding',
        });

        Log.controller.info('Link de conta Stripe criado com sucesso', { event: 'STRIPE_CREATE_ACCOUNT_LINK_SUCCESS', accountId });
        return ServicoHTTPResposta.sucesso(res, { url: accountLink.url });
    } catch (error) {
        Log.controller.error('Falha ao criar link de conta Stripe', { event: 'STRIPE_CREATE_ACCOUNT_LINK_ERROR', errorMessage: error.message, accountId });
        return ServicoHTTPResposta.erro(res, 'Falha ao criar link de conta Stripe.', 400, error.message);
    }
};

const getAccountDetails = async (req, res) => {
    if (!stripe) {
        Log.controller.error('Stripe Connect não está disponível', { event: 'STRIPE_CONNECT_UNAVAILABLE', errorMessage: 'Stripe not configured' });
        return ServicoHTTPResposta.erro(res, "O sistema de pagamentos não está configurado. Contate o suporte.", 503);
    }

    const { accountId } = req.params;
    Log.controller.info('Iniciando obtenção de detalhes da conta Stripe', { event: 'STRIPE_GET_ACCOUNT_DETAILS_START', accountId });

    try {
        const account = await stripe.accounts.retrieve(accountId);
        Log.controller.info('Detalhes da conta Stripe obtidos com sucesso', { event: 'STRIPE_GET_ACCOUNT_DETAILS_SUCCESS', accountId });
        return ServicoHTTPResposta.sucesso(res, account);
    } catch (error) {
        Log.controller.error('Falha ao obter detalhes da conta Stripe', { event: 'STRIPE_GET_ACCOUNT_DETAILS_ERROR', errorMessage: error.message, accountId });
        return ServicoHTTPResposta.erro(res, 'Falha ao obter detalhes da conta Stripe.', 400, error.message);
    }
};

const disconnectAccount = (req, res) => {
    const { accountId } = req.body;
    Log.controller.warn('Solicitação de desconexão de conta Stripe recebida', { event: 'STRIPE_DISCONNECT_ACCOUNT_REQUESTED', accountId });

    if (!stripe) {
        Log.controller.error('Stripe Connect não está disponível', { event: 'STRIPE_CONNECT_UNAVAILABLE', errorMessage: 'Stripe not configured' });
        return ServicoHTTPResposta.erro(res, "O sistema de pagamentos não está configurado. Contate o suporte.", 503);
    }
    
    Log.controller.info('Implementação de desconexão da conta Stripe pendente', { event: 'STRIPE_DISCONNECT_ACCOUNT_IMPLEMENTATION_PENDING', accountId });

    return ServicoHTTPResposta.sucesso(res, { message: "A funcionalidade de desconexão da conta Stripe foi registrada, mas a implementação final está pendente." });
};

export default {
    createAccountLink,
    getAccountDetails,
    disconnectAccount
};
