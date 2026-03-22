
import React from 'react';
import { HookFeed } from '../hooks/Hook.Feed';
import { useModal } from '../Componentes/ComponenteDeInterfaceDeUsuario/Sistema.Modal';
import { Footer } from '../Componentes/layout/Footer';
import { MainHeader } from '../Componentes/layout/MainHeader';
import { PublicacaoFeed } from '../types/Saida/Types.Estrutura.Publicacao.Feed';

// Importando os componentes de post CORRETAMENTE
import ContainerFeedPadrao from '../Componentes/ComponentesDeFeed/Container.Feed.Padrao'; // Este tem export default
import { ContainerFeedEnquete } from '../Componentes/ComponentesDeFeed/Container.Feed.Enquete'; // Este tem export nomeado
import { ContainerFeedGrupo } from '../Componentes/ComponentesDeFeed/Container.Feed.Grupo';     // Este tem export nomeado

export const Feed: React.FC = () => {
  const {
    posts, loading, hasMore, lastPostElementRef, scrollContainerRef, currentUserId, 
    uiVisible, activeLocationFilter, isMenuOpen, setIsMenuOpen, handleContainerScroll,
    handlePostLike, handlePostDelete, handlePostVote, handlePostShare, handleCtaClick, navigate
  } = HookFeed();
  const { showConfirm } = useModal();

  const handleDeleteRequest = async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (await showConfirm("Excluir Post", "Deseja excluir permanentemente?", "Excluir", "Cancelar")) {
          handlePostDelete(id);
      }
  };

  // Função que decide qual componente de post renderizar
  const renderPost = (post: PublicacaoFeed & { type?: string }) => { // Adicionado type opcional para compatibilidade
    const commonProps = {
        key: post.id,
        post: post,
        currentUserId: currentUserId,
        onLike: () => handlePostLike(post.id),
        onDelete: (postId: string, e: React.MouseEvent) => handleDeleteRequest(postId, e),
        onUserClick: (username: string) => navigate(`/user/${username.replace('@','')}`),
        onCommentClick: (postId: string) => navigate(`/post/${postId}`),
        onShare: () => handlePostShare(post),
    };

    // A propriedade `type` não existe em `PublicacaoFeed`, então o switch não funcionará como antes.
    // Para corrigir o fluxo de forma completa, seria necessário unificar os tipos de post.
    // Por enquanto, renderizamos apenas o padrão, que é o foco da nossa depuração.
    switch (post.type) {
        case 'group':
            // O ContainerFeedGrupo espera props específicas que `PublicacaoFeed` pode não ter.
            // Precisaríamos de um adaptador aqui ou unificar os tipos.
            return <ContainerFeedGrupo {...commonProps} />;
        case 'poll':
            // O ContainerFeedEnquete também espera props específicas.
            return <ContainerFeedEnquete {...commonProps} onVote={(postId, index) => handlePostVote(postId, index)} />;
        default:
            return <ContainerFeedPadrao {...commonProps} />;
    }
  };

  return (
    <div className="h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden relative">
      
      <MainHeader 
        leftContent={
            <button onClick={() => navigate('/location-selector')} className="bg-none border-none text-[#00c2ff] text-lg cursor-pointer hover:text-white flex items-center gap-1">
                <i className={`fa-solid ${activeLocationFilter && activeLocationFilter !== 'Global' ? 'fa-location-dot' : 'fa-globe'}`}></i>
                {activeLocationFilter && activeLocationFilter !== 'Global' && (
                    <span className="text-[10px] font-black uppercase tracking-tight ml-1">{activeLocationFilter.substring(0,8)}..</span>
                )}
            </button>
        }
        rightContent={
            <button onClick={() => navigate('/marketplace')} className="bg-none border-none text-[#00c2ff] text-lg cursor-pointer hover:text-white">
                <i className="fa-solid fa-cart-shopping"></i>
            </button>
        }
        onLogoClick={() => scrollContainerRef.current?.scrollTo({top: 0, behavior: 'smooth'})}
      />

      <div className="fixed top-[85px] left-1/2 -translate-x-1/2 z-40 flex items-center p-1 bg-[#1a1e26]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <button className="px-6 py-2 rounded-full bg-[#00c2ff] text-[#0c0f14] text-sm font-bold shadow-[0_0_15px_rgba(0,194,255,0.4)]">Feed</button>
          <button className="px-6 py-2 rounded-full text-gray-400 text-sm font-medium hover:text-white" onClick={() => navigate('/reels')}>Reels</button>
      </div>

      <main ref={scrollContainerRef} onScroll={handleContainerScroll} className="flex-grow w-full overflow-y-auto overflow-x-hidden relative pt-[140px] no-scrollbar">
        <div className="w-full max-w-[500px] mx-auto pb-[100px] px-3">
            {posts.length > 0 ? (
                posts.filter(p => p && p.autor).map(renderPost)
            ) : !loading && (
                <div className="text-center text-gray-500 mt-20 animate-fade-in">
                    <i className="fa-solid fa-ghost text-4xl opacity-30 mb-3"></i>
                    <p className="font-bold uppercase tracking-widest text-xs">Nada por aqui ainda.</p>
                </div>
            )}

            <div ref={lastPostElementRef} className="w-full h-24 flex items-center justify-center py-6">
                {loading && <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>}
                {!loading && !hasMore && posts.length > 0 && (
                    <div className="text-gray-500 text-sm font-medium opacity-60">• Fim do Feed •</div>
                )}
            </div>
        </div>
      </main>

      {isMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>}
      
      <div className={`fixed bottom-[180px] right-[27px] flex flex-col gap-4 z-50 items-end transition-all duration-300 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/feed-search')}>
              <span className="text-white font-medium text-sm bg-[#1a1e26] px-3 py-1.5 rounded-lg border border-white/10">Buscar</span>
              <div className="w-[50px] h-[50px] rounded-full bg-[#1a1e26] border border-white/10 flex items-center justify-center text-[#00c2ff] shadow-lg">
                  <i className="fa-solid fa-magnifying-glass"></i>
              </div>
          </div>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/create-reel')}>
              <span className="text-white font-medium text-sm bg-[#1a1e26] px-3 py-1.5 rounded-lg border border-white/10">Criar Reel</span>
              <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white shadow-lg">
                  <i className="fa-solid fa-clapperboard"></i>
              </div>
          </div>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/create-post')}>
              <span className="text-white font-medium text-sm bg-[#1a1e26] px-3 py-1.5 rounded-lg border border-white/10">Novo Post</span>
              <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-tr from-[#00c2ff] to-[#007bff] flex items-center justify-center text-white shadow-lg">
                  <i className="fa-solid fa-pen"></i>
              </div>
          </div>
      </div>

      <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className={`fixed bottom-[105px] right-[20px] w-[60px] h-[60px] bg-[#00c2ff] rounded-full text-white text-[24px] cursor-pointer shadow-[0_4px_15px_rgba(0,194,255,0.4)] z-50 flex items-center justify-center transition-all duration-300 ${uiVisible ? 'scale-100' : 'scale-0'} ${isMenuOpen ? 'rotate-45 bg-[#ff4d4d]' : ''}`}
      >
          <i className="fa-solid fa-plus"></i>
      </button>

      <Footer visible={uiVisible} />
    </div>
  );
};



