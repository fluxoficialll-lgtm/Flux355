
import React, { useRef } from 'react';
import { useEditProfile } from '../../hooks/Hook.Editar.Perfil';
import { ModalCorteImagem } from '../ComponenteDeInterfaceDeUsuario/Modal.Corte.Imagem';
import { ModalTelaCarregamento } from '../ComponenteDeInterfaceDeUsuario/Modal.Tela.Carregamento';

export const CardEdicaoPerfil: React.FC = () => {
  const {
    formData, 
    imagePreview, 
    loading, 
    fetching, 
    error, 
    usernameError,
    isCropOpen, 
    setIsCropOpen,
    rawImage,
    handleChange, 
    handleImageChange, 
    handleCroppedImage,
    handleSubmit,
  } = useEditProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (fetching) {
    return <ModalTelaCarregamento message='Carregando perfil...' />;
  }

  return (
    <>
        <style>{`
            .profile-edit-card {
                background-color: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 24px;
                color: white;
            }
            .avatar-section {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 24px;
            }
            .avatar-image {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid #00c2ff;
                cursor: pointer;
            }
            .change-photo-btn {
                margin-top: 12px;
                color: #00c2ff;
                font-weight: 600;
                cursor: pointer;
                background: none;
                border: none;
            }
            .form-group {
                margin-bottom: 16px;
            }
            .form-group label {
                display: block;
                font-size: 14px;
                font-weight: 500;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 8px;
            }
            .form-group input,
            .form-group textarea {
                width: 100%;
                background-color: rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 12px;
                color: white;
                font-size: 16px;
            }
            .form-group textarea {
                resize: vertical;
                min-height: 100px;
            }
            .error-message {
                color: #ff4d4d;
                font-size: 14px;
                margin-top: 4px;
            }
            .save-button {
                width: 100%;
                padding: 14px;
                background-color: #00c2ff;
                color: #0c0f14;
                font-weight: 700;
                font-size: 16px;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            .save-button:disabled {
                background-color: #555;
                cursor: not-allowed;
            }
        `}</style>

        {loading && <ModalTelaCarregamento message='Salvando alterações...' />}

        <ModalCorteImagem
            aberto={isCropOpen}
            aoFechar={() => setIsCropOpen(false)}
            imagemSrc={rawImage}
            aoSalvar={handleCroppedImage}
        />

        <form onSubmit={handleSubmit} className="profile-edit-card">
            <div className="avatar-section">
                <img 
                    src={imagePreview || 'https://via.placeholder.com/100'} 
                    alt="Avatar" 
                    className="avatar-image"
                    onClick={() => fileInputRef.current?.click()}
                />
                <button type="button" className="change-photo-btn" onClick={() => fileInputRef.current?.click()}>
                    Alterar foto de perfil
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    accept="image/*" 
                    hidden 
                />
            </div>

            <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label htmlFor="apelido">Nome de usuário (@)</label>
                <input type="text" id="apelido" name="apelido" value={formData.apelido} onChange={handleChange} />
                {usernameError && <p className="error-message">{usernameError}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange}></textarea>
            </div>

            {error && <p className="error-message" style={{ marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

            <button type="submit" className="save-button" disabled={loading}>Salvar Alterações</button>
        </form>
    </>
  );
};
