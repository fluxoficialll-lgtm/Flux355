
import React from 'react';
import { usePerfilProprioGradeProdutos } from '../../hooks/Hook.Perfil.Proprio.Grade.Produtos';
import { ProductCard, PromotionalContainer } from '../ComponentesDeMarketplace/Container.Marketplace.Produto';
import { MarketplaceItem, Product } from '../../../types';
import { ModalTelaCarregamento } from '../ComponenteDeInterfaceDeUsuario/Modal.Tela.Carregamento';

interface ProfileProductsGridProps {
    userId: string;
    onProductClick: (product: any) => void;
}

export const GradeDeProdutos: React.FC<ProfileProductsGridProps> = ({ userId, onProductClick }) => {
    const { produtos, loading, error } = usePerfilProprioGradeProdutos(userId);

    if (loading) {
        return <ModalTelaCarregamento />;
    }

    if (error) {
        return <div className="no-content text-red-500">Erro ao carregar os produtos: {error.message}</div>;
    }

    if (!produtos || produtos.length === 0) {
        return <div className="no-content">Sem produtos para exibir.</div>;
    }

    return (
        <div className="grid grid-cols-2 gap-3 p-2">
            {produtos.map(product => {
                if (product.type === 'container') {
                    return (
                        <PromotionalContainer 
                            key={product.id}
                            product={product as Product}
                            onProductClick={onProductClick}
                        />
                    );
                }
                return (
                    <ProductCard 
                        key={product.id} 
                        product={product as MarketplaceItem} 
                        onClick={() => onProductClick(product)} 
                    />
                );
            })}
        </div>
    );
};
