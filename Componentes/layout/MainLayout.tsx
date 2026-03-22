
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { MainHeader } from "../ComponenteDeInterfaceDeUsuario/layout/MainHeader";
import { Footer } from "../ComponenteDeInterfaceDeUsuario/layout/Footer";
// CORREÇÃO: O caminho para o Loading estava incorreto e o nome do componente também.
import { LoadingScreen } from "../ComponenteDeInterfaceDeUsuario/Modal.Tela.Carregamento";

export const MainLayout = () => {
  return (
    <div className="main-layout">
      <MainHeader />
      <main className="main-content">
        {/* CORREÇÃO: Usando o nome correto do componente no fallback. */}
        <Suspense fallback={<ModalTelaCarregamento />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};
