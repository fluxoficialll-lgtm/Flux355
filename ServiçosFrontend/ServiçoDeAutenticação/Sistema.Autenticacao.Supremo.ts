
import { IAutenticacaoServico, LoginRequest, LoginResponse, GoogleLoginRequest, GoogleLoginResponse } from '../Contratos/Contrato.Autenticacao';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';
import { CriacaoContaDto } from '../../types/Entrada/Dto.Estrutura.Conta.Flux';
import { PerfilUsuario } from '../Contratos/Contrato.Perfil.Usuario';
import { servicoGestaoLogin } from './Processo.Login';
import { processoGestaoSessao } from './Processo.Gestao.Sessao';
import { processoGestaoConta, Usuario } from './Processo.Gestao.Conta';
import { processoCriacaoUsuario } from './Processo.Criacao.Usuario';

const log = createServiceLogger('Sistema.Autenticacao.Supremo');

interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isNewUser?: boolean;
}

class SistemaAutenticacaoSupremo implements IAutenticacaoServico {
  private gestaoLogin;
  private gestaoSessao;
  private gestaoConta;
  private criacaoUsuario;

  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    isNewUser: false,
  };

  private listeners: ((state: AuthState) => void)[] = [];

  constructor() {
    this.gestaoSessao = processoGestaoSessao;
    this.gestaoLogin = servicoGestaoLogin;
    this.gestaoConta = processoGestaoConta;
    this.criacaoUsuario = processoCriacaoUsuario;
    this.init();
    log.logInfo('Sistema de Autenticação Supremo inicializado.');
  }

  private async init() {
    try {
      const user = await this.gestaoSessao.getCurrentUser();
      this.updateState({ user, isAuthenticated: !!user, loading: false, isNewUser: false });
    } catch (error) {
      log.logError('Falha na inicialização da sessão', error);
      this.updateState({ user: null, isAuthenticated: false, loading: false, error: 'Falha ao verificar a sessão.' });
    }
  }

  public subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state); // Envia o estado atual imediatamente
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getState(): AuthState {
    return this.state;
  }

  private updateState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const { token, user } = await this.gestaoLogin.login(data);
      this.gestaoSessao.iniciarSessao(token, user);
      this.updateState({ user, isAuthenticated: true, error: null, isNewUser: false });
      return { user };
    } catch (error) {
      log.logError('Falha no login', error);
      this.updateState({ error: (error as Error).message });
      throw error;
    }
  }

  iniciarLoginComGoogle(): void {
    this.gestaoLogin.redirectToGoogle();
  }

  async resolverSessaoLogin(data: GoogleLoginRequest): Promise<GoogleLoginResponse> {
    try {
      const { token, user, isNewUser } = await this.gestaoLogin.handleGoogleCallback(data.code, data.referredBy);
      this.gestaoSessao.iniciarSessao(token, user);
      this.updateState({ user, isAuthenticated: true, error: null, isNewUser });
      return { user, isNewUser };
    } catch (error) {
      log.logError('Falha no login com Google', error);
      this.updateState({ error: (error as Error).message });
      throw error;
    }
  }

  async resolverRedirecionamentoLogin(sessionId: string) {
    return this.gestaoSessao.resolverRedirecionamentoLogin(sessionId);
  }
  
  async logout() {
    await this.gestaoSessao.encerrarSessao();
    this.updateState({ user: null, isAuthenticated: false, isNewUser: false });
  }

  async criarConta(dados: CriacaoContaDto): Promise<void> {
    const { user, token } = await this.criacaoUsuario.criarConta(dados);
    this.gestaoSessao.iniciarSessao(token, user);
    this.updateState({ user, isAuthenticated: true, isNewUser: true });
  }

  async completeProfile(data: any): Promise<void> {
    const user = await this.gestaoConta.completeProfile(data, this.getCurrentUser());
    this.gestaoSessao.atualizarUsuarioSessao(user);
    this.updateState({ user });
  }

  async updateProfile(data: any): Promise<void> {
    const user = await this.gestaoConta.updateProfile(data, this.getCurrentUser());
    this.gestaoSessao.atualizarUsuarioSessao(user);
    this.updateState({ user });
  }

  async excluirConta(): Promise<void> {
    await this.gestaoConta.excluirConta();
    this.gestaoSessao.encerrarSessao();
    this.updateState({ user: null, isAuthenticated: false });
  }

  getCurrentUser() {
    return this.state.user;
  }

  getToken(): string | null {
    return this.gestaoSessao.getToken();
  }
  
  // MÉTODOS restam inalterados mas podem precisar de revisão futura
  async getPublicProfileByUsername(username: string): Promise<PerfilUsuario | null> {
    return this.gestaoConta.getPublicProfileByUsername(username);
  }

  async verifyCode(email: string, code: string, isReset: boolean = false): Promise<void> {
    return this.gestaoConta.verifyCode(email, code, isReset);
  }

  async sendVerificationCode(email: string, context: 'verification' | 'reset' = 'verification'): Promise<void> {
    return this.gestaoConta.sendVerificationCode(email, context);
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    return this.gestaoConta.resetPassword(email, newPassword);
  }
}

export const servicoAutenticacao = new SistemaAutenticacaoSupremo();
