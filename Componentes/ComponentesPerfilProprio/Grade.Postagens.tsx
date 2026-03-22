
import React from 'react';
import { usePerfilProprioGradePostagens } from '../../hooks/Hook.Perfil.Proprio.Grade.Postagens';
// CORREÇÃO: Alterando para importação padrão
import ContainerFeedPadrao from '../ComponentesDeFeed/Container.Feed.Padrao';
import { ModalTelaCarregamento } from '../ComponenteDeInterfaceDeUsuario/Modal.Tela.Carregamento';

interface PostFeedProps {
    userId: string;
}

export const GradeDePostagens: React.FC<PostFeedProps> = ({ userId }) => {
    const { postagens, loading, error } = usePerfilProprioGradePostagens(userId);

    if (loading) {
        return <ModalTelaCarregamento />;
    }

    if (error) {
        return <div className="text-center text-red-500 py-10">Erro ao carregar as postagens: {error.message}</div>;
    }

    if (!postagens || postagens.length === 0) {
        return <div className="text-center text-gray-400 py-10">Sem postagens para exibir.</div>;
    }

    return (
        <div className="flex flex-col gap-4 px-3">
            {postagens.map(post => (
                <ContainerFeedPadrao 
                    key={post.id} 
                    post={post} 
                />
            ))}
        </div>
    );
};
