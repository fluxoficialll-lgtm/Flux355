
import { IAutenticacaoServico, LoginRequest, LoginResponse, GoogleLoginRequest, GoogleLoginResponse } from '../Contratos/Contrato.Autenticacao';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';
import { CriacaoContaDto } from '../../types/Entrada/Dto.Estrutura.Conta.Flux';
import { PerfilUsuario } from '../Contratos/Contrato.Perfil.Usuario';
import { AuthStateManager, AuthState } from './Auth.State';
import { AuthSession } from './Auth.Session';
import { AuthLogin } from './Auth.Login';
import { AuthAccount } from './Auth.Account';
import { processoCriacaoUsuario } from './Processo.Criacao.Usuario';
import { processoGestaoSessao } from './Processo.Gestao.Sessao';

const log = createServiceLogger('Auth.Application.ts');

class AuthApplicationService implements IAutenticacaoServico {
  private stateManager: AuthStateManager;
  private session: AuthSession;
  private loginService: AuthLogin;
  private accountService: AuthAccount;
  private criacaoUsuario = processoCriacaoUsuario;
  private gestaoSessao = processoGestaoSessao;

  constructor() {
    this.stateManager = new AuthStateManager();
    this.session = new AuthSession();
    this.loginService = new AuthLogin();
    this.accountService = new AuthAccount();
    log.logInfo('Serviço de Aplicação de Autenticação instanciado.');
  }

  public async initialize() {
    try {
      const user = this.session.getCurrentUser();
      const isNewUserStored = sessionStorage.getItem('flux_is_new_user');
      let isNewUser = false;
      if (isNewUserStored === 'true') {
        isNewUser = true;
        sessionStorage.removeItem('flux_is_new_user');
      }
      this.stateManager.updateState({ user, isAuthenticated: !!user, loading: false, isNewUser });
    } catch (error) {
      log.logError('Falha na inicialização da sessão', error);
      this.stateManager.updateState({ user: null, isAuthenticated: false, loading: false, error: 'Falha ao verificar a sessão.' });
    }
  }

  public subscribe(listener: (state: AuthState) => void): () => void {
    return this.stateManager.subscribe(listener);
  }

  public getState(): AuthState {
    return this.stateManager.getState();
  }

  async finalizarLoginComToken(token: string) {
    log.logInfo('Finalizando login com token.');
    try {
        const { user, isNewUser } = this.session.finalizaLoginComToken(token);
        this.stateManager.updateState({ user, isAuthenticated: true, error: null, isNewUser });
        log.logInfo('Login com token finalizado com sucesso.', { userId: user.id });
    } catch (error) {
        log.logError('Falha ao finalizar login com token', error);
        this.stateManager.updateState({ error: (error as Error).message });
        throw error;
    }
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const { token, user } = await this.loginService.login(data);
      this.session.iniciarSessao(token, user);
      this.stateManager.updateState({ user, isAuthenticated: true, error: null, isNewUser: false });
      return { user };
    } catch (error) {
      log.logError('Falha no login', error);
      this.stateManager.updateState({ error: (error as Error).message });
      throw error;
    }
  }

  iniciarLoginComGoogle(): void {
    this.loginService.redirectToGoogle();
  }

  async resolverSessaoLogin(data: GoogleLoginRequest): Promise<GoogleLoginResponse> {
    try {
      const { token, user, isNewUser } = await this.loginService.handleGoogleCallback(data);
      this.session.iniciarSessao(token, user);
      if (isNewUser) {
        sessionStorage.setItem('flux_is_new_user', 'true');
      }
      this.stateManager.updateState({ user, isAuthenticated: true, error: null, isNewUser });
      return { user, isNewUser };
    } catch (error) {
      log.logError('Falha no login com Google', error);
      this.stateManager.updateState({ error: (error as Error).message });
      throw error;
    }
  }

  async resolverRedirecionamentoLogin(sessionId: string) {
    return this.gestaoSessao.resolverRedirecionamentoLogin(sessionId);
  }
  
  async logout() {
    this.session.encerrarSessao();
    this.stateManager.updateState({ user: null, isAuthenticated: false, isNewUser: false });
  }

  async criarConta(dados: CriacaoContaDto): Promise<void> {
    const { user, token } = await this.criacaoUsuario.criarConta(dados);
    this.session.iniciarSessao(token, user);
    this.stateManager.updateState({ user, isAuthenticated: true, isNewUser: true });
  }

  async completeProfile(data: any): Promise<void> {
    const user = await this.accountService.completeProfile(data, this.getCurrentUser());
    this.session.atualizarUsuarioSessao(user);
    this.stateManager.updateState({ user, isNewUser: false });
  }

  async updateProfile(data: any): Promise<void> {
    const user = await this.accountService.updateProfile(data, this.getCurrentUser());
    this.session.atualizarUsuarioSessao(user);
    this.stateManager.updateState({ user });
  }

  async excluirConta(): Promise<void> {
    await this.accountService.excluirConta();
    this.session.encerrarSessao();
    this.stateManager.updateState({ user: null, isAuthenticated: false });
  }

  getCurrentUser(): any | null {
    return this.stateManager.getState().user;
  }

  getToken(): string | null {
    return this.session.getToken();
  }
  
  async getPublicProfileByUsername(username: string): Promise<PerfilUsuario | null> {
    return this.accountService.getPublicProfileByUsername(username);
a  }

  async verifyCode(email: string, code: string, isReset: boolean = false): Promise<void> {
    return this.accountService.verifyCode(email, code, isReset);
  }

  async sendVerificationCode(email: string, context: 'verification' | 'reset' = 'verification'): Promise<void> {
    return this.accountService.sendVerificationCode(email, context);
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    return this.accountService.resetPassword(email, newPassword);
  }
}

export const servicoAutenticacao = new AuthApplicationService();
