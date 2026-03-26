import { z } from 'zod';

// 1. Schema para a estrutura do Usuário, baseado na interface existente.
export const UsuarioSchema = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.string().email(),
  bio: z.string().nullable(),
  privado: z.boolean(),
  perfilCompleto: z.boolean(),
  contagemSeguidores: z.number(),
  contagemSeguindo: z.number(),
  seguidores: z.array(z.any()),
  seguindo: z.array(z.any()),
});

// 2. Schema para validar o corpo da requisição enviada ao backend.
export const HandleAuthCallbackRequestSchema = z.object({
  token: z.string().min(1, "O token de ID do Google não pode estar vazio."),
  referredBy: z.string().optional(), // Opcional, pode não estar presente.
});

// 3. Schema para validar a resposta recebida do backend.
export const HandleAuthCallbackResponseSchema = z.object({
  token: z.string().min(1, "O token de autenticação é inválido."),
  user: UsuarioSchema.nullable(), // O usuário pode ser nulo.
  isNewUser: z.boolean().optional(), // Opcional, para compatibilidade.
});

// --- Tipos Derivados ---
export type Usuario = z.infer<typeof UsuarioSchema>;
export type HandleAuthCallbackRequest = z.infer<typeof HandleAuthCallbackRequestSchema>;
export type HandleAuthCallbackResponse = z.infer<typeof HandleAuthCallbackResponseSchema>;

// --- Interface do Serviço ---
export interface IServicoMetodoGoogle {
  /**
   * Lida com o callback do Google, enviando o token de ID para o backend.
   * @param token O token de ID fornecido pelo Google.
   * @param referredBy Opcional, o ID de quem indicou o usuário.
   * @returns Uma promessa que resolve com o token, os dados do usuário e se é um novo usuário.
   */
  handleAuthCallback(token: string, referredBy?: string): Promise<HandleAuthCallbackResponse>;
  
  /**
   * Redireciona o navegador do usuário para a página de autenticação do Google.
   */
  redirectToGoogleAuth(): void;
}
