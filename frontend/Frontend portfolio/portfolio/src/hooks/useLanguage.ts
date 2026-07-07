<<<<<<< HEAD
export { useLanguage } from './LanguageProvider';
=======
'use client';
import { useEffect, useState } from 'react';

export function useLanguage() {
  const [language, setLanguageState] = useState('fr');

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'en' || savedLang === 'fr') {
      setLanguageState(savedLang);
    } else if (savedLang === 'EN') {
      setLanguageState('en');
      localStorage.setItem('language', 'en');
    } else if (savedLang === 'FR') {
      setLanguageState('fr');
      localStorage.setItem('language', 'fr');
    } else {
      setLanguageState('fr');
      localStorage.setItem('language', 'fr');
    }
  }, []);

  const setLanguage = (lang: string) => {
    const normalized = lang.toLowerCase();
    if (normalized !== 'fr' && normalized !== 'en') return;
    setLanguageState(normalized);
    localStorage.setItem('language', normalized);
    window.location.reload(); // 👈 Force le rechargement
  };

  return { language, setLanguage };
}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
