
import { processoLogin, IEstadoAutenticacao, IUsuario } from './Processo.Login';
import { IPerfilParaCompletar, IResultadoCompletarPerfil, processoCompletarPerfil } from './Processo.Completar.Perfil';
import { IRegistroParams, IResultadoRegistro } from './Processo.Registrar';
import { AutenticacaoAPI } from '../APIs/Autenticacao.API';
import { loginGoogle } from './Login.Google';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';

type Listener = (estado: IEstadoAutenticacao) => void;

const logger = createServiceLogger('ServicoAutenticacao');

class ServicoAutenticacao {
  private listeners: Listener[] = [];

  private notificarListeners() {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  public async login(params: { email: string, senha: string }): Promise<void> {
    const operation = 'login';
    logger.logOperationStart(operation, params);
    try {
      const respostaAPI = await AutenticacaoAPI.loginComEmail(params);
      const usuario: IUsuario = {
        id: respostaAPI.usuario.id,
        nome: respostaAPI.usuario.apelido,
        email: respostaAPI.usuario.email
      };
      processoLogin.definirEstadoAutenticado(usuario, respostaAPI.token);
      logger.logOperationSuccess(operation, { usuario });
    } catch (error) {
      logger.logOperationError(operation, error, params);
      processoLogin.limparEstado();
    }
    this.notificarListeners();
  }

  public async logout() {
    const operation = 'logout';
    logger.logOperationStart(operation);
    processoLogin.limparEstado();
    this.notificarListeners();
    logger.logOperationSuccess(operation);
  }

  public async registrar(dadosRegistro: IRegistroParams): Promise<IResultadoRegistro> {
    const operation = 'registrar';
    logger.logOperationStart(operation, dadosRegistro);
    if (dadosRegistro.senha !== dadosRegistro.confirmacaoSenha) {
        const error = new Error("As senhas não conferem.");
        logger.logOperationError(operation, error, dadosRegistro);
        return { sucesso: false, mensagem: error.message };
    }
    try {
      const respostaAPI = await AutenticacaoAPI.registrar(dadosRegistro);
      await this.login({ email: dadosRegistro.email, senha: dadosRegistro.senha });
      logger.logOperationSuccess(operation, { usuario: respostaAPI.usuario });
      return { sucesso: true, mensagem: "Registro bem-sucedido!", usuario: respostaAPI.usuario };
    } catch (error: any) {
      logger.logOperationError(operation, error, dadosRegistro);
      return { sucesso: false, mensagem: error.message || "Ocorreu um erro no registro." };
    }
  }

  public async completarPerfil(dadosPerfil: IPerfilParaCompletar): Promise<IResultadoCompletarPerfil> {
    const operation = 'completarPerfil';
    logger.logOperationStart(operation, dadosPerfil);
    const estadoAtual = this.getState();

    if (!estadoAtual.autenticado || !estadoAtual.usuario) {
        const error = new Error("Usuário não autenticado.");
        logger.logOperationError(operation, error);
        return { sucesso: false, mensagem: error.message };
    }

    // Delega a lógica para o ProcessoCompletarPerfil
    const resultado = await processoCompletarPerfil.executar(dadosPerfil);

    if (resultado.sucesso && resultado.usuarioAtualizado) {
        const { usuarioAtualizado } = resultado;
        const novoEstadoUsuario: IUsuario = { ...estadoAtual.usuario, nome: usuarioAtualizado.apelido };
        
        // Atualiza o estado de autenticação local
        processoLogin.definirEstadoAutenticado(novoEstadoUsuario, estadoAtual.token || '');
        this.notificarListeners();
        logger.logOperationSuccess(operation, { usuarioAtualizado });
    } else {
        logger.logOperationError(operation, new Error(resultado.mensagem), dadosPerfil);
    }

    return resultado;
  }

  public iniciarLoginComGoogle(): void {
    const operation = 'iniciarLoginComGoogle';
    logger.logInfo(`[Start] ${operation}`);
    loginGoogle.iniciarLogin();
  }

  public async finalizarLoginComGoogle(code: string): Promise<void> {
    const operation = 'finalizarLoginComGoogle';
    logger.logOperationStart(operation, { code });
    try {
      const dadosUsuarioGoogle = await loginGoogle.processarCallback(code);
      const respostaAPI = await AutenticacaoAPI.loginComProvedorSocial({
        provedor: 'google',
        token: dadosUsuarioGoogle.tokenProvider,
        email: dadosUsuarioGoogle.email,
        nome: dadosUsuarioGoogle.nome
      });

      const usuario: IUsuario = {
        id: respostaAPI.usuario.id,
        nome: respostaAPI.usuario.apelido,
        email: respostaAPI.usuario.email
      };
      processoLogin.definirEstadoAutenticado(usuario, respostaAPI.token);
      logger.logOperationSuccess(operation, { usuario });

    } catch (error) {
      logger.logOperationError(operation, error, { code });
      processoLogin.limparEstado();
    }

    this.notificarListeners();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getState(): IEstadoAutenticacao {
    return processoLogin.obterEstadoAtual();
  }
}

export const servicoAutenticacao = new ServicoAutenticacao();

export type { IEstadoAutenticacao as AuthState };
export type { IPerfilParaCompletar, IResultadoCompletarPerfil };
export type { IRegistroParams, IResultadoRegistro };
