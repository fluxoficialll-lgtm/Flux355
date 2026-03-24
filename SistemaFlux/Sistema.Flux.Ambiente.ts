

/**
 * Configura e valida o ambiente da aplicação (Nível 2).
 */
export function configurarAmbiente() {
  const isProduction = import.meta.env.MODE === 'production';

  if (!isProduction) {
    console.log("Modo de Desenvolvimento ATIVADO. A simulação foi desativada.");
  } else {
    console.log("Modo de Produção ATIVADO.");
  }

  console.log("Ambiente (Nível 2) configurado.");
}
