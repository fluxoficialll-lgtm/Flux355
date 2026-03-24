/**
 * @file Log.API.Autenticacao.Suprema.ts
 * @description Módulo de logging especializado para as chamadas da API de autenticação.
 * Fornece um rastreamento detalhado e contextualizado do fluxo de autenticação.
 */

import MensageiroClienteBackend from './Sistema.Mensageiro.Cliente.Backend';

const CONTEXTO = 'API.Autenticacao';

/**
 * @namespace LogAPIAutenticacaoSuprema
 * @description Agrupa funções de log para o fluxo de autenticação da API.
 */
const LogAPIAutenticacaoSuprema = {
  /**
   * Registra o início de uma tentativa de login.
   * @param {string} email O email (ou identificador) do usuário tentando logar.
   */
  inicioLogin: (email: string) => {
    MensageiroClienteBackend.info(`Tentativa de login para o usuário: ${email}`, { contexto: CONTEXTO, email });
  },

  /**
   * Registra o sucesso de uma operação de login.
   * @param {string} email O email (ou identificador) do usuário.
   * @param {any} resposta A resposta recebida do backend.
   */
  sucessoLogin: (email: string, resposta: any) => {
    MensageiroClienteBackend.info(`Login bem-sucedido para o usuário: ${email}`, { contexto: CONTEXTO, email, resposta });
  },

  /**
   * Registra a falha em uma operação de login.
   * @param {string} email O email (ou identificador) do usuário.
   * @param {any} erro O objeto de erro retornado pela API.
   */
  falhaLogin: (email: string, erro: any) => {
    MensageiroClienteBackend.error(`Falha no login para o usuário: ${email}`, { contexto: CONTEXTO, email, erro });
  },

  /**
   * Registra o início de uma tentativa de login com Google.
   * @param {string} token O token (ou parte dele) para identificação.
   */
  inicioLoginGoogle: (token: string) => {
    MensageiroClienteBackend.info(`Tentativa de login com Google. Token: ${token.substring(0, 15)}...`, { contexto: CONTEXTO, tipo: 'google' });
  },

  /**
   * Registra o sucesso do login com Google.
   * @param {any} resposta A resposta da API.
   */
  sucessoLoginGoogle: (resposta: any) => {
    MensageiroClienteBackend.info('Login com Google bem-sucedido.', { contexto: CONTEXTO, tipo: 'google', resposta });
  },

  /**
   * Registra a falha no login com Google.
   * @param {any} erro O erro retornado.
   */
  falhaLoginGoogle: (erro: any) => {
    MensageiroClienteBackend.error('Falha no login com Google.', { contexto: CONTEXTO, tipo: 'google', erro });
  },

  /**
   * Registra o início de uma tentativa de logout.
   * @param {string} usuarioId O ID do usuário que está deslogando.
   */
  inicioLogout: (usuarioId: string) => {
    MensageiroClienteBackend.info(`Iniciando processo de logout para o usuário ID: ${usuarioId}`, { contexto: CONTEXTO, usuarioId });
  },

  /**
   * Registra o sucesso de uma operação de logout.
   * @param {string} usuarioId O ID do usuário.
   */
  sucessoLogout: (usuarioId: string) => {
    MensageiroClienteBackend.info(`Logout bem-sucedido para o usuário ID: ${usuarioId}`, { contexto: CONTEXTO, usuarioId });
  },
};

export default LogAPIAutenticacaoSuprema;
