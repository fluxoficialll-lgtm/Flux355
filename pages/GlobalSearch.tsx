
import React from 'react';
import { HookPesquisaGlobal } from '../hooks/Hook.Pesquisa.Global';
import { useModal } from '../Componentes/ComponenteDeInterfaceDeUsuario/Sistema.Modal';
import { User } from '../types';

// A interface para o usuário enriquecido que vem do hook
interface EnrichedUser extends User {
  isMe: boolean;
  canMessage: boolean;
  followStatus: 'none' | 'requested' | 'following';
  btnText: string;
  btnClass: string;
}

export const GlobalSearch: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    filteredUsers,
    loading,
    processingId,
    handleAction,
    handleProfileClick,
    handleMessageClick,
    handleBack
  } = HookPesquisaGlobal();

  const { showAlert } = useModal();

  // Wrapper no componente para lidar com a interação do usuário (confirmação e alertas)
  const onUserAction = async (user: EnrichedUser) => {
    try {
      // Se a ação for "deixar de seguir", peça confirmação
      if (user.followStatus === 'following') {
        if (window.confirm(`Deixar de seguir @${user.profile?.name}?`)) {
          await handleAction(user);
        }
      } else {
        // Para outras ações (como seguir), execute diretamente
        await handleAction(user);
      }
    } catch (error: any) {
      // Capture os erros lançados pelo hook e exiba um alerta
      showAlert("Erro", error.message || "Falha ao processar a solicitação.");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-x-hidden">
      <style>{`
        header {
            display: flex; align-items: center; gap: 15px; padding: 16px 20px;
            background: #0c0f14; position: fixed; width: 100%; z-index: 10;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1); top: 0; height: 70px;
        }
        header button {
            background: none; border: none; color: #00c2ff; font-size: 20px; cursor: pointer;
        }
        header h1 { font-size: 18px; font-weight: 600; color: #fff; }

        main { padding-top: 80px; width: 100%; max-width: 600px; margin: 0 auto; padding-bottom: 20px; }

        .search-container {
            padding: 0 20px 20px 20px;
        }
        .search-input-wrapper {
            position: relative;
        }
        .search-input-wrapper i {
            position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #aaa;
        }
        .search-input-wrapper input {
            width: 100%; padding: 12px 12px 12px 45px; background: #1a1e26;
            border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
            color: #fff; font-size: 16px; outline: none; transition: 0.3s;
        }
        .search-input-wrapper input:focus {
            border-color: #00c2ff; box-shadow: 0 0 10px rgba(0, 194, 255, 0.2);
        }

        .global-badge {
            display: flex; align-items: center; justify-content: center; gap: 6px;
            margin-top: 8px; font-size: 11px; color: #00ff82; text-transform: uppercase; letter-spacing: 1px;
        }

        .user-list { display: flex; flex-direction: column; }
        .user-item {
            display: flex; align-items: center; padding: 15px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            cursor: pointer;
            transition: background 0.2s;
        }
        .user-item:hover { background: rgba(255,255,255,0.05); }

        .user-avatar {
            width: 50px; height: 50px; border-radius: 50%; margin-right: 15px;
            background: #333; display: flex; align-items: center; justify-content: center;
            object-fit: cover; border: 1px solid #444; color: #888; font-size: 20px;
        }
        .user-info { flex-grow: 1; }
        .user-name { font-weight: 600; font-size: 15px; color: #fff; display: block; text-transform: capitalize; }
        .user-username { font-size: 13px; color: #888; }

        .action-buttons { display: flex; gap: 10px; align-items: center; }

        .action-btn {
            padding: 8px 20px; border-radius: 20px; font-size: 13px; font-weight: 600;
            border: none; cursor: pointer; transition: 0.2s; min-width: 80px;
            display: flex; align-items: center; justify-content: center; gap: 5px;
        }
        .btn-follow {
            background: #00c2ff; color: #000;
        }
        .btn-follow:hover { background: #0099cc; }
        
        .btn-requested {
            background: transparent; border: 1px solid #aaa; color: #aaa;
        }
        .btn-following {
            background: transparent; border: 1px solid #00c2ff; color: #00c2ff;
        }
        .action-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .msg-btn {
            width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.1);
            display: flex; align-items: center; justify-content: center; color: #fff;
            border: none; cursor: pointer; transition: 0.2s;
        }
        .msg-btn:hover { background: rgba(0,194,255,0.2); color: #00c2ff; }
      `}</style>

      <header>
        <button onClick={handleBack}><i className="fa-solid fa-arrow-left"></i></button>
        <h1>Encontrar Pessoas</h1>
      </header>

      <main>
        <div className="search-container">
          <div className="search-input-wrapper">
            <i className={`fa-solid ${loading ? 'fa-circle-notch fa-spin' : 'fa-magnifying-glass'}`}></i>
            <input
              type="text"
              placeholder="Pesquisar por nome ou @..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="global-badge">
            <i className="fa-solid fa-globe"></i> Pesquisa Global
          </div>
        </div>

        <div className="user-list">
          {filteredUsers.map((user: EnrichedUser) => {
            const username = user.profile?.name || 'unknown';
            const isProcessing = processingId === user.id;

            return (
              <div key={user.email} className="user-item" onClick={() => handleProfileClick(username)}>
                {user.profile?.photoUrl ? (
                  <img src={user.profile.photoUrl} className="user-avatar" alt={username} />
                ) : (
                  <div className="user-avatar"><i className="fa-solid fa-user"></i></div>
                )}
                <div className="user-info">
                  <span className="user-name">{user.profile?.nickname || user.profile?.name}</span>
                  <span className="user-username">@{username}</span>
                </div>
                <div className="action-buttons">
                  {user.canMessage && (
                    <button
                      className="msg-btn"
                      onClick={(e) => { e.stopPropagation(); handleMessageClick(user); }}
                    >
                      <i className="fa-solid fa-comment"></i>
                    </button>
                  )}
                  {!user.isMe && (
                    <button
                      className={user.btnClass}
                      onClick={(e) => { e.stopPropagation(); onUserAction(user); }}
                      disabled={isProcessing}
                    >
                      {isProcessing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : user.btnText}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredUsers.length === 0 && !loading && (
            <div style={{ textAlign: 'center', color: '#777', padding: '30px' }}>
              {searchTerm ? 'Nenhum usuário encontrado.' : 'Digite para pesquisar em toda a rede.'}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
