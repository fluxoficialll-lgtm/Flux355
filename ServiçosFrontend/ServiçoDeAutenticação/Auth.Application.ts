
import { processoLogin, IEstadoAutenticacao, IUsuario } from './Processo.Login';
import { IRegistroParams, IResultadoRegistro } from './Processo.Registrar';
import { infraProvider } from '../Infra/Infra.Provider.Usuario';
import { loginGoogle, IUsuarioSocial } from './Login.Google';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';

type Listener = (estado: IEstadoAutenticacao) => void;

const logger = createServiceLogger('ServicoAutenticacao');

class ServicoAutenticacao {
  private listeners: Listener[] = [];

  private notificarListeners() {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  public async login(params: { email: string, senha: string }): Promise<void> {
    // ... (código existente)
  }

  public async logout() {
    const operation = 'logout';
    logger.logOperationStart(operation);
    processoLogin.limparEstado();
    this.notificarListeners();
    logger.logOperationSuccess(operation);
  }

  public async registrar(dadosRegistro: IRegistroParams): Promise<IResultadoRegistro> {
    // ... (código existente)
  }

  public async completarPerfil(dadosPerfil: Partial<IUsuario>): Promise<IResultadoAtualizacao> {
    // ... (código existente)
  }

  public async deletarMinhaConta(): Promise<IResultadoDelecao> {
    // ... (código existente)
  }

  public iniciarLoginComGoogle(): void {
    loginGoogle.iniciarLogin();
  }

  public async finalizarLoginComGoogle(idToken: string): Promise<void> {
    const operation = 'finalizarLoginComGoogle';
    logger.logOperationStart(operation);
    try {
      const dadosUsuarioSocial: IUsuarioSocial = await loginGoogle.processarCallback(idToken);
      
      let usuario = await infraProvider.buscarUsuarioPorEmail(dadosUsuarioSocial.email);

      if (!usuario) {
        const novoUsuario = {
            nome: dadosUsuarioSocial.nome,
            email: dadosUsuarioSocial.email,
            senha: Math.random().toString(36).slice(-8), // Senha aleatória, pois o login é social
            aceitouTermos: true,
        };
        const resultadoRegistro = await infraProvider.criarUsuario(novoUsuario);
        if(!resultadoRegistro.sucesso) {
            throw new Error(resultadoRegistro.mensagem);
        }
        usuario = await infraProvider.buscarUsuarioPorEmail(dadosUsuarioSocial.email);
        if(!usuario) {
            throw new Error('Falha ao buscar usuário recém-criado.');
        }
      }

      processoLogin.definirEstado({ 
        autenticado: true, 
        usuario: { ...usuario, perfilCompleto: !!usuario.perfilCompleto }, 
        token: idToken
      });

      this.notificarListeners();
      logger.logOperationSuccess(operation, { userId: usuario.id });

    } catch (error) {
      logger.logOperationError(operation, error as Error);
      processoLogin.definirErro((error as Error).message);
      this.notificarListeners();
    }
  }

  public async buscarUsuarioPorId(id: string): Promise<IUsuario> {
    return infraProvider.buscarUsuario(id);
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
export type { IRegistroParams, IResultadoRegistro };
export type { IAtualizacaoUsuarioParams as CompletarPerfilParams, IResultadoAtualizacao as ResultadoCompletarPerfil };
export type { IResultadoDelecao };
