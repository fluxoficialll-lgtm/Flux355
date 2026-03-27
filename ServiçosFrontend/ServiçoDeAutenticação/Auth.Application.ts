
import { processoLogin, IEstadoAutenticacao, IUsuario } from './Processo.Login';
import { IPerfilParaCompletar, IResultadoCompletarPerfil } from './Processo.Completar.Perfil';
import { IRegistroParams, IResultadoRegistro } from './Processo.Registrar';
import { AutenticacaoAPI } from '../APIs/Autenticacao.API';
// Importando a lógica específica do Google Login
import { loginGoogle } from './Login.Google';

type Listener = (estado: IEstadoAutenticacao) => void;

class ServicoAutenticacao {
  private listeners: Listener[] = [];

  private notificarListeners() {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  // ... login, logout, registrar, completarPerfil (sem alterações) ...
  public async login(params: { email: string, senha: string }): Promise<void> {
    try {
      const respostaAPI = await AutenticacaoAPI.loginComEmail(params);
      const usuario: IUsuario = {
        id: respostaAPI.usuario.id,
        nome: respostaAPI.usuario.apelido, 
        email: respostaAPI.usuario.email
      };
      processoLogin.definirEstadoAutenticado(usuario, respostaAPI.token);
    } catch (error) {
      console.error("APPLICATION: Falha no login.", error);
      processoLogin.limparEstado();
    }
    this.notificarListeners();
  }

  public async logout() {
    processoLogin.limparEstado();
    this.notificarListeners();
  }

  public async registrar(dadosRegistro: IRegistroParams): Promise<IResultadoRegistro> {
    if (dadosRegistro.senha !== dadosRegistro.confirmacaoSenha) {
      return { sucesso: false, mensagem: "As senhas não conferem." };
    }
    try {
      const respostaAPI = await AutenticacaoAPI.registrar(dadosRegistro);
      await this.login({ email: dadosRegistro.email, senha: dadosRegistro.senha });
      return { sucesso: true, mensagem: "Registro bem-sucedido!", usuario: respostaAPI.usuario };
    } catch (error: any) {
      return { sucesso: false, mensagem: error.message || "Ocorreu um erro no registro." };
    }
  }

  public async completarPerfil(dadosPerfil: IPerfilParaCompletar): Promise<IResultadoCompletarPerfil> {
    const estadoAtual = this.getState();
    if (!estadoAtual.autenticado || !estadoAtual.usuario) {
      return { sucesso: false, mensagem: "Usuário não autenticado." };
    }
    try {
      const usuarioId = estadoAtual.usuario.id;
      const usuarioAtualizado = await AutenticacaoAPI.completarPerfil(usuarioId, dadosPerfil);
      const novoEstadoUsuario: IUsuario = { ...estadoAtual.usuario, nome: usuarioAtualizado.apelido };
      processoLogin.definirEstadoAutenticado(novoEstadoUsuario, estadoAtual.token || '');
      this.notificarListeners();
      return { sucesso: true, mensagem: "Perfil atualizado com sucesso!", usuarioAtualizado };
    } catch (error: any) {
      return { sucesso: false, mensagem: error.message || "Ocorreu um erro ao atualizar o perfil." };
    }
  }

  // --- NOVOS MÉTODOS PARA LOGIN COM GOOGLE ---

  /**
   * Inicia o fluxo de login com Google.
   * Delega a ação para o módulo especializado `Login.Google.ts`.
   */
  public iniciarLoginComGoogle(): void {
    console.log("APPLICATION: Iniciando fluxo de login com Google.");
    // Este método é o que deve ser chamado pelo provider/UI.
    // Ele contém a lógica para redirecionar o usuário para a página do Google.
    loginGoogle.iniciarLogin();
  }

  /**
   * Finaliza o login com Google após o usuário ser redirecionado de volta do Google.
   * @param code O código de autorização retornado pelo Google.
   */
  public async finalizarLoginComGoogle(code: string): Promise<void> {
    console.log("APPLICATION: Finalizando fluxo de login com Google.");
    try {
      // 1. Usa o módulo do Google para obter os dados do usuário a partir do código.
      const dadosUsuarioGoogle = await loginGoogle.processarCallback(code);

      // 2. Chama a nossa API de backend para fazer o login ou registro social.
      const respostaAPI = await AutenticacaoAPI.loginComProvedorSocial({
        provedor: 'google',
        token: dadosUsuarioGoogle.tokenProvider,
        email: dadosUsuarioGoogle.email,
        nome: dadosUsuarioGoogle.nome
      });

      // 3. Atualiza o estado da aplicação com o usuário e token retornados pela NOSSA API.
      const usuario: IUsuario = {
        id: respostaAPI.usuario.id,
        nome: respostaAPI.usuario.apelido,
        email: respostaAPI.usuario.email
      };
      processoLogin.definirEstadoAutenticado(usuario, respostaAPI.token);

    } catch (error) {
      console.error("APPLICATION: Falha no fluxo de login com Google.", error);
      processoLogin.limparEstado();
    }

    // 4. Notifica a UI da mudança de estado.
    this.notificarListeners();
  }

  // ... Métodos de subscribe, getState ...
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

// Re-exporta os tipos para uso fácil na UI.
export type { IEstadoAutenticacao as AuthState };
export type { IPerfilParaCompletar, IResultadoCompletarPerfil };
export type { IRegistroParams, IResultadoRegistro };
