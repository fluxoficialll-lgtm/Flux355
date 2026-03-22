
import React, { useRef } from 'react';
import { useCompleteProfile } from '../hooks/Hook.Perfil.Completar';
import { ModalCorteImagem } from '../Componentes/ComponenteDeInterfaceDeUsuario/Modal.Corte.Imagem';

export const CompleteProfile: React.FC = () => {
    const {
        dadosFormulario,
        previaImagem,
        carregando,
        erroNomeUsuario,
        cortarAberto,
        setCortarAberto,
        imagemOriginal,
        aoMudarInput,
        aoMudarImagem,
        aoSalvarImagemCortada,
        aoSubmeter,
        aoSair
    } = useCompleteProfile();

    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col justify-center items-center p-4">
            <style>{`
                .form-container { width: 100%; max-width: 400px; background-color: rgba(255,255,255,0.02); padding: 30px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
                .avatar-section { display: flex; flex-direction: column; align-items: center; margin-bottom: 25px; }
                .avatar-wrapper { position: relative; width: 90px; height: 90px; border-radius: 50%; cursor: pointer; }
                .avatar-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2px solid #00c2ff; }
                .edit-icon { position: absolute; bottom: -2px; right: -2px; background: #00c2ff; color: #000; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #0c0f14; }
                .input-group { margin-bottom: 18px; }
                .input-group label { display: block; font-size: 12px; color: #aaa; margin-bottom: 6px; }
                .input-group input, .input-group textarea { width: 100%; padding: 12px; background: #1a1e26; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 15px; outline: none; }
                .submit-btn { width: 100%; padding: 14px; background: #00c2ff; color: #000; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; }
                .logout-btn { background: none; border: none; color: #ff4d4d; font-size: 13px; cursor: pointer; display: block; text-align: center; margin-top: 20px; }
            `}</style>

            <div className="form-container">
                <h1 className="text-2xl font-bold text-center mb-2">Quase lá!</h1>
                <p className="text-center text-gray-400 mb-8 text-sm">Complete seu perfil para continuar.</p>

                <div className="avatar-section">
                    <div className="avatar-wrapper" onClick={() => fileInputRef.current?.click()}>
                        {previaImagem ? <img src={previaImagem} className="avatar-img" /> : <div className="avatar-img bg-gray-700 flex items-center justify-center"><i className="fa-solid fa-user text-3xl"></i></div>}
                        <div className="edit-icon"><i className="fa-solid fa-camera"></i></div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={aoMudarImagem} accept="image/*" hidden />
                </div>

                <form onSubmit={aoSubmeter}>
                    <div className="input-group">
                        <label>Seu apelido</label>
                        <input type="text" name="nickname" value={dadosFormulario.nickname || ''} onChange={aoMudarInput} placeholder="Ex: Seu Nome" />
                    </div>
                    <div className="input-group">
                        <label>Seu nome de usuário</label>
                        <input type="text" name="name" value={dadosFormulario.name || ''} onChange={aoMudarInput} placeholder="Ex: @seunome" />
                        {erroNomeUsuario && <p className="text-red-500 text-xs mt-1">{erroNomeUsuario}</p>}
                    </div>
                    <div className="input-group">
                        <label>Sua bio</label>
                        <textarea name="bio" value={dadosFormulario.bio || ''} onChange={aoMudarInput} placeholder="Fale um pouco sobre você" rows={2}></textarea>
                    </div>

                    <button type="submit" className="submit-btn" disabled={carregando}>{carregando ? 'Finalizando...' : 'Concluir Cadastro'}</button>
                </form>

                <button onClick={aoSair} className="logout-btn">Sair da conta</button>
            </div>

            <ModalCorteImagem aberto={cortarAberto} imagemSrc={imagemOriginal} aoFechar={() => setCortarAberto(false)} aoSalvar={aoSalvarImagemCortada} />
        </div>
    );
};
