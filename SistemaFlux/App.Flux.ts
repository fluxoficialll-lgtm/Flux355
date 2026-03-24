
import { inicializarBoot } from './Sistema.Flux.Boot';
import { configurarAmbiente } from './Sistema.Flux.Ambiente';
import { montarNucleoReact } from './Sistema.Nucleo.Inicializador';

/**
 * App.Flux (Camada 1 - Orquestração)
 */
class AppFlux {
    public static iniciar(): void {

        try {
            // Camada 2: Inicialização de baixo nível
            inicializarBoot();

            // Camada 2.5: Configuração de ambiente
            configurarAmbiente();

            // Camada 3: Montagem do React
            montarNucleoReact();

        } catch (erro) {
            console.error("Erro Crítico durante a orquestração", erro);
        }
    }
}

export default AppFlux;
