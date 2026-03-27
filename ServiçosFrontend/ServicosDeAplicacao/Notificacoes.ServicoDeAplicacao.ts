
import { Notificacao } from '../../types/Saida/Types.Estrutura.Notificacao';
import { servicoAutenticacao } from '../ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import servicoNotificacao from '../ServicoNotificacao/Servico.Notificacao';
import { createApplicationServiceLogger } from '../SistemaObservabilidade/Log.Aplication';

const logger = createApplicationServiceLogger('NotificacoesApplicationService');

interface NotificacoesState {
  notificacoes: Notificacao[];
  loading: boolean;
  error: string | null;
}

class NotificacoesApplicationService {
  private state: NotificacoesState = {
    notificacoes: [],
    loading: true,
    error: null,
  };

  private listeners: ((state: NotificacoesState) => void)[] = [];

  constructor() {
    // Ouve mudanças na autenticação para recarregar as notificações ou limpar o estado.
    servicoAutenticacao.subscribe(async (authState) => {
      if (authState.isAuthenticated) {
        await this.carregarNotificacoes();
      } else {
        this.updateState({ notificacoes: [], loading: false, error: null });
      }
    });
  }

  public async carregarNotificacoes() {
    logger.logOperationStart('carregarNotificacoes');
    const token = servicoAutenticacao.getCurrentUser()?.token;
    if (!token) {
        const error = new Error("Usuário não autenticado.");
        logger.logOperationError('carregarNotificacoes', error, { reason: 'token_ausente' })
        this.updateState({ loading: false, error: error.message });
        return
    }

    this.updateState({ loading: true, error: null });

    try {
      const notificacoes = await servicoNotificacao.getNotifications(token);
      this.updateState({ notificacoes, loading: false });
      logger.logOperationSuccess('carregarNotificacoes', { notificationCount: notificacoes.length });
    } catch (err: any) {
      logger.logOperationError('carregarNotificacoes', err);
      this.updateState({ error: err.message, loading: false, notificacoes: [] });
    }
  }

  public getState(): NotificacoesState {
    return this.state;
  }

  public subscribe(listener: (state: NotificacoesState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state); // Envia o estado atual imediatamente
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private updateState(newState: Partial<NotificacoesState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const notificacoesApplicationService = new NotificacoesApplicationService();
