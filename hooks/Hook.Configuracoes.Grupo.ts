
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { useModal } from '../Componentes/ComponenteDeInterfaceDeUsuario/Sistema.Modal';

export const useGroupSettings = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Removido o tipo genérico
    const { showAlert } = useModal();
    
    const [group, setGroup] = useState(null); // Estado genérico
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    // Estados do formulário
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [isSalesPlatformEnabled, setIsSalesPlatformEnabled] = useState(false);
    const [salesPlatformSections, setSalesPlatformSections] = useState([]); // Estado genérico

    useEffect(() => {
        if (!id) {
            setLoading(false);
            navigate('/groups');
            return;
        }

        const fetchGroupData = async () => {
            try {
                setLoading(true);

                const response = await fetch(`/api/groups/${id}`);
                if (!response.ok) {
                    throw new Error('A resposta da rede não foi OK');
                }
                const groupData = await response.json(); // Removida a tipagem

                setGroup(groupData);

                const currentUser = SistemaAutenticacaoSupremo.getCurrentUser();
                const owner = groupData.ownerId === currentUser?.id;
                setIsOwner(owner);

                // Populando o estado do formulário com os dados do fetch
                setGroupName(groupData.name || '');
                setDescription(groupData.description || '');
                setIsSalesPlatformEnabled(groupData.isSalesPlatformEnabled || false);
                setSalesPlatformSections(groupData.salesPlatformSections || []);

            } catch (error) {
                console.error("Erro definitivo ao carregar os detalhes do grupo:", error);
                showAlert('Erro de Simulação', 'Não foi possível carregar as configurações do grupo.');
                navigate('/groups');
            } finally {
                setLoading(false);
            }
        };

        fetchGroupData();
    }, [id, navigate, showAlert]);

    const handleSave = async () => {
        console.log('Salvando configurações (simulado)...');
        await showAlert('Simulação', 'As configurações foram salvas com sucesso (simulado).');
    };

    return {
        id, group, loading, isOwner,
        handleSave,
        form: {
            groupName, setGroupName,
            description, setDescription,
            isSalesPlatformEnabled, setIsSalesPlatformEnabled,
            salesPlatformSections, setSalesPlatformSections
        }
    };
};
