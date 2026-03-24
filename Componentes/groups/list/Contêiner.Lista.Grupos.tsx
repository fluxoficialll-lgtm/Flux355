
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Group } from '../../../types';
import { CardMenuConteinerListaGrupo } from './Card.Menu.Conteiner.Lista.Grupo';
import { useConfiguracaoGrupo } from '../../../hooks/Hook.Configuracao.Grupo';
import { useAutenticacao } from '../../../hooks/Hook.Autenticacao'; // Importa o hook de autenticação

interface GroupListItemProps {
    group: Group & { navigateTo?: string; isSalesPlatformEnabled?: boolean };
    unreadCount: number;
    isMenuActive: boolean;
    onToggleMenu: (e: React.MouseEvent) => void;
    onItemClick: () => void;
    onTracking: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}

export const ContêinerListaGrupos: React.FC<GroupListItemProps> = ({
    group,
    unreadCount,
    isMenuActive,
    onToggleMenu,
    onTracking,
    onDelete
}) => {
    const navigate = useNavigate();
    const { resolverAcaoDoClique } = useConfiguracaoGrupo();
    const { usuario: currentUser } = useAutenticacao(); // Obtém o usuário da sessão

    // Lógica corrigida: Compara o ID do dono com o ID do usuário da sessão
    const isCreator = currentUser ? group.donoId === currentUser.id : false;

    const displayMsg = group.isSalesPlatformEnabled 
        ? 'Acesse o catálogo do grupo' 
        : (group.descricao || 'Toque para abrir a comunidade');
    const displayTime = 'Novo';

    const handleItemClick = () => {
        if (group.navigateTo) {
            navigate(group.navigateTo);
            return;
        }
        
        resolverAcaoDoClique({
            id: group.id,
            modoHubAtivo: !!group.isSalesPlatformEnabled
        });
    };

    return (
        <div className="group-preview flex items-center p-3 border-b border-white/5 cursor-pointer transition-all relative" onClick={handleItemClick}>
            <div className="group-avatar w-[50px] h-[50px] rounded-full mr-4 border-2 border-[#00c2ff] bg-[#00c2ff33] flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                {group.imagemCapa ? (
                    <img src={group.imagemCapa} alt={group.nome} className="w-full h-full object-cover" />
                ) : (
                    <i className={`fa-solid ${group.tipo === 'pago' ? 'fa-crown' : 'fa-users'}`}></i>
                )}
            </div>
            
            <div className="group-info flex flex-col flex-grow min-w-0 mr-2.5">
                <div className="groupname font-bold text-base mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis text-white">
                    {group.nome}
                </div>
                <div className={`last-message text-sm whitespace-nowrap overflow-hidden text-ellipsis ${unreadCount > 0 ? 'text-white font-semibold' : 'text-gray-400'}`}>
                    {displayMsg}
                </div>
            </div>

            <div className="flex flex-col items-end flex-shrink-0">
                <div className={`text-[10px] uppercase font-bold ${unreadCount > 0 ? 'text-[#00c2ff]' : 'text-gray-500'}`}>
                    {displayTime}
                </div>
                {unreadCount > 0 && (
                    <div className="group-unread-badge bg-[#ff4d4d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center mt-1">
                        {unreadCount}
                    </div>
                )}
            </div>

            {isCreator && (
                <>
                    <button className="group-menu-btn absolute right-1 top-1 text-gray-500 p-2 cursor-pointer z-[5]" onClick={onToggleMenu}>
                        <i className="fa-solid fa-ellipsis"></i>
                    </button>
                    <CardMenuConteinerListaGrupo 
                        group={group} 
                        isActive={isMenuActive} 
                        onTracking={onTracking}
                        onDelete={onDelete}
                    />
                </>
            )}
        </div>
    );
};
