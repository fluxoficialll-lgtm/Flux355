
import { useState, useEffect } from 'react';
import { useModal } from '../Componentes/ComponenteDeInterfaceDeUsuario/Sistema.Modal';

// Mock implementation since the real API is not available
const mockNotificationsAPI = {
  getSettings: async (userId: string) => {
    console.log(`[MOCK] Fetching settings for user ${userId}`);
    // Return some default settings
    return {
      push: true,
      email: {
        news: true,
        updates: false,
      },
      sms: false,
    };
  },
  updateSettings: async (userId: string, newSettings: any) => {
    console.log(`[MOCK] Updating settings for user ${userId} with`, newSettings);
    // Return the new settings to simulate a successful update
    return newSettings;
  },
};

export const useNotificationSettings = (userId: string) => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showModal } = useModal();

    useEffect(() => {
        const fetchSettings = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }
            try {
                const data = await mockNotificationsAPI.getSettings(userId);
                setSettings(data);
            } catch (err: any) {
                setError(err);
                showModal('Error', { message: 'Failed to fetch notification settings.' });
            }
            setLoading(false);
        };

        fetchSettings();
    }, [userId, showModal]);

    const updateSettings = async (newSettings: any) => {
        if (!userId) return;
        try {
            setLoading(true);
            const data = await mockNotificationsAPI.updateSettings(userId, newSettings);
            setSettings(data);
            showModal('Success', { message: 'Settings updated successfully!' });
        } catch (err: any) {
            setError(err);
            showModal('Error', { message: 'Failed to update settings.' });
        }
        setLoading(false);
    };

    return { settings, loading, error, updateSettings };
};
