
import { servicoAutenticacao } from '../ServiçoDeAutenticação/Auth.Application';

/**
 * UseCase para realizar o logout do usuário.
 * Encapsula a regra de negócio específica para o logout.
 */
export class LogoutUseCase {
  /**
   * @param {servicoAutenticacao} authService - O serviço de autenticação.
   */
  constructor(private authService: typeof servicoAutenticacao) {}

  /**
   * Executa o caso de uso de logout.
   * @returns {Promise<any>} A resposta da operação de logout.
   */
  async execute(): Promise<any> {
    console.log('[UseCase] Executando LogoutUseCase');
    
    // Chama o serviço e aguarda a resposta
    const response = await this.authService.logout();

    // Retorna a resposta para a Application Layer
    return response;
  }
}
