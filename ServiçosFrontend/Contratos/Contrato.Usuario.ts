
import { z } from 'zod';
import { createContractLogger } from '../SistemaObservabilidade/Log.Contratos';

const logger = createContractLogger('Usuario');

// 1. O Schema Zod: A fonte única da verdade para a estrutura de um usuário.
// Baseado no método `paraRespostaHttp` do model do backend.
export const UsuarioSchema = z.object({
    id: z.string().uuid('O ID do usuário deve ser um UUID válido.'),
    nome: z.string('O nome do usuário é obrigatório.'),
    email: z.string().email('O email do usuário deve ser um endereço de email válido.'),
    apelido: z.string().optional(),
    bio: z.string().optional(),
    site: z.string().url('O site deve ser uma URL válida.').optional(),
    urlFoto: z.string().url('A URL da foto deve ser uma URL válida.').optional(),
    privado: z.boolean(),
    perfilCompleto: z.boolean(),
    contagemSeguidores: z.number().int().min(0),
    contagemSeguindo: z.number().int().min(0),
    seguidores: z.array(z.string().uuid()),
    seguindo: z.array(z.string().uuid()),
    dataCriacao: z.string().datetime('A data de criação deve ser uma data válida.'),
    dataAtualizacao: z.string().datetime('A data de atualização deve ser uma data válida.'),
});

// 2. O Tipo TypeScript: Inferido diretamente do schema. Nunca ficará dessincronizado.
export type IUsuario = z.infer<typeof UsuarioSchema>;

// 3. A Função de Validação: O "guarda" que garante a conformidade dos dados em tempo de execução.
export const validateUsuario = (data: unknown): IUsuario => {
    try {
        const validatedData = UsuarioSchema.parse(data);
        logger.logValidationSuccess('validateUsuario', validatedData);
        return validatedData;
    } catch (error) {
        logger.logValidationError('validateUsuario', error, data);
        throw new Error("Os dados do usuário recebidos do backend não correspondem à estrutura esperada.");
    }
};

export const validateListaUsuarios = (data: unknown): IUsuario[] => {
    try {
        const validatedData = z.array(UsuarioSchema).parse(data);
        logger.logValidationSuccess('validateListaUsuarios', validatedData);
        return validatedData;
    } catch (error) {
        logger.logValidationError('validateListaUsuarios', error, data);
        throw new Error("A lista de usuários recebida do backend não corresponde à estrutura esperada.");
    }
};
