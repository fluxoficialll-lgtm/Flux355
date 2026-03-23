
import express from 'express';

// --- Novas Rotas Refatoradas ---
import rotasSessao from './Rotas.Sessao.js';
import rotasUsuario from './Rotas.Usuario.js';

// --- Rotas de Infraestrutura ---
import rotasGestaoVariaveis from './Rotas.Gestao.Variaveis.js';

// --- Rotas de Canais de Conteúdo ---
import rotasPublicacaoFeed from './Rotas.Publicacao.Feed.js';
import rotasComentariosFeed from './Rotas.Publicacao.Comentarios.Feed.js';
import rotasPublicacaoMarketplace from './Rotas.Publicacao.Marketplace.js';
import rotasComentariosMarketplace from './Rotas.Publicacao.Comentarios.Marketplace.js';
import rotasPublicacaoReels from './Rotas.Publicacao.Reels.js';
import rotasComentariosReels from './Rotas.Publicacao.Comentarios.Reels.js';
import rotasConversas from './Rotas.Conversas.js';

// --- Rotas de Grupos (Legado ou Futuro) ---
import rotasCriacaoGrupoPublico from './Rotas.Criacao.Grupo.Publico.js';
import rotasCriacaoGrupoPrivado from './Rotas.Criacao.Grupo.Privado.js';
import rotasCriacaoGrupoPago from './Rotas.Criacao.Grupo.Pago.js';
import rotasGruposConfiguracoes from './Rotas.Grupos.Configuracoes.js';

// --- Rotas de Pagamento (Legado ou Futuro) ---
import rotasSyncPay from './Rotas.Provedor.SyncPay.js';
import rotasPayPal from './Rotas.Provedor.PayPal.js';
import rotasStripe from './Rotas.Provedor.Stripe.js';
import rotasCredencialStripe from './Rotas.Gestao.Credencial.Stripe.js';

const router = express.Router();

// A importação e o uso do middleware de log antigo foram removidos daqui.
// O gerenciamento de log e contexto agora é feito globalmente no `setupMiddlewares`.

// --- Autenticação e Gerenciamento de Usuário ---
router.use('/auth', rotasSessao);
router.use('/usuarios', rotasUsuario);

// --- Configuração ---
router.use('/v1/config', rotasGestaoVariaveis);

// --- Canais Principais ---
router.use('/feed', rotasPublicacaoFeed);
router.use('/comments', rotasComentariosFeed);
router.use('/marketplace/items', rotasPublicacaoMarketplace);
router.use('/marketplace/comments', rotasComentariosMarketplace);
router.use('/reels', rotasPublicacaoReels);
router.use('/reels/comments', rotasComentariosReels);
router.use('/conversas', rotasConversas);

// --- Rotas Adicionais ---
router.use('/groups/public', rotasCriacaoGrupoPublico);
router.use('/groups/private', rotasCriacaoGrupoPrivado);
router.use('/groups/paid', rotasCriacaoGrupoPago);
router.use('/groups', rotasGruposConfiguracoes);
router.use('/syncpay', rotasSyncPay);
router.use('/paypal', rotasPayPal);
router.use('/stripe', rotasStripe);
router.use('/credenciais-stripe', rotasCredencialStripe);

export default router;
