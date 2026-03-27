
import { PublicacaoFeed } from '../../types/Saida/Types.Estrutura.Publicacao.Feed';
import { feedPublicationService } from '../ServiçosDePublicações/Servico.Publicacao.Feed';
import { createApplicationServiceLogger } from '../SistemaObservabilidade/Log.Aplication';

const logger = createApplicationServiceLogger('FeedApplicationService');

interface FeedState {
  posts: PublicacaoFeed[];
  loading: boolean;
  error: string | null;
}

class FeedApplicationService {
  private state: FeedState = {
    posts: [],
    loading: false,
    error: null,
  };

  private listeners: ((state: FeedState) => void)[] = [];

  public async carregarPosts() {
    if (this.state.loading) return;

    logger.logOperationStart('carregarPosts');
    this.updateState({ loading: true, error: null });

    try {
      const posts = await feedPublicationService.getPosts();
      this.updateState({ posts, loading: false });
      logger.logOperationSuccess('carregarPosts', { postCount: posts.length });
    } catch (err: any) {
      this.updateState({ error: err.message, loading: false });
      logger.logOperationError('carregarPosts', err);
    }
  }

  public getState(): FeedState {
    return this.state;
  }

  public subscribe(listener: (state: FeedState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private updateState(newState: Partial<FeedState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const feedApplicationService = new FeedApplicationService();
