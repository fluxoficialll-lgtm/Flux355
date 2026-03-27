
// ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo.ts

import { z } from 'zod';
import { IAutenticacaoServico, LoginRequest, LoginResponse, GoogleLoginRequest, GoogleLoginResponse } from '../Contratos/Contrato.Autenticacao';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';
import { CriacaoContaDto } from '../../types/Entrada/Dto.Estrutura.Conta.Flux';
import { PerfilUsuario } from '../Contratos/Contrato.Perfil.Usuario';

// Módulos de processo desacoplados
import { servicoGestaoLogin } from './Processo.Login';
import { processoGestaoSessao } from './Processo.Gestao.Sessao';
import { processoGestaoConta, Usuario } from './Processo.Gestao.Conta';
import { processoCriacaoUsuario } from './Processo.Criacao.Usuario';

const log = createServiceLogger('Sistema.Autenticacao.Supremo');

class SistemaAutenticacaoSupremo implements IAutenticacaoServico {
  private gestaoLogin;
  private gestaoSessao;
  private gestaoConta;
  private criacaoUsuario;

  constructor() { 
    this.gestaoSessao = processoGestaoSessao;
    this.gestaoLogin = servicoGestaoLogin;
    this.gestaoConta = processoGestaoConta;
    this.criacaoUsuario = processoCriacaoUsuario;

    log.logInfo('Sistema de Autenticação Supremo inicializado.');
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const { token, user } = await this.gestaoLogin.login(data);
    // @ts-ignore
    this.gestaoSessao.iniciarSessao(token, user);
    // @ts-ignore
    return { user };
  }

  iniciarLoginComGoogle(): void {
    this.gestaoLogin.redirectToGoogle();
  }

  async resolverSessaoLogin(data: GoogleLoginRequest): Promise<GoogleLoginResponse> {
    const { token, user, isNewUser } = await this.gestaoLogin.handleGoogleCallback(data.code, data.referredBy);
    // @ts-ignore
    this.gestaoSessao.iniciarSessao(token, user);
    // @ts-ignore
    return { user, isNewUser };
  }

  async resolverRedirecionamentoLogin(sessionId: string) {
      // @ts-ignore // TODO: Revisar implementação após refatoração
      return this.gestaoSessao.resolverRedirecionamentoLogin(sessionId);
  }
  
  async logout() {
    this.gestaoSessao.encerrarSessao();
  }

  async criarConta(dados: CriacaoContaDto): Promise<void> {
    // @ts-ignore // TODO: Revisar DTO após refatoração
    const { user, token } = await this.criacaoUsuario.criarConta(dados);
    // @ts-ignore
    this.gestaoSessao.iniciarSessao(token, user);
  }

  async getPublicProfileByUsername(username: string): Promise<PerfilUsuario | null> {
    // @ts-ignore
    return this.gestaoConta.getPublicProfileByUsername(username);
  }

  async verifyCode(email: string, code: string, isReset: boolean = false): Promise<void> {
    // @ts-ignore // TODO: Implementar usando novos processos
    return this.gestaoConta.verifyCode(email, code, isReset);
  }

  async sendVerificationCode(email: string, context: 'verification' | 'reset' = 'verification'): Promise<void> {
    // @ts-ignore // TODO: Mapear para solicitarRedefinicaoSenha ou similar
    return this.gestaoConta.sendVerificationCode(email, context);
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    // @ts-ignore // TODO: Implementar usando novos processos
    return this.gestaoConta.resetPassword(email, newPassword);
  }

  async completeProfile(data: any): Promise<void> {
    // @ts-ignore
    const user = await this.gestaoConta.completeProfile(data, this.getCurrentUser());
    // @ts-ignore
    this.gestaoSessao.atualizarUsuarioSessao(user);
  }

  async updateProfile(data: any): Promise<void> {
    // @ts-ignore
    const user = await this.gestaoConta.completeProfile(data, this.getCurrentUser());
    // @ts-ignore
    this.gestaoSessao.atualizarUsuarioSessao(user);
  }

  async excluirConta(): Promise<void> {
    await this.gestaoConta.excluirConta();
    this.gestaoSessao.encerrarSessao();
  }

  async obterSessao(): Promise<Usuario | null> {
    // Correção: Substituído `validateSession` por `getCurrentUser`, que existe no processo de gestão de sessão.
    return this.gestaoSessao.getCurrentUser();
  }

  getCurrentUser() {
    return this.gestaoSessao.getCurrentUser();
  }

  getToken(): string | null {
    // @ts-ignore
    return this.gestaoSessao.getToken();
  }
}

export const servicoAutenticacao = new SistemaAutenticacaoSupremo();
