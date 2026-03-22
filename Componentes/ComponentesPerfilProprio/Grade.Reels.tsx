
import React from 'react';
import { usePerfilProprioGradeReels } from '../../hooks/Hook.Perfil.Proprio.Grade.Reels';
import { ModalTelaCarregamento } from '../ComponenteDeInterfaceDeUsuario/Modal.Tela.Carregamento';

interface Reel {
    id: string;
    thumbnail: string;
}

interface ReelsGridProps {
    userId: string;
    onReelClick: (reel: Reel) => void;
}

export const GradeDeReels: React.FC<ReelsGridProps> = ({ userId, onReelClick }) => {
    const { reels, loading, error } = usePerfilProprioGradeReels(userId);

    if (loading) {
        return <ModalTelaCarregamento />;
    }

    if (error) {
        return <div className="no-content text-red-500">Erro ao carregar os reels: {error.message}</div>;
    }

    if (!reels || reels.length === 0) {
        return <div className="no-content">Sem reels para exibir.</div>;
    }

    return (
        <div className="grid grid-cols-3 gap-1">
            {reels.map((reel: Reel) => (
                <div 
                    key={reel.id}
                    className="aspect-[9/16] bg-gray-800 cursor-pointer relative"
                    onClick={() => onReelClick(reel)}
                >
                    <img 
                        src={reel.thumbnail} 
                        alt={`Reel ${reel.id}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute bottom-1 left-1 text-white text-xs">
                        <i className="fa-solid fa-play mr-1"></i>
                        {/* Adicionar contador de visualizações se disponível */}
                    </div>
                </div>
            ))}
        </div>
    );
};
