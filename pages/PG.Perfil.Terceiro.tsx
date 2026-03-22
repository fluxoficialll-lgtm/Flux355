
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUsuarioSessao } from '../hooks/Hook.Usuario.Sessao';
import { HookPerfilTerceiro } from '../hooks/Hook.Perfil.Terceiro';

import { CabecalhoPerfil } from '../Componentes/ComponentesPerfilProprio/CabecalhoPerfil';
import { CartaoDeInformacoesDoPerfil } from '../Componentes/ComponentesPerfilProprio/CartaoDeInformacoesDoPerfil';
import { CardCategoriasPerfil } from '../Componentes/ComponentesPerfilProprio/Card.Categorias.Perfil';
import { Footer } from '../Componentes/layout/Footer';
import { ModalListaDeSeguidores } from '../Componentes/ComponentesPerfilProprio/ModalListaDeSeguidores';
import { AvatarPreviewModal } from '../Componentes/ComponenteDeInterfaceDeUsuario/Modal.Previa.Avatar';
import { ModalTelaCarregamento } from '../Componentes/ComponenteDeInterfaceDeUsuario/Modal.Tela.Carregamento';

import { GradeDePostagens } from '../Componentes/ComponentesPerfilProprio/Grade.Postagens';
import { GradeDeProdutos } from '../Componentes/ComponentesPerfilProprio/Grade.Produtos';
import { GradeDeFotos } from '../Componentes/ComponentesPerfilProprio/Grade.Fotos';
import { GradeDeReels } from '../Componentes/ComponentesPerfilProprio/Grade.Reels';

const ProfilePageContent = ({ userId }) => {
    const { profile, isLoading, error, handleFollow } = HookPerfilTerceiro(userId);
    const { user: loggedInUser } = useUsuarioSessao();

    const [activeTab, setActiveTab] = useState('posts');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [avatarPreviewOpen, setAvatarPreviewOpen] = useState(false);

    const handleFollowersClick = () => {
        setModalTitle('Seguidores');
        setIsModalOpen(true);
    };

    const handleFollowingClick = () => {
        setModalTitle('Seguindo');
        setIsModalOpen(true);
    };

    if (isLoading) return <ModalTelaCarregamento />;
    if (error) return <div className="flex items-center justify-center h-screen bg-black text-white"><p>Erro: {error}</p></div>;
    if (!profile) return <div className="flex items-center justify-center h-screen bg-black text-white"><p>Perfil não encontrado.</p></div>;

    const isOwnProfile = loggedInUser && userId === loggedInUser.id;

    return (
        <div className="h-[100dvh] bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
            <CabecalhoPerfil username={profile.nickname || profile.name} isOwnProfile={isOwnProfile} />

            <main className="flex-grow w-full overflow-y-auto no-scrollbar pt-[80px] pb-[100px]">
                <div className="w-full max-w-[500px] mx-auto pt-2.5">
                    <CartaoDeInformacoesDoPerfil
                        avatar={profile.photo_url}
                        nickname={profile.nickname}
                        username={`@${profile.name}`}
                        bio={profile.bio}
                        website={profile.website}
                        stats={{ posts: profile.posts_count, followers: profile.followers_count, following: profile.following_count }}
                        isFollowing={profile.isFollowing}
                        onFollowClick={isOwnProfile ? undefined : handleFollow}
                        onFollowersClick={handleFollowersClick}
                        onFollowingClick={handleFollowingClick}
                        onAvatarClick={() => setAvatarPreviewOpen(true)}
                        isOwnProfile={isOwnProfile}
                    />
                </div>

                <div className="profile-tabs-container mt-4">
                    <CardCategoriasPerfil
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        hasProducts={(profile.products || []).length > 0}
                    />
                </div>

                <div className="w-full max-w-[500px] mx-auto pb-[100px]">
                    <div className="tab-content mt-4">
                        {activeTab === 'posts' && <GradeDePostagens posts={profile.posts || []} />}
                        {activeTab === 'products' && <GradeDeProdutos products={profile.products || []} />}
                        {activeTab === 'fotos' && <GradeDeFotos photos={profile.photos || []} />}
                        {activeTab === 'reels' && <GradeDeReels reels={profile.reels || []} />}
                    </div>
                </div>
            </main>

            <Footer />

            <ModalListaDeSeguidores
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                users={[] /* TODO: Fetch users */}
                title={modalTitle}
            />

            <AvatarPreviewModal
                isOpen={avatarPreviewOpen}
                onClose={() => setAvatarPreviewOpen(false)}
                imageSrc={profile.photo_url}
                username={profile.nickname}
            />
        </div>
    );
}

export const PG_Perfil_Terceiro = () => {
    const { id: paramId } = useParams<{ id: string }>();

    if (!paramId) {
        return <div className="flex items-center justify-center h-screen bg-black text-white"><p>ID de usuário não fornecido.</p></div>;
    }

    return <ProfilePageContent userId={paramId} />;
};
