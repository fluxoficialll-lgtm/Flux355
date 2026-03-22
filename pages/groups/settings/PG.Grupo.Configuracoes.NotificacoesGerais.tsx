
import React from 'react';
import { useGroupNotificationSettings, GroupNotificationSettings } from '../../../hooks/Hook.Grupo.Config.Notificacoes';
import { ModalTelaCarregamento } from '../../../Componentes/ComponenteDeInterfaceDeUsuario/Modal.Tela.Carregamento';
import { ErrorFallback as FallbackDeErro } from '../../../Componentes/ComponentesDePrevençãoDeErros/FallbackDeErro';
import CardConfiguracaoNotificacoes from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoesDeGrupo/Card.Configuracao.Notificacoes';
import { MainHeader } from '../../../Componentes/layout/MainHeader';

const PG_Grupo_Configuracoes_NotificacoesGerais: React.FC = () => {
    const { settings, loading, error, refetchSettings, updateSettings } = useGroupNotificationSettings();

    const handleUpdate = async (updatedSettings: Partial<GroupNotificationSettings>) => {
        try {
            await updateSettings(updatedSettings);
            // Opcional: mostrar uma notificação de sucesso
        } catch (err) {
            // Opcional: mostrar uma notificação de erro
        }
    };

    if (loading) {
        return <ModalTelaCarregamento />;
    }

    if (error || !settings) {
        return <FallbackDeErro error={error || "Configurações não encontradas."} onReset={refetchSettings} />;
    }

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <MainHeader title="Notificações do Grupo" />
            <div className="p-4">
                <CardConfiguracaoNotificacoes 
                    settings={settings} 
                    onUpdate={handleUpdate} 
                />
            </div>
        </div>
    );
};

export default PG_Grupo_Configuracoes_NotificacoesGerais;
