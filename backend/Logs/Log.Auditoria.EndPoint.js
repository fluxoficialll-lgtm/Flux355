// backend/Logs/BK.Auditoria.Endpoints.js

/**
 * @type {Array<{method: string, path: string, regexPath: RegExp}>}
 */
const rotasRegistradas = [];

/**
 * Popula o registro de rotas. As rotas em formato Express (ex: '/users/:id') são convertidas para RegExp.
 * @param {Array<{method: string, path: string}>} rotas - Array de objetos de rota.
 */
export function registrarRotas(rotas = []) {
  rotas.forEach(rota => {
    if (!rota.path || !rota.method) return;
    const regexPath = new RegExp(`^${rota.path.replace(/\/:[^\s/]+/g, '([^/]+)')}$`);
    rotasRegistradas.push({ ...rota, regexPath });
  });
  // Este console.log é para o boot do servidor, não é do Log Supremo.
  console.log(`[Auditoria de Endpoints] Rotas registradas: ${rotasRegistradas.length}`);
}

/**
 * Verifica se uma requisição corresponde a uma rota registrada.
 * @param {import('express').Request} req - O objeto da requisição.
 * @returns {boolean} - True se a rota for encontrada, false caso contrário.
 */
export function isRotaEncontrada(req) {
  if (req.method === 'OPTIONS') {
    return true; // Ignora chamadas de pre-flight CORS
  }

  const urlSemQuery = req.originalUrl.split('?')[0];
  
  return rotasRegistradas.some(
    r => r.method === req.method && r.regexPath.test(urlSemQuery)
  );
}
