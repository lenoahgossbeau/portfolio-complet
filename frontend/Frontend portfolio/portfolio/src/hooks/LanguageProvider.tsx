'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('fr');

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'fr' || savedLang === 'en') {
      setLanguage(savedLang);
    }
  }, []);

  const setAppLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: setAppLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}