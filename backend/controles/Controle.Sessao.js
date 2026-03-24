
import { OAuth2Client } from 'google-auth-library';
import servicoUsuario from '../ServicosBackend/Servico.Usuario.js';
import servicoSessao from '../ServicosBackend/Servico.Sessao.js';
import ServicoResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import validadorUsuario from '../validators/Validator.Estrutura.Usuario.js';
import validadorSessao from '../validators/Validator.Estrutura.Sessao.js';
import variaveis from '../config/Variaveis.Backend.js';
import * as Log from '../Logs/BK.Log.Supremo.js';

const oAuth2Client = new OAuth2Client(
  variaveis.google.clientId,
  variaveis.google.clientSecret,
  variaveis.google.redirectUri
);

const registrar = async (req, res) => {
    const dadosRequisicao = { userAgent: req.headers['user-agent'], ipAddress: req.ip };

    try {
        const dadosUsuarioValidados = validadorUsuario.validarRegistro(req.body);
        Log.controller.info('Iniciando registro de usuário', { event: 'INICIANDO_REGISTRO', email: dadosUsuarioValidados.email });

        const usuario = await servicoUsuario.registrarNovoUsuario(dadosUsuarioValidados);

        const { token, dadosSessao } = await servicoSessao.prepararNovaSessao({ usuario, dadosRequisicao });

        const dadosSessaoValidados = validadorSessao.validarNovaSessao(dadosSessao);

        await servicoSessao.salvarSessao(dadosSessaoValidados);

        Log.controller.info('Registro de usuário bem-sucedido', { event: 'REGISTRO_SUCESSO', userId: usuario.id });
        return ServicoResposta.sucesso(res, { token, user: usuario.paraRespostaHttp() }, 201);

    } catch (error) {
        Log.controller.error('Falha no registro de usuário', { event: 'FALHA_REGISTRO', email: req.body.email, errorMessage: error.message });
        if (error.message.includes('está em uso')) {
            return ServicoResposta.conflito(res, error.message);
        }
        return ServicoResposta.requisiçãoInválida(res, error.message);
    }
};

const login = async (req, res) => {
    const dadosRequisicao = { userAgent: req.headers['user-agent'], ipAddress: req.ip };

    try {
        const dadosLoginValidados = validadorUsuario.validarLogin(req.body);
        Log.controller.info('Iniciando login de usuário', { event: 'INICIANDO_LOGIN', email: dadosLoginValidados.email });

        const usuario = await servicoUsuario.autenticarUsuarioPorCredenciais(dadosLoginValidados);

        const { token, dadosSessao } = await servicoSessao.prepararNovaSessao({ usuario, dadosRequisicao });

        const dadosSessaoValidados = validadorSessao.validarNovaSessao(dadosSessao);

        await servicoSessao.salvarSessao(dadosSessaoValidados);

        Log.controller.info('Login de usuário bem-sucedido', { event: 'LOGIN_SUCESSO', userId: usuario.id });
        return ServicoResposta.sucesso(res, { token, user: usuario.paraRespostaHttp() });

    } catch (error) {
        Log.controller.error('Falha no login de usuário', { event: 'FALHA_LOGIN', email: req.body.email, errorMessage: error.message });
        if (error.message.includes('Credenciais inválidas')) {
            return ServicoResposta.nãoAutorizado(res, error.message);
        }
        return ServicoResposta.requisiçãoInválida(res, error.message);
    }
};

const googleAuth = async (req, res) => {
    const dadosRequisicao = { userAgent: req.headers['user-agent'], ipAddress: req.ip };
    const { code } = req.body;

    if (!code) {
        return ServicoResposta.requisiçãoInválida(res, "O código de autorização do Google é obrigatório.");
    }

    try {
        Log.controller.info('Iniciando autenticação com Google', { event: 'INICIANDO_GOOGLE_AUTH' });
        
        const { tokens } = await oAuth2Client.getToken(code);
        
        if (!tokens.id_token) {
            Log.controller.error('ID token do Google não obtido', { event: 'GOOGLE_AUTH_NO_ID_TOKEN' });
            return ServicoResposta.erro(res, "Falha ao obter o ID token do Google.");
        }

        const loginTicket = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: variaveis.google.clientId,
        });

        const payload = loginTicket.getPayload();
        if (!payload) {
            throw new Error('Não foi possível obter os dados do usuário do Google.');
        }

        const dadosGoogle = {
            googleId: payload.sub,
            email: payload.email,
            nome: payload.name,
            foto: payload.picture,
        };

        const dadosGoogleValidados = validadorUsuario.validarGoogleAuth(dadosGoogle);

        const { usuario, isNewUser } = await servicoUsuario.autenticarOuCriarPorGoogle(dadosGoogleValidados);

        const { token, dadosSessao } = await servicoSessao.prepararNovaSessao({ usuario, dadosRequisicao });

        const dadosSessaoValidados = validadorSessao.validarNovaSessao(dadosSessao);
        await servicoSessao.salvarSessao(dadosSessaoValidados);

        Log.controller.info('Autenticação com Google bem-sucedida', { event: 'GOOGLE_AUTH_SUCESSO', userId: usuario.id });
        return ServicoResposta.sucesso(res, { 
            token, 
            user: usuario.paraRespostaHttp(),
            isNewUser
        });

    } catch (error) {
        Log.controller.error('Falha na autenticação com Google', { event: 'FALHA_GOOGLE_AUTH', errorMessage: error.message, error });
        if (error.message.includes('Faça login com sua senha')) {
            return ServicoResposta.conflito(res, error.message);
        }
        return ServicoResposta.erro(res, `Erro no servidor durante a autenticação com Google: ${error.message}`);
    }
};

const logout = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return ServicoResposta.nãoAutorizado(res, 'Token não fornecido');
        }
        await servicoSessao.encerrarSessao(token);
        Log.controller.info('Logout bem-sucedido', { event: 'LOGOUT_SUCESSO' });
        return ServicoResposta.sucesso(res, { message: 'Logout bem-sucedido' });

    } catch (error) {
        Log.controller.error('Falha no logout', { event: 'FALHA_LOGOUT', errorMessage: error.message });
        return ServicoResposta.erro(res, 'Falha ao fazer logout');
    }
};

export default {
    registrar,
    login,
    googleAuth,
    logout
};
