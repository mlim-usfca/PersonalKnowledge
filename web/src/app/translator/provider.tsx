import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/Locales/i18n'
// import { languageMap } from '../Locales/i18n';
interface TranslationContextType {
    t: (key: string) => string; 
    handleLanguageChange: (lang: string) => void;
}

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
    children: ReactNode;
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
    const { t } = useTranslation();
    const handleLanguageChange = (lang: string) => {
        if (i18n && i18n.changeLanguage) {
          i18n.changeLanguage(lang);
          localStorage.setItem('dai-lng', lang);
        } else {
          console.error('i18n or changeLanguage not available');
        }
      };
    
      useEffect(() => {
        const lng = localStorage.getItem('dai-lng') || 'en';
        handleLanguageChange(lng);
      }, []);

    return (
        <TranslationContext.Provider value={{ t, handleLanguageChange }}>
            {children}
        </TranslationContext.Provider>
    );
};

// Custom hook to use the translation context
export const useTranslator = () => {
    const context = useContext(TranslationContext);
    if (context === undefined) {
        throw new Error('useTranslator must be used within a TranslatorProvider');
    }
    return context;
};