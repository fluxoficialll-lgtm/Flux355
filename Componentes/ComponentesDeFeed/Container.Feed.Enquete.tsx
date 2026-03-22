
import React, { useState } from 'react';
import { Post, PollOption } from '../../tipos';
import { AvatarPreviewModal } from '../ComponenteDeInterfaceDeUsuario/Modal.Previa.Avatar';
import { UserBadge } from '../ComponenteDeInterfaceDeUsuario/user/UserBadge';
import { HookPerfilTerceiro } from '../../hooks/Hook.Perfil.Terceiro';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MidiaCarregamentoLento } from '../ComponenteDeInterfaceDeUsuario/Midia.Carregamento.Lento';

interface ContainerFeedEnqueteProps {
    post: Post;
    currentUserId?: string;
    onLike: (postId: string) => void;
    onDelete: (postId: string, e: React.MouseEvent) => void;
    onUserClick: (username: string) => void;
    onCommentClick: (postId: string) => void;
    onShare: (post: Post) => void;
    onVote: (postId: string, optionIndex: number) => void;
}

const Enquete: React.FC<{ 
    postId: string, 
    pollOptions: PollOption[], 
    votedOptionIndex?: number, 
    onVote: (postId: string, index: number) => void 
}> = ({ postId, pollOptions, votedOptionIndex, onVote }) => {
    const formatNumber = (num: number): string => {
        if (!num) return '0';
        if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return num.toString();
    };

    const totalVotes = pollOptions.reduce((acc, curr) => acc + curr.votes, 0);
    const getPercentage = (votes: number) => totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);

    return (
        <div className="mx-0 mt-2.5 mb-2.5 p-3 bg-[#00c2ff0d] rounded-xl border border-[#00c2ff22]">
            {pollOptions.map((option, idx) => {
                const pct = getPercentage(option.votes);
                const isVoted = votedOptionIndex === idx;
                return (
                    <div
                        key={idx}
                        onClick={() => onVote(postId, idx)}
                        className={`relative mb-2 p-3 rounded-lg cursor-pointer overflow-hidden font-medium transition-colors ${isVoted ? 'bg-[#00c2ff] text-black font-bold' : 'bg-[#1e2531] hover:bg-[#28303f]'}`}
                    >
                        <div
                            className="absolute top-0 left-0 h-full bg-[#00c2ff] opacity-30 z-0 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                        ></div>
                        <div className="relative z-10 flex justify-between items-center text-sm">
                            <span>{option.text}</span>
                            <span>{pct}%</span>
                        </div>
                    </div>
                );
            })}
            <div className="text-right text-xs text-gray-500 mt-1">{formatNumber(totalVotes)} votos</div>
        </div>
    );
};

export const ContainerFeedEnquete: React.FC<ContainerFeedEnqueteProps> = React.memo(({ 
    post, currentUserId, onLike, onDelete, onUserClick, onCommentClick, onShare, onVote 
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const { profile: userData, isLoading } = HookPerfilTerceiro(post.author?.id);

    const isOwner = post.author?.id === currentUserId;
    const userHasLiked = post.likedBy?.includes(currentUserId || '') || false;
    const votedOptionIndex = post.poll?.options.findIndex(o => o.voters.includes(currentUserId || ''));

    // CORRIGIDO: Pré-calcula os valores de flags para segurança
    const isVetoed = userData?.flags?.isVetoed ?? false;
    const isVip = userData?.flags?.isVip ?? false;

    const handleAvatarClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (userData?.photo_url) setIsPreviewOpen(true);
    };

    const timeAgo = post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR }) : 'agora mesmo';
    const displayName = userData?.nickname || userData?.name || post.author?.username;

    if (!post || !post.author || !post.poll) {
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
                                {isOwner && <button onClick={(e) => { onDelete(post.id, e); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/5 text-sm font-semibold flex items-center gap-2"><i className="fa-solid fa-trash-can"></i> Excluir</button>}
                                <button onClick={() => setShowMenu(false)} className="w-full text-left px-4 py-3 text-gray-300 hover:bg-white/5 text-sm font-semibold flex items-center gap-2"><i className="fa-solid fa-flag"></i> Denunciar</button>
                            </div>
                        </>
                    )}
                </div>
                <AvatarPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} imageSrc={userData?.photo_url || post.author.avatar || ''} username={displayName} />
            </div>

            {/* Conteúdo */}
            <div className="post-content px-4" onClick={() => onCommentClick(post.id)}>
                {post.text && <p className="text-white text-sm mb-3 cursor-pointer">{post.text}</p>}
                {post.mediaUrl && (
                    <div className="media-container cursor-pointer -mx-4">
                        <MidiaCarregamentoLento src={post.mediaUrl} alt="Post media" mediaType={post.mediaType} />
                    </div>
                )}
                <Enquete 
                    postId={post.id}
                    pollOptions={post.poll.options}
                    onVote={onVote}
                    votedOptionIndex={votedOptionIndex !== -1 ? votedOptionIndex : undefined}
                />
            </div>

            {/* Rodapé de Ações */}
            <div className="flex justify-around items-center p-2 text-sm text-gray-400 border-t border-white/10 mt-2">
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
