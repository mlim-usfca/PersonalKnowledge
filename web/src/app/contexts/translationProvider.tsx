import React, { createContext, useContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface TranslationContextType {
    t: () => void;
}

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
    children: ReactNode;
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
    const { t } = useTranslation();

    return (
        <TranslationContext.Provider value={{ t }}>
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