
import React from 'react';
import { usePerfilProprioGradeFotos } from '../../hooks/Hook.Perfil.Proprio.Grade.Fotos';
import { ModalTelaCarregamento } from '../ComponenteDeInterfaceDeUsuario/Modal.Tela.Carregamento';

interface Photo {
    id: string;
    src: string;
}

interface PhotoGridProps {
    userId: string;
    onPhotoClick: (photo: Photo) => void;
}

export const GradeDeFotos: React.FC<PhotoGridProps> = ({ userId, onPhotoClick }) => {
    const { fotos, loading, error } = usePerfilProprioGradeFotos(userId);

    if (loading) {
        return <ModalTelaCarregamento />;
    }

    if (error) {
        return <div className="no-content text-red-500">Erro ao carregar as fotos: {error.message}</div>;
    }

    if (!fotos || fotos.length === 0) {
        return <div className="no-content">Sem fotos para exibir.</div>;
    }

    return (
        <div className="grid grid-cols-3 gap-1">
            {fotos.map((photo: Photo) => (
                <div 
                    key={photo.id} 
                    className="aspect-square bg-gray-800 cursor-pointer" 
                    onClick={() => onPhotoClick(photo)}
                >
                    <img 
                        src={photo.src} 
                        alt={`Foto ${photo.id}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
            ))}
        </div>
    );
};
