
import { useState } from 'react';
import { getInstanciaSuprema } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { createHookLogger } from '../ServiçosFrontend/SistemaObservabilidade/Log.Hook';

const log = createHookLogger('useLoginGoogle');

/**
 * Hook para gerenciar o processo de login com Google.
 * Encapsula a lógica de autenticação, feedback de UI (loading/error) e redirecionamento.
 */
export const useLoginGoogle = () => {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const SistemaAutenticacao = getInstanciaSuprema();

    /**
     * Inicia o fluxo de login com Google, redirecionando o usuário para a página de autenticação do Google.
     */
    const iniciarLoginComGoogle = () => {
        setCarregando(true);
        setErro(null);
        log.logStart('iniciarLoginComGoogle');

        try {
            // Chama o método que redireciona para o Google
            SistemaAutenticacao.iniciarLoginComGoogle();
            // Como a página será redirecionada, o carregando não precisa ser finalizado aqui.
            log.logSuccess('iniciarLoginComGoogle', { message: 'Redirecionamento para o Google iniciado.' });
        } catch (err: any) {
            log.logError('iniciarLoginComGoogle', err, { message: err.message });
            setErro(err.message || 'Ocorreu um erro ao tentar redirecionar para o login do Google.');
            setCarregando(false);
        }
    };

    return { iniciarLoginComGoogle, carregando, erro };
};
