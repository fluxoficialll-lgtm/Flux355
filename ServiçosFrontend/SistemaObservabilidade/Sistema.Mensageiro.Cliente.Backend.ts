
import VariaveisFrontend from '../Config/Variaveis.Frontend';
import { rastreadorDeEventos } from './Rastreador.Eventos.js';

// --- ESTRUTURA E TIPOS ---

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

const NIVEIS_DE_LOG: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
};

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  env: string;
  module: string;
  traceId?: string;
  message: string;
  data?: any;
}

// --- LÓGICA DE MASCARAMENTO ---

const chavesSensiveis = ['token', 'password', 'senha', 'authorization', 'secret', 'apiKey', 'clientSecret'];

const mascararDados = (data: any): any => {
  if (typeof data !== 'object' || data === null) return data;
  if (Array.isArray(data)) return data.map(mascararDados);

  return Object.keys(data).reduce((acc, key) => {
    if (chavesSensiveis.some(chaveSensivel => new RegExp(chaveSensivel, 'i').test(key))) {
      acc[key] = '[MASCARADO]';
    } else {
      acc[key] = mascararDados(data[key]);
    }
    return acc;
  }, {} as Record<string, any>);
};

// --- NÚCLEO DO SERVIÇO DE LOG ---

const performLog = (level: LogLevel, module: string, message: any, data: any = null, traceId?: string) => {
  const levelNumber = NIVEIS_DE_LOG[level];
  if (levelNumber < (NIVEIS_DE_LOG.DEBUG)) return; // Ajustar conforme o ambiente

  const messageAsString = typeof message === 'object' && message !== null ? JSON.stringify(message, null, 2) : String(message);

  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    env: VariaveisFrontend.mode || 'development',
    module,
    traceId,
    message: messageAsString,
    data: mascararDados(data),
  };

  if (level === 'ERROR' || level === 'FATAL') {
    const error = data instanceof Error ? data : new Error(messageAsString);
    rastreadorDeEventos.trackCriticalError(error, { module, traceId, extraData: data });
  }

  const logFunction = console[level.toLowerCase() as 'info'] || console.log;
  logFunction(JSON.stringify(logEntry, null, 2));
  enviarLogParaBackend(logEntry);
};

const enviarLogParaBackend = async (logEntry: LogEntry) => {
  try {
    await fetch('/api/log/frontend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry),
    });
  } catch (error) {
    console.error('Falha ao enviar log para o backend:', error);
  }
};

// --- FÁBRICA DE LOGGER (A Nova Abordagem) ---

/**
 * Cria uma instância de logger para um módulo específico.
 * @param module O nome do módulo (e.g., 'Hook.Login.Google').
 * @returns Um objeto com métodos de log (`info`, `warn`, `error`, `debug`).
 */
export const createLogger = (module: string) => ({
  log: (message: string, data?: any) => performLog('INFO', module, message, data), // Alias para info
  info: (message: string, data?: any) => performLog('INFO', module, message, data),
  warn: (message: string, data?: any) => performLog('WARN', module, message, data),
  error: (message: string, error?: any) => performLog('ERROR', module, message, error),
  debug: (message: string, data?: any) => performLog('DEBUG', module, message, data),
});

// --- INTERFACE PÚBLICA LEGADA (Para Compatibilidade) ---

const LogProvider = {
  info: (module: string, message: string, data: any = null, traceId?: string) => performLog('INFO', module, message, data, traceId),
  warn: (module: string, message: string, data: any = null, traceId?: string) => performLog('WARN', module, message, data, traceId),
  error: (module: string, message: string, error: any = null, traceId?: string) => performLog('ERROR', module, message, error, traceId),
  fatal: (module: string, message: string, error: any = null, traceId?: string) => performLog('FATAL', module, message, error, traceId),
  debug: (module: string, message: string, data: any = null, traceId?: string) => performLog('DEBUG', module, message, data, traceId),
};

export default LogProvider;
