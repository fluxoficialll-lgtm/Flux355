
import { IUsuario } from './Processo.Login';
import { AuthStorage } from './Auth.Storage'; 
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';

export interface IUsuario {
  id: string;
  nome: string;
  email: string;
}

export interface IEstadoAutenticacao {
  autenticado: boolean;
  usuario: IUsuario | null;
  token: string | null;
}

const logger = createServiceLogger('ProcessoLoginGerenciadorEstado');

class ProcessoLoginGerenciadorEstado {
  private estado: IEstadoAutenticacao;

  constructor() {
    const sessaoSalva = AuthStorage.carregarSessao();

    if (sessaoSalva) {
      this.estado = {
        autenticado: true,
        usuario: sessaoSalva.usuario,
        token: sessaoSalva.token,
      };
      logger.logInfo("Estado inicializado com sessão salva.", this.estado);
    } else {
      this.estado = {
        autenticado: false,
        usuario: null,
        token: null,
      };
      logger.logInfo("Nenhuma sessão salva encontrada. Iniciando deslogado.");
    }
  }

  public obterEstadoAtual(): IEstadoAutenticacao {
    return this.estado;
  }

  public definirEstadoAutenticado(usuario: IUsuario, token: string): void {
    logger.logInfo(`Definindo estado para o usuário ${usuario.email}.`);
    this.estado = {
      autenticado: true,
      usuario: usuario,
      token: token,
    };
    AuthStorage.salvarSessao(token, usuario);
  }

  public limparEstado(): void {
    logger.logInfo("Limpando estado de autenticação.");
    this.estado = {
      autenticado: false,
      usuario: null,
      token: null,
    };
    AuthStorage.limparSessao();
  }

  public async inicializar(): Promise<void> {}
  public iniciarLoginComGoogle(): void {}
  public async finalizarLoginComGoogle(codigo: string): Promise<void> {}
}

export const processoLogin = new ProcessoLoginGerenciadorEstado();
