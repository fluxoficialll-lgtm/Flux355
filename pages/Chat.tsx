
import React from 'react';
import { HookConversa } from '../hooks/Hook.Conversa';
import { useModal } from '../Componentes/ComponenteDeInterfaceDeUsuario/Sistema.Modal';
import { Virtuoso } from 'react-virtuoso';
import { ChatHeader } from '../Componentes/ComponentesDeChats/ChatHeader';
import { ChatInput } from '../Componentes/ComponentesDeChats/ChatInput';
import { MessageItem } from '../Componentes/ComponentesDeChats/MessageItem';
import { ChatMenuModal } from '../Componentes/ComponentesDeChats/ChatMenuModal';
import { ModalGradeDeAcoes } from '../Componentes/ComponentesDeChats/ModalGradeDeAcoes';
import { ModalEncaminharMensagem } from '../Componentes/ComponentesDeChats/Modal.Encaminhar.Mensagem';

export const Chat: React.FC = () => {
  const {
    virtuosoRef, messages, contactName, contactHandle, contactAvatar, contactStatus, isBlocked,
    isSelectionMode, setIsSelectionMode, selectedIds, setSelectedIds, isSearchOpen, setIsSearchOpen,
    searchTerm, setSearchTerm, zoomedMedia, setZoomedMedia, isMenuModalOpen, setIsMenuModalOpen,
    isUploading, currentUserEmail, navigate, handleSendMessage, handleToggleSelection, handleStartSelection,
    deleteSelectedMessages, handleEdit, handlePin, handleCopy, handleForward, handleReply,
    isForwardModalOpen, setIsForwardModalOpen, handleConfirmForward
  } = HookConversa();

  const { showOptions } = useModal();

  const handleDeleteRequest = async () => {
    if (selectedIds.length === 0) return;
    const target = await showOptions("Excluir Mensagem", [
        { label: 'Excluir para mim', value: 'me', icon: 'fa-solid fa-user' },
        { label: 'Excluir para todos', value: 'all', icon: 'fa-solid fa-users', isDestructive: true }
    ]);
    if (target) {
        deleteSelectedMessages(target);
    }
  };

  return (
    <div className="messages-page h-[100dvh] flex flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white">
      <ChatHeader
        title={contactName}
        subtitle={isBlocked ? 'Bloqueado' : contactStatus}
        avatar={contactAvatar}
        onBack={() => navigate('/messages')}
        onInfoClick={() => contactHandle && navigate(`/user/${contactHandle}`)}
        isSelectionMode={isSelectionMode}
        selectedCount={selectedIds.length}
        onCancelSelection={() => { setIsSelectionMode(false); setSelectedIds([]); }}
        onDeleteSelection={handleDeleteRequest}
        isSearchOpen={isSearchOpen}
        onToggleSearch={() => { setIsSearchOpen(!isSearchOpen); setSearchTerm(''); }}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onMenuClick={() => setIsMenuModalOpen(true)}
      />

      <main className="flex-grow w-full flex flex-col pt-[60px]">
          <ModalGradeDeAcoes 
            visible={isSelectionMode} 
            onEdit={handleEdit}
            onPin={handlePin}
            onCopy={handleCopy}
            onForward={handleForward}
            onReply={handleReply}
          />
          <Virtuoso
              ref={virtuosoRef}
              className="h-full pb-[80px]"
              data={messages}
              initialTopMostItemIndex={messages.length - 1}
              followOutput="smooth"
              itemContent={(index, msg) => (
                  <MessageItem
                      key={msg.id}
                      msg={msg}
                      isMe={msg.senderEmail?.toLowerCase() === currentUserEmail}
                      isSelectionMode={isSelectionMode}
                      isSelected={selectedIds.includes(msg.id)}
                      onSelect={handleToggleSelection}
                      onStartSelection={handleStartSelection}
                      onMediaClick={(url, type) => setZoomedMedia({ url, type })}
                      onProductClick={(pid) => navigate(`/marketplace/product/${pid}`)}
                      onPlayAudio={() => {}}
                  />
              )}
          />
      </main>

      {!isSelectionMode && (
        <ChatInput
            onSendMessage={handleSendMessage}
            onSendAudio={() => {}}
            onFileSelect={() => {}}
            isBlocked={isBlocked}
            isUploading={isUploading}
        />
      )}

      <ChatMenuModal 
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        isBlocked={isBlocked}
        onSearch={() => setIsSearchOpen(true)}
        onSelect={() => setIsSelectionMode(true)}
        onBlock={() => {}}
        onClear={() => {}}
      />

      <ModalEncaminharMensagem
        isOpen={isForwardModalOpen}
        onClose={() => setIsForwardModalOpen(false)}
        onConfirm={handleConfirmForward}
      />

      {zoomedMedia && (
          <div className="fixed inset-0 z-[60] bg-black bg-opacity-95 flex items-center justify-center p-2" onClick={() => setZoomedMedia(null)}>
              <img src={zoomedMedia.url} className="max-w-full max-h-full object-contain" />
          </div>
      )}
    </div>
  );
};
