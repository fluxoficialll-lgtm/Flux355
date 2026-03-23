
// backend/ServicosBackend/Servico.Auditoria.Criar.Perfil.js

/**
 * @file Serviço de Auditoria para o fluxo de criação e atualização de perfil no Backend.
 * Foco em registrar o **estado** dos dados em pontos críticos para revelar bugs de inconsistência.
 */

import Log from '../Logs/BK.Log.Supremo.js';

const logger = Log.createLogger('Auditoria.Criacao.Perfil.Backend');

const ServicoAuditoriaCriarPerfil = {

    iniciarProcesso(userId, requestingUser) {
        logger.info('PROFILE_UPDATE_START',
            {
                message: `Início do processo de atualização de perfil para o usuário ${userId}.`,
                userId,
                requestingUserId: requestingUser.id
            }
        );
    },

    estadoAntes(userAtual) {
        logger.info('PROFILE_STATE_BEFORE_UPDATE',
            {
                message: "Estado atual do usuário antes da atualização",
                userId: userAtual.id,
                perfilCompleto: userAtual.perfil_completo
            }
        );
    },

    validacaoDePermissao(userId, requestingUserId, permitido) {
        logger.info('PERMISSION_VALIDATION',
            {
                message: `Validação de permissão: ${permitido ? 'Permitido' : 'NEGADO'}.`,
                targetUserId: userId,
                requesterUserId: requestingUserId,
                permitido
            }
        );
    },

    tentativaDeGravacao(userId, profileData) {
        logger.info('DB_WRITE_ATTEMPT',
            {
                message: `Tentativa de gravação no banco de dados para o usuário ${userId}`,
                userId,
                data: profileData
            }
        );
    },

    resultadoQuery(userAtualizado) {
        logger.info('DB_QUERY_RESULT',
            {
                message: "Resultado da atualização no banco (RETURNING)",
                userId: userAtualizado.id,
                perfilCompleto: userAtualizado.perfil_completo
            }
        );
    },

    verificacaoPerfilCompleto(user) {
        logger.warn('PROFILE_COMPLETENESS_CHECK',
            {
                message: "Verificação de perfil completo antes de enviar ao frontend",
                userId: user.id,
                perfilCompleto: user.perfil_completo
            }
        );
    },

    respostaEnviada(response) {
        logger.info('RESPONSE_SENT',
            {
                message: "Resposta final enviada ao frontend",
                response
            }
        );
    },

    sucessoNaGravacao(userId, perfilAtualizado) {
        logger.info('DB_WRITE_SUCCESS',
            {
                message: `Perfil do usuário ${userId} atualizado com sucesso no banco de dados.`,
                userId,
                perfil: perfilAtualizado
            }
        );
    },

    falhaNaGravacao(userId, erro, profileData) {
        logger.error('DB_WRITE_FAILURE',
            {
                message: `Falha ao gravar perfil do usuário ${userId} no banco dedados.`,
                userId,
                errorMessage: erro.message,
                stack: erro.stack,
                dadosOriginais: profileData
            }
        );
    }
};

export default ServicoAuditoriaCriarPerfil;
