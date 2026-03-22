
import React, { useState } from 'react';
import { AvatarPreviewModal } from '../ComponenteDeInterfaceDeUsuario/Modal.Previa.Avatar';
import { UserBadge } from '../ComponenteDeInterfaceDeUsuario/user/UserBadge';
import { HookPerfilTerceiro } from '../../hooks/Hook.Perfil.Terceiro';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MidiaCarregamentoLento } from '../ComponenteDeInterfaceDeUsuario/Midia.Carregamento.Lento';
import { PublicacaoFeed } from '../../types/Saida/Types.Estrutura.Publicacao.Feed';

interface ContainerFeedPadraoProps {
    post: PublicacaoFeed;
    currentUserId?: string;
    onLike: (postId: string) => void;
    onDelete: (postId: string, e: React.MouseEvent) => void;
    onUserClick: (username: string) => void;
    onCommentClick: (postId: string) => void;
    onShare: (post: PublicacaoFeed) => void;
}

const ContainerFeedPadrao: React.FC<ContainerFeedPadraoProps> = React.memo(({ 
    post, currentUserId, onLike, onDelete, onUserClick, onCommentClick, onShare 
}) => {

    if (!post || !post.autor || !post.autor.id) {
        console.error("Post inválido ou autor sem ID:", post);
        return (
            <div className="w-full h-24 flex items-center justify-center bg-[#1a1e26] rounded-xl shadow-lg mb-4">
                <i className="fa-solid fa-triangle-exclamation text-yellow-500 mr-2"></i>
                <span>Post inválido ou autor desconhecido.</span>
            </div>
        );
    }

    const [showMenu, setShowMenu] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const { profile: userData, isLoading } = HookPerfilTerceiro(post.autor.id);

    const isOwner = post.autor.id === currentUserId;
    const userHasLiked = false; 

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
        
    const displayName = userData?.nickname || userData?.name || post.autor.nome;

    return (
        <div className="feed-item bg-[#1a1e26] rounded-xl shadow-lg mb-4 overflow-hidden" id={`post-${post.id}`}>
             <div className="flex items-center justify-between mb-3 relative px-4 pt-4">
                 <div className="flex items-center gap-3">
                    <UserBadge 
                        avatarUrl={userData?.photo_url || post.autor.avatarUrl}
                        nickname={displayName}
                        handle={post.autor.id}
                        isVetoed={isVetoed}
                        isVip={isVip}
                        isLoading={isLoading}
                        avatarSize="md"
                        showHandle={false}
                        onAvatarClick={handleAvatarClick}
                        onNameClick={() => onUserClick(post.autor.id)}
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
                                {isOwner && <button onClick={(e) => { onDelete(post.id, e); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/5 text-sm font-semibold flex items-center gap-2"><i className="fa-solid fa-trash-can"></i> Excluir</button>}
                                <button onClick={() => setShowMenu(false)} className="w-full text-left px-4 py-3 text-gray-300 hover:bg-white/5 text-sm font-semibold flex items-center gap-2"><i className="fa-solid fa-flag"></i> Denunciar</button>
                            </div>
                        </>
                    )}
                </div>
                <AvatarPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} imageSrc={userData?.photo_url || post.autor.avatarUrl || ''} username={displayName} />
            </div>

            <div className="post-content px-4" onClick={() => onCommentClick(post.id)}>
                {post.content && <p className="text-white text-sm mb-3 cursor-pointer">{post.content}</p>}
                {post.media && post.media.length > 0 && (
                    <div className="media-container cursor-pointer -mx-4">
                        <MidiaCarregamentoLento src={post.media[0].url} alt="Post media" type={post.media[0].type} />
                    </div>
                )}
            </div>

            <div className="flex justify-around items-center p-2 text-sm text-gray-400 border-t border-white/10 mt-2">
                <button onClick={() => onLike(post.id)} className={`flex items-center gap-2 transition-colors duration-200 ${userHasLiked ? 'text-red-500' : 'hover:text-white'}`}>
                    <i className="fa-solid fa-heart"></i>
                    <span>{post.likes > 0 ? post.likes : ''}</span>
                </button>
                <button onClick={() => onCommentClick(post.id)} className="flex items-center gap-2 hover:text-white transition-colors duration-200">
                    <i className="fa-solid fa-comment"></i>
                    <span>{post.comments.length > 0 ? post.comments.length : ''}</span>
                </button>
                <button onClick={() => onShare(post)} className="flex items-center gap-2 hover:text-white transition-colors duration-200">
                    <i className="fa-solid fa-share"></i>
                    <span>{post.shares > 0 ? post.shares : ''}</span>
                </button>
                <div className="flex items-center gap-2">
                    <i className="fa-solid fa-eye"></i>
                    <span>{post.shares || 0}</span>
                </div>
            </div>
        </div>
    );
});

export default ContainerFeedPadrao;
