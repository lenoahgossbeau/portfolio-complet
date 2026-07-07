'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

interface Researcher {
  id: number;
  name: string;
  slug: string;
  bio: string;
  photo_url?: string;
  profession?: string;
}

export default function InchtechsHomePage() {
  const { language } = useLanguage();
  const [featuredResearchers, setFeaturedResearchers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResearchers = async () => {
      try {
        // ✅ URL CORRIGÉE - utilise le bon endpoint du backend
        const response = await fetch('http://localhost:8000/researcher/public/list');
        const data = await response.json();
        setFeaturedResearchers(data.slice(0, 6));
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResearchers();
  }, []);

  return (
    <>
      <Navbar />
      
      {/* SECTION HERO */}
      <main className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          {t('home_title', language)}
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          {t('home_subtitle', language)}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/auth/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {t('login', language)}
          </Link>
          <Link
            href="/auth/register"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            {t('register', language)}
          </Link>
          <Link
            href="/researchers"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            {t('browse_researchers', language)}
          </Link>
        </div>
      </main>

      {/* SECTION FONCTIONNALITÉS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'fr' ? 'Ce que vous pouvez faire' : 'What you can do'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">
                {language === 'fr' ? 'Explorer les portfolios' : 'Explore portfolios'}
              </h3>
              <p className="text-gray-600">
                {language === 'fr' 
                  ? 'Accédez aux portfolios publics des chercheurs et découvrez leurs travaux.'
                  : 'Access public researcher portfolios and discover their work.'}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">
                {language === 'fr' ? 'Consulter CV & publications' : 'View CV & publications'}
              </h3>
              <p className="text-gray-600">
                {language === 'fr'
                  ? 'Consultez les CV, publications et projets des chercheurs.'
                  : 'Browse researchers\' CVs, publications and projects.'}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">✉️</div>
              <h3 className="text-xl font-semibold mb-2">
                {language === 'fr' ? 'Contacter les chercheurs' : 'Contact researchers'}
              </h3>
              <p className="text-gray-600">
                {language === 'fr'
                  ? 'Envoyez un message directement aux chercheurs via le formulaire de contact.'
                  : 'Send messages directly to researchers via the contact form.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION CHERCHEURS EN VEDETTE */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'fr' ? 'Chercheurs en vedette' : 'Featured researchers'}
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-500">{language === 'fr' ? 'Chargement...' : 'Loading...'}</p>
            </div>
          ) : featuredResearchers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{language === 'fr' ? 'Aucun chercheur trouvé.' : 'No researchers found.'}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredResearchers.map((researcher) => (
                <div key={researcher.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="p-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                      {researcher.photo_url ? (
                        <img src={researcher.photo_url} alt={researcher.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        '👨‍🔬'
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-1">{researcher.name}</h3>
                    <p className="text-gray-500 text-center text-sm mb-3">{researcher.profession || (language === 'fr' ? 'Chercheur' : 'Researcher')}</p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{researcher.bio?.substring(0, 100)}...</p>
                    <Link
                      href={`/researcher/${researcher.slug}`}
                      className="block text-center bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition"
                    >
                      {language === 'fr' ? 'Voir le profil' : 'View profile'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              href="/researchers"
              className="inline-block border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-600 hover:text-white transition"
            >
              {language === 'fr' ? 'Voir tous les chercheurs' : 'View all researchers'}
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION CTA FINALE */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'fr' ? 'Prêt à rejoindre la communauté ?' : 'Ready to join the community?'}
          </h2>
          <p className="text-lg mb-8 opacity-90">
            {language === 'fr'
              ? 'Inscrivez-vous dès maintenant pour créer votre portfolio de chercheur.'
              : 'Sign up now to create your researcher portfolio.'}
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            {t('register', language)}
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2025 InchTechs. {language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/" className="hover:text-gray-300">InchTechs</Link>
            <Link href="/researchers" className="hover:text-gray-300">
              {language === 'fr' ? 'Chercheurs' : 'Researchers'}
            </Link>
            <Link href="/auth/login" className="hover:text-gray-300">{t('login', language)}</Link>
            <Link href="/auth/register" className="hover:text-gray-300">{t('register', language)}</Link>
          </div>
        </div>
      </footer>
    </>
  );
}