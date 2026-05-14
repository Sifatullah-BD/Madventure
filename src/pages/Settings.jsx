import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Globe, Palette, ChevronRight } from 'lucide-react';
import ThemeSwitcher from '../components/ThemeSwitcher';

const Settings = () => {
    const { t, i18n } = useTranslation();

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-heading font-bold text-primary mb-8">{t('settings_title')}</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Language Section */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                <Globe size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">{t('language_label')}</h2>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${(i18n.resolvedLanguage || i18n.language || '').startsWith(lang.code)
                                        ? 'bg-primary text-white border-primary shadow-md'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="text-lg">{lang.flag}</span>
                                    <span className="font-medium">{lang.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Theme Section */}
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                                <Palette size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">{t('theme_label')}</h2>
                        </div>

                        <ThemeSwitcher />
                    </div>

                    {/* About & Legal Section */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-gray-800 mb-4">About Madventure</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-primary font-medium">
                            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
                            <Link to="/terms" className="hover:underline">Terms of Service</Link>
                            <Link to="/community" className="hover:underline">Help Center</Link>
                        </div>
                        <p className="text-gray-400 text-xs mt-4">Version 2.0.1 • Made in Bangladesh</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
