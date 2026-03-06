import { useState, useEffect } from 'react';

const STORAGE_KEY = 'street-hero-settings';

const defaultSettings = {
    locationSheetUrl: '',
    noticeMemoUrl: '',
    pointSheetUrl: '',
};

export const useSettings = () => {
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch {
            return defaultSettings;
        }
    });

    const saveSettings = (newSettings) => {
        const merged = { ...settings, ...newSettings };
        setSettings(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    };

    return { settings, saveSettings };
};
