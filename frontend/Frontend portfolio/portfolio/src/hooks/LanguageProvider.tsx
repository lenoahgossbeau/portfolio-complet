'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type LanguageContextType = {
  language: string;
  changeLanguage: (lang: string) => void;
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'EN',
  changeLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('EN');

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'EN' || savedLang === 'FR') {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}