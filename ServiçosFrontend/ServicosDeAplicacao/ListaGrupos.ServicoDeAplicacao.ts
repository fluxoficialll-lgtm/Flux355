
import { Group } from '../../tipos/types.Grupo';
import { servicoGestaoListaGrupo } from '../ServiçoDeGrupos/Servico.Gestao.Lista.Grupo';
import { createApplicationServiceLogger } from '../SistemaObservabilidade/Log.Aplication';

const logger = createApplicationServiceLogger('ListaGruposApplicationService');

interface ListaGruposState {
  grupos: Group[];
  loading: boolean;
  error: string | null;
}

class ListaGruposApplicationService {
  private state: ListaGruposState = {
    grupos: [],
    loading: true,
    error: null,
  };

  private listeners: ((state: ListaGruposState) => void)[] = [];

  public async carregarGrupos() {
    if (this.state.loading && this.state.grupos.length > 0) return;

    logger.logOperationStart('carregarGrupos');
    this.updateState({ loading: true, error: null });

    try {
      const grupos = await servicoGestaoListaGrupo.obterGrupos();
      this.updateState({ grupos, loading: false });
      logger.logOperationSuccess('carregarGrupos', { groupCount: grupos.length });
    } catch (err: any) {
      logger.logOperationError('carregarGrupos', err);
      this.updateState({ error: err.message, loading: false, grupos: [] });
    }
  }

  public async deletarGrupo(groupId: string) {
    logger.logOperationStart('deletarGrupo', { groupId });
    try {
      await servicoGestaoListaGrupo.excluirGrupo(groupId);
      const novosGrupos = this.state.grupos.filter(g => g.id !== groupId);
      this.updateState({ grupos: novosGrupos });
      logger.logOperationSuccess('deletarGrupo', { groupId });
    } catch (error: any) {
      logger.logOperationError('deletarGrupo', error, { groupId });
      this.updateState({ error: (error as Error).message });
    }
  }

  public getState(): ListaGruposState {
    return this.state;
  }

  public subscribe(listener: (state: ListaGruposState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private updateState(newState: Partial<ListaGruposState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const listaGruposApplicationService = new ListaGruposApplicationService();
