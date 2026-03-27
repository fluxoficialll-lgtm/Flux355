
import { montarNucleoReact } from './Sistema.Nucleo.Inicializador';

/**
 * App.Flux (Camada 1 - Orquestração)
 */
class AppFlux {
    public static iniciar(): void {

        try {
            // Camada 3: Montagem do React
            montarNucleoReact();

        } catch (erro) {
            console.error("Erro Crítico durante a orquestração", erro);
        }
    }
}

export default AppFlux;
