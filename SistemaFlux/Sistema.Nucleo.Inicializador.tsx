
import React from 'react';
import { createRoot } from 'react-dom/client';
import SistemaNucleoApp from './Sistema.Nucleo.App';
import { loadEnvironment } from '../ServiçosFrontend/ValidaçãoDeAmbiente/config.ts';
import AppFlux from './App.Flux';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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

  if (!GOOGLE_CLIENT_ID) {
    console.error("VITE_GOOGLE_CLIENT_ID não está definido. O login com Google não funcionará.");
  }

  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID!}>
        <SistemaNucleoApp />
      </GoogleOAuthProvider>
    </React.StrictMode>
  );

  // SistemaLog.info("NUCLEO", "Núcleo React (Nível 3) montado com sucesso.");
}
