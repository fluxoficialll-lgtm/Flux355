
const DepuracaoLogger = {
  prefix: '[DEPURACAO-GOOGLE-LOGIN]',

  log: (...args: any[]) => {
    console.log(DepuracaoLogger.prefix, ...args);
  },

  warn: (...args: any[]) => {
    console.warn(DepuracaoLogger.prefix, ...args);
  },

  error: (...args: any[]) => {
    console.error(DepuracaoLogger.prefix, ...args);
  },
};

export default DepuracaoLogger;
