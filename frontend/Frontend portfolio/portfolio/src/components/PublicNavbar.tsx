'use client';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

export default function PublicNavbar() {
  const { language, setLanguage } = useLanguage();

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToLogin = () => {
    window.location.href = 'http://localhost:3000/auth/login';
  };

  const goToRegister = () => {
    window.location.href = 'http://localhost:3000/auth/register';
  };

  const switchToFrench = () => {
    localStorage.setItem('language', 'fr');
    setLanguage('fr');
    window.location.href = window.location.pathname; // Recharge sans paramètres
  };

  const switchToEnglish = () => {
    localStorage.setItem('language', 'en');
    setLanguage('en');
    window.location.href = window.location.pathname; // Recharge sans paramètres
  };

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center flex-wrap gap-4">
      <div className="flex gap-6">
        <button onClick={() => scrollTo('bio')} className="text-gray-700 hover:text-blue-600 transition">
          {t('about_section', language)}
        </button>
        <button onClick={() => scrollTo('publications')} className="text-gray-700 hover:text-blue-600 transition">
          {t('publication_section', language)}
        </button>
        <button onClick={() => scrollTo('projects')} className="text-gray-700 hover:text-blue-600 transition">
          {t('project_section', language)}
        </button>
        <button onClick={() => scrollTo('cv')} className="text-gray-700 hover:text-blue-600 transition">
          {t('nav_resume', language)}
        </button>
        <button onClick={() => scrollTo('contact')} className="text-gray-700 hover:text-blue-600 transition">
          {t('get_in_touch', language)}
        </button>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex gap-2">
          <button onClick={goToLogin} className="text-gray-700 hover:text-blue-600 transition">
            {t('login', language)}
          </button>
          <span className="text-gray-400">|</span>
          <button onClick={goToRegister} className="text-gray-700 hover:text-blue-600 transition">
            {t('register', language)}
          </button>
        </div>
        <div className="flex gap-1">
          <button
            onClick={switchToFrench}
            className={`px-2 py-1 text-sm rounded ${language === 'fr' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            FR
          </button>
          <button
            onClick={switchToEnglish}
            className={`px-2 py-1 text-sm rounded ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            EN
          </button>
        </div>
      </div>
    </nav>
  );
}