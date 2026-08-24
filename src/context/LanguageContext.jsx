import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('madventure_lang') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('madventure_lang', language);
        document.documentElement.lang = language;
        // Keep react-i18next in sync so pages using its useTranslation follow the app toggle
        i18n.changeLanguage(language).catch(() => {});
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'en' ? 'bn' : 'en'));
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
