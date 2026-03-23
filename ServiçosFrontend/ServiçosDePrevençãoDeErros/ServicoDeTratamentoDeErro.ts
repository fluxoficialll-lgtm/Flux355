import { LogSupremo } from '../SistemaObservabilidade/Log.Supremo1.ts';
import { ERROR_LEVEL } from './TiposDeErro.ts';

// Adicionamos um parâmetro opcional de navegação
export const handleError = (error: Error, context: any = {}, navigate?: (path: string) => void) => {
  const level = classifyError(error);

  // A telemetria continua registrando o erro
  LogSupremo.Rastreamento.trackCriticalError(error, context);

  // O log de console também é mantido
  console.error('[ERROR_HANDLER]', {
    level,
    message: error.message,
    context
  });

  // Se o erro for crítico e uma função de navegação for fornecida, redirecionamos.
  if (level === ERROR_LEVEL.CRITICAL && navigate) {
    // Redireciona para a página de manutenção, que serve como uma página de erro genérica.
    navigate('/maintenance');
  }
};

const classifyError = (error: Error) => {
  // A lógica existente classifica todos os erros como críticos.
  // Manteremos isso por enquanto.
  return ERROR_LEVEL.CRITICAL;
};
