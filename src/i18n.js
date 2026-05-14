import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import bn from './locales/bn.json';
import hi from './locales/hi.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            bn: { translation: bn },
            hi: { translation: hi },
            es: { translation: es },
            fr: { translation: fr },
            ar: { translation: ar },
        },
        lng: 'en', // default language
        fallbackLng: 'en',
        supportedLngs: ['en', 'bn', 'hi', 'es', 'fr', 'ar'],
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

function applyDocumentLanguage(lng) {
    if (typeof document === 'undefined') return;
    const code = (lng || 'en').split('-')[0];
    document.documentElement.setAttribute('lang', code);
    document.documentElement.setAttribute('dir', i18n.dir(lng));
}

i18n.on('languageChanged', applyDocumentLanguage);
applyDocumentLanguage(i18n.language);

export default i18n;
