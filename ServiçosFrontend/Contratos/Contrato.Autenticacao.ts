import { z } from 'zod';

/**
 * @file Define os contratos (schemas) para o serviço de autenticação usando Zod.
 * Estes schemas garantem validação em tempo de execução e servem como a única fonte de verdade
 * para as estruturas de dados, derivando os tipos TypeScript a partir deles.
 */

// Schema para a requisição de login
export const LoginRequestSchema = z.object({
  email: z.string({
    required_error: "O e-mail é obrigatório.",
    invalid_type_error: "O e-mail deve ser um texto.",
  }).email("O formato do e-mail é inválido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

// Schema para a requisição de login com Google
export const GoogleLoginRequestSchema = z.object({
  token: z.string(),
});

// Schema para os dados do usuário autenticado
export const UsuarioAutenticadoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.string().email(),
});

// Schema para a resposta da API de login
export const LoginResponseSchema = z.object({
  token: z.string(),
  usuario: UsuarioAutenticadoSchema,
});

// Schema para a resposta da API de login com Google
export const GoogleLoginResponseSchema = z.object({
  token: z.string(),
  usuario: UsuarioAutenticadoSchema,
  isNewUser: z.boolean(),
});


// --- Tipos Derivados ---
// Estes tipos são gerados automaticamente a partir dos schemas Zod.
// Eles devem ser usados em todo o frontend para garantir consistência.

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type GoogleLoginRequest = z.infer<typeof GoogleLoginRequestSchema>;
export type GoogleLoginResponse = z.infer<typeof GoogleLoginResponseSchema>;
export type UsuarioAutenticado = z.infer<typeof UsuarioAutenticadoSchema>;


// --- Contrato do Serviço ---
// Interface que define a assinatura do serviço de autenticação.
// Qualquer implementação, seja real ou mock, deve seguir este contrato.
export interface IAutenticacaoServico {
    login(data: LoginRequest): Promise<LoginResponse>;
    resolverSessaoLogin(data: GoogleLoginRequest): Promise<GoogleLoginResponse>;
}
