import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
];

const LanguageSwitcher = ({ isHomePage }) => {
    const { i18n } = useTranslation();

    const base = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];
    const value = LANGUAGES.some((l) => l.code === base) ? base : 'en';

    return (
        <label
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all font-bold text-xs cursor-pointer ${
                isHomePage
                    ? 'border-white/20 text-white hover:bg-white/10'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
        >
            <Languages size={14} aria-hidden />
            <span className="sr-only">Language</span>
            <select
                value={value}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className={`bg-transparent font-bold text-xs border-none outline-none cursor-pointer max-w-[7.5rem] ${
                    isHomePage ? 'text-white' : 'text-gray-800 dark:text-gray-100'
                }`}
                aria-label="Select language"
            >
                {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.label}
                    </option>
                ))}
            </select>
        </label>
    );
};

export default LanguageSwitcher;
