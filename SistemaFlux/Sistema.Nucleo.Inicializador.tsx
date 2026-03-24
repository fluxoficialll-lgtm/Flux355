
import React from 'react';
import { createRoot } from 'react-dom/client';
import SistemaNucleoApp from './Sistema.Nucleo.App';
import { loadEnvironment } from '../ServiçosFrontend/ValidaçãoDeAmbiente/config.ts';
import AppFlux from './App.Flux';

/**
 * Ponto de Entrada da Aplicação (Entrypoint).
 */
document.addEventListener('DOMContentLoaded', () => {
  // SistemaLog.info("ENTRYPOINT", "DOM carregado. Iniciando o App.Flux...");
  AppFlux.iniciar();
});

/**
 * Monta a árvore de componentes React no elemento DOM #root. (Nível 3)
 */
export function montarNucleoReact() {
  // SistemaLog.info("NUCLEO", "Montando o Núcleo React (Nível 3)");
  
  loadEnvironment();

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    // SistemaLog.erro("NUCLEO", "Elemento 'root' não foi encontrado. O Núcleo React não pode ser montado.");
    throw new Error("Elemento 'root' não foi encontrado.");
  }

  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
        <SistemaNucleoApp />
    </React.StrictMode>
  );

  // SistemaLog.info("NUCLEO", "Núcleo React (Nível 3) montado com sucesso.");
}
