import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInstanciaSuprema } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { useSessao } from './useSessao';
import { createHookLogger } from '../ServiçosFrontend/SistemaObservabilidade/Log.Hook';

const log = createHookLogger('useLoginGoogle');

/**
 * Hook para gerenciar o processo de login com Google.
 * Encapsula a lógica de autenticação, feedback de UI (loading/error) e redirecionamento,
 * tratando corretamente os casos de usuários novos ou com perfil incompleto.
 */
export const useLoginGoogle = () => {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const { login } = useSessao();
    const navigate = useNavigate();
    const SistemaAutenticacao = getInstanciaSuprema();

    /**
     * Inicia o fluxo de login com Google.
     * Em caso de sucesso, atualiza a sessão e redireciona o usuário para a tela apropriada
     * com base no status do seu perfil.
     */
    const loginComGoogle = async () => {
        setCarregando(true);
        setErro(null);
        log.logStart('loginComGoogle');

        try {
            // @ts-ignore: Acessando método que pode não estar na interface, mas existe na implementação.
            const { token, usuario } = await SistemaAutenticacao.loginComGoogle();
            
            log.logSuccess('loginComGoogle', { userId: usuario.id });

            login(usuario, token);

            if (usuario && usuario.perfilCompleto) {
                log.logStart('redirecionamento', { to: '/feed', userId: usuario.id });
                navigate('/feed');
            } else {
                log.logStart('redirecionamento', { to: '/completar-perfil', userId: usuario.id });
                navigate('/completar-perfil');
            }

        } catch (err: any) {
            log.logError('loginComGoogle', err, { message: err.message });
            setErro(err.message || 'Ocorreu um erro desconhecido durante o login.');
        } finally {
            setCarregando(false);
        }
    };

    return { loginComGoogle, carregando, erro };
};
