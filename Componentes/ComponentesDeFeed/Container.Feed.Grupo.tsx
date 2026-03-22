
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../tipos';
import { AvatarPreviewModal } from '../ComponenteDeInterfaceDeUsuario/Modal.Previa.Avatar';
import { UserBadge } from '../ComponenteDeInterfaceDeUsuario/user/UserBadge';
import { HookPerfilTerceiro } from '../../hooks/Hook.Perfil.Terceiro';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ContainerFeedGrupoProps {
    post: Post;
    currentUserId?: string;
    onLike: (postId: string) => void;
    onDelete: (postId: string, e: React.MouseEvent) => void;
    onUserClick: (username: string) => void;
    onCommentClick: (postId: string) => void;
    onShare: (post: Post) => void;
}

export const ContainerFeedGrupo: React.FC<ContainerFeedGrupoProps> = React.memo(({ 
    post, currentUserId, onLike, onDelete, onUserClick, onCommentClick, onShare 
}) => {
    const navigate = useNavigate();
    
    const [showMenu, setShowMenu] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const { profile: userData, isLoading } = HookPerfilTerceiro(post.author?.id);

    const isOwner = post.author?.id === currentUserId;
    const userHasLiked = post.likedBy?.includes(currentUserId || '') || false;

    // CORRIGIDO: Pré-calcula os valores de flags para segurança
    const isVetoed = userData?.flags?.isVetoed ?? false;
    const isVip = userData?.flags?.isVip ?? false;

    const handleAvatarClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (userData?.photo_url) {
            setIsPreviewOpen(true);
        }
    };

    const timeAgo = post.createdAt 
        ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })
        : 'agora mesmo';
        
    const displayName = userData?.nickname || userData?.name || post.author?.username;

    const handleJoinClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (post.group) {
          navigate(`/group/${post.group.id}`);
        }
    };
    
    if (!post || !post.author || !post.group) {
        return null;
    }

    return (
        <div className="feed-item bg-[#1a1e26] rounded-xl shadow-lg mb-4 overflow-hidden" id={`post-${post.id}`}>
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-3 relative px-4 pt-4">
                <div className="flex items-center gap-3">
                    <UserBadge 
                        avatarUrl={userData?.photo_url || post.author.avatar}
                        nickname={displayName}
                        handle={post.author.username}
                        isVetoed={isVetoed} // CORRIGIDO
                        isVip={isVip}       // CORRIGIDO
                        isLoading={isLoading}
                        avatarSize="md"
                        showHandle={false}
                        onAvatarClick={handleAvatarClick}
                        onNameClick={() => onUserClick(post.author.username)}
                    />
                    <div className="flex flex-col ml-[-8px]">
                        <span className="text-[11px] text-[#aaa] font-medium">{timeAgo}</span>
                    </div>
                </div>
                <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="text-gray-400 p-2 hover:text-white transition-colors">
                        <i className="fa-solid fa-ellipsis"></i>
                    </button>
                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}></div>
                            <div className="absolute right-0 top-8 bg-[#282c34] border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden w-40" onClick={e => e.stopPropagation()}>
                                {isOwner && (
                                    <button 
                                        onClick={(e) => { onDelete(post.id, e); setShowMenu(false); }}
                                        className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/5 text-sm font-semibold flex items-center gap-2"
                                    >
                                        <i className="fa-solid fa-trash-can"></i> Excluir
                                    </button>
                                )}
                                <button onClick={() => { /* Denunciar */ setShowMenu(false); }} className="w-full text-left px-4 py-3 text-gray-300 hover:bg-white/5 text-sm font-semibold flex items-center gap-2">
                                    <i className="fa-solid fa-flag"></i> Denunciar
                                </button>
                            </div>
                        </>
                    )}
                </div>
                <AvatarPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} imageSrc={userData?.photo_url || post.author.avatar || ''} username={displayName} />
            </div>

            {/* Conteúdo do Grupo */}
            <div className="post-content px-4" onClick={() => onCommentClick(post.id)}>
                {post.text && <p className="text-white text-sm mb-3 cursor-pointer">{post.text}</p>}
                
                <div className="bg-[#2a2f38] rounded-lg mt-3 p-3 flex items-center gap-4 cursor-pointer hover:bg-[#3a3f48] transition-colors" onClick={handleJoinClick}>
                    <img 
                        src={post.group.bannerUrl} 
                        alt={`Thumbnail do grupo ${post.group.name}`} 
                        className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                    />
                    <div className="flex-grow overflow-hidden">
                        <h4 className="font-bold text-white text-md truncate">{post.group.name}</h4>
                        <p className="text-gray-400 text-sm">{post.group.memberCount.toLocaleString('pt-BR')} membros</p>
                    </div>
                    <button 
                        onClick={handleJoinClick}
                        className="border border-blue-500 text-blue-500 font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:bg-blue-500 hover:text-white flex items-center gap-2 shrink-0"
                    >
                        Entrar
                        <i className="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                </div>
            </div>

            {/* Rodapé de Ações */}
            <div className="flex justify-around items-center p-2 text-sm text-gray-400 border-t border-white/10 mt-4">
                <button onClick={() => onLike(post.id)} className={`flex items-center gap-2 transition-colors duration-200 ${userHasLiked ? 'text-red-500' : 'hover:text-white'}`}>
                    <i className="fa-solid fa-heart"></i>
                    <span>{post.likes > 0 ? post.likes : ''}</span>
                </button>
                <button onClick={() => onCommentClick(post.id)} className="flex items-center gap-2 hover:text-white transition-colors duration-200">
                    <i className="fa-solid fa-comment"></i>
                    <span>{post.commentsCount > 0 ? post.commentsCount : ''}</span>
                </button>
                <button onClick={() => onShare(post)} className="flex items-center gap-2 hover:text-white transition-colors duration-200">
                    <i className="fa-solid fa-share"></i>
                </button>
                <div className="flex items-center gap-2">
                    <i className="fa-solid fa-eye"></i>
                    <span>{post.views || 0}</span>
                </div>
            </div>
        </div>
    );
});
