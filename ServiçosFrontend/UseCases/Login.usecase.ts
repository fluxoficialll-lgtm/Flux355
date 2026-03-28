
import { servicoAutenticacao, LoginEmailParams } from '../ServiçoDeAutenticação/Auth.Application';

/**
 * UseCase para realizar o login do usuário.
 * Encapsula a regra de negócio específica para a autenticação.
 */
export class LoginUseCase {
  /**
   * @param {servicoAutenticacao} authService - O serviço de autenticação.
   */
  constructor(private authService: typeof servicoAutenticacao) {}

  /**
   * Executa o caso de uso de login.
   * @param {LoginEmailParams} params - Os parâmetros de email e senha.
   * @returns {Promise<any>} A resposta da operação de login.
   */
  async execute(params: LoginEmailParams): Promise<any> {
    console.log(`[UseCase] Executando LoginUseCase para o email: ${params.email}`);
    
    // Chama o serviço e aguarda a resposta
    const response = await this.authService.login(params);

    // Retorna a resposta para a Application Layer
    return response;
  }
}
