import { registrarRotas as registrarRotasDeAuditoria } from '../Logs/BK.Log.Supremo.js';

const extrairCaminhoCompleto = (rota) => {
  let caminho = '/';
  let no = rota;
  const segmentos = [];

  while (no.parent) {
    if (no.route && no.route.path) {
      segmentos.unshift(no.route.path.replace(/\/$/, '')); // Evita barras duplas
    } else if (no.path) {
      segmentos.unshift(no.path.replace(/\/$/, ''));
    }
    no = no.parent;
  }

  caminho = '/' + segmentos.join('/').replace(/\/\/+/g, '/');
  return caminho;
};

export const extrairTodasAsRotas = (app) => {
    const rotas = [];

    const extrair = (stack, prefixo = '') => {
        if (!stack) return;

        for (const camada of stack) {
            if (camada.route) {
                const metodos = Object.keys(camada.route.methods).filter(m => m !== '_all').map(m => m.toUpperCase());
                for (const metodo of metodos) {
                    const caminhoCompleto = (prefixo + camada.route.path).replace(/\/\/+/g, '/');
                    rotas.push({ metodo, caminho: caminhoCompleto });
                }
            } else if (camada.name === 'router' && camada.handle && camada.handle.stack) {
                // Extrai o prefixo do roteador. Removemos a parte final que é sempre '(/?|/.*)'
                const prefixoDoRoteador = camada.regexp.source.replace(/^\^\\\//, '').replace(/\\\/(?=\?|$).*/, '');
                extrair(camada.handle.stack, prefixo + '/' + prefixoDoRoteador);
            }
        }
    };

    extrair(app._router.stack);
    
    // Registra as rotas no sistema de auditoria
    // registrarRotasDeAuditoria(rotas);

    return rotas;
};