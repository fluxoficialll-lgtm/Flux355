import provedor from './Provedor.Log.js';

const createLogger = (escopo) => {

  const formatarMensagem = (nivel, codigo, detalhes = {}) => {
    const mensagem = {
      nivel,
      escopo,
      codigo,
      ...detalhes,
    };
    return mensagem;
  };

  return {
    info: (codigo, detalhes) => provedor.info(formatarMensagem('info', codigo, detalhes)),
    warn: (codigo, detalhes) => provedor.warn(formatarMensagem('warn', codigo, detalhes)),
    error: (codigo, detalhes) => provedor.error(formatarMensagem('error', codigo, detalhes)),
    debug: (codigo, detalhes) => provedor.debug(formatarMensagem('debug', codigo, detalhes)),
  };
};

export default { createLogger };
