import { useLanguage } from '../context/LanguageContext';
import en from '../translations/en.json';
import bn from '../translations/bn.json';

export const useTranslation = () => {
    const { language } = useLanguage();
    const translations = language === 'bn' ? bn : en;

    const t = (key) => {
        const keys = key.split('.');
        let value = translations;
        for (const k of keys) {
            if (value[k]) {
                value = value[k];
            } else {
                return key; // Fallback to key if not found
            }
        }
        return value;
    };

    return { t, language };
};
