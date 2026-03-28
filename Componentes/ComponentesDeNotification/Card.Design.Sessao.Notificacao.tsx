
import React from 'react';
import { Notificacao } from '@/types/Saida/Types.Estrutura.Notificacao';
import { CardNotificacaoCobranca } from './cards/Card.Notificacao.Cobranca';
import { CardNotificacaoComentario } from './cards/Card.Notificacao.Comentario';
import { CardNotificacaoComentarioResposta } from './cards/Card.Notificacao.Comentario.Resposta';
import { CardNotificacaoCompartilhamento } from './cards/Card.Notificacao.Compartilhamento';
import { CardNotificacaoCompraSucesso } from './cards/Card.Notificacao.Compra.Sucesso';
import { CardNotificacaoConviteGrupo } from './cards/Card.Notificacao.Convite.Grupo';
import { CardNotificacaoCurtidas } from './cards/Card.Notificacao.Curtidas';
import { CardNotificacaoLogin } from './cards/Card.Notificacao.Login';
import { CardNotificacaoMencao } from './cards/Card.Notificacao.Mencao';
import { CardNotificacaoPedidoAmizade } from './cards/Card.Notificacao.Pedido.Amizade';
import { CardNotificacaoSeguidor } from './cards/Card.Notificacao.Seguidor';
import { CardNotificacaoVendaPendente } from './cards/Card.Notificacao.Venda.Pendente';
import { CardNotificacaoVendaRealizada } from './cards/Card.Notificacao.Venda.Realizada';

interface CardDesignSessaoProps {
    title: string;
    notifications: Notificacao[];
    onFollowToggle: (id: number, username: string) => void;
    onPendingAction: (action: 'accept' | 'reject', notification: any) => void;
    onIgnoreExpiring: (id: number) => void;
    onPay: (groupId: string) => void;
    navigate: (path: string) => void;
}

const cardRegistry: Record<string, React.FC<any>> = {
    cobranca: CardNotificacaoCobranca,
    comentario: CardNotificacaoComentario,
    resposta_comentario: CardNotificacaoComentarioResposta,
    compartilhamento: CardNotificacaoCompartilhamento,
    compra_sucesso: CardNotificacaoCompraSucesso,
    convite_grupo: CardNotificacaoConviteGrupo,
    curtida: CardNotificacaoCurtidas,
    login: CardNotificacaoLogin,
    mencao: CardNotificacaoMencao,
    pedido_amizade: CardNotificacaoPedidoAmizade,
    seguidor: CardNotificacaoSeguidor,
    venda_pendente: CardNotificacaoVendaPendente,
    venda_realizada: CardNotificacaoVendaRealizada,
};

export const CardDesignSessaoNotificacao: React.FC<CardDesignSessaoProps> = ({
    title,
    notifications,
    ...props
}) => {
    const getCardComponent = (notif: Notificacao) => {
        const CardComponent = cardRegistry[notif.type];
        if (!CardComponent) {
            console.warn(`No card component found for notification type: ${notif.type}`);
            return null;
        }

        const cardProps: any = {
            key: notif.id,
            notif,
            onFollowToggle: props.onFollowToggle,
            onPendingAction: props.onPendingAction,
            onIgnoreExpiring: props.onIgnoreExpiring,
            onPay: props.onPay,
            navigate: props.navigate,
        };

        return <CardComponent {...cardProps} />;
    };

    if (!notifications || notifications.length === 0) {
        return null;
    }

    return (
        <>
            <style>{`
                .notification-section { margin-bottom: 20px; }
                .notification-section h2 { font-size: 13px; color: #00c2ff; padding: 10px 0; margin-bottom: 8px; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; }
                .notification-item, .notification-item-vip { display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 16px !important; background-color: rgba(255, 255, 255, 0.03) !important; border: 1px solid rgba(255, 255, 255, 0.05) !important; transition: background-color 0.2s, border-color 0.2s !important; border-radius: 14px !important; margin-bottom: 8px !important; border-bottom: none !important; border-left: none !important; }
                .notification-section > .notification-cards-wrapper > div:last-child > .notification-item, .notification-section > .notification-cards-wrapper > div:last-child > .notification-item-vip { margin-bottom: 0 !important; }
                .notification-item:hover, .notification-item-vip:hover { background-color: rgba(255, 255, 255, 0.06) !important; border-color: rgba(0, 194, 255, 0.2) !important; }
                .notification-sale { background-color: rgba(0, 255, 130, 0.06) !important; }
                .notification-pending { background-color: rgba(255, 170, 0, 0.06) !important; }
                .notification-item-vip { background: rgba(255, 215, 0, 0.06) !important; }
            `}</style>
            <section className="notification-section">
                <h2>{title}</h2>
                <div className="notification-cards-wrapper">
                    {notifications.map(notif => (
                        <div key={notif.id}>
                            {getCardComponent(notif)}
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};
