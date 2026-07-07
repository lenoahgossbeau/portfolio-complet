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

export default function ResearchersPage() {
  const { language } = useLanguage();
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResearchers = async () => {
      try {
        const response = await fetch('http://localhost:8000/researcher/public/list');
        const data = await response.json();
        setResearchers(data);
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
      <main className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-12">
          {language === 'fr' ? 'Nos chercheurs' : 'Our researchers'}
        </h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-500">{language === 'fr' ? 'Chargement...' : 'Loading...'}</p>
          </div>
        ) : researchers.length === 0 ? (
          <p className="text-center text-gray-500">
            {language === 'fr' ? 'Aucun chercheur trouvé.' : 'No researchers found.'}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {researchers.map((researcher) => (
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
                  <p className="text-gray-500 text-center text-sm mb-3">
                    {researcher.profession || (language === 'fr' ? 'Chercheur' : 'Researcher')}
                  </p>
                  <Link
                    href={`/researcher/${researcher.slug}`}
                    className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    {language === 'fr' ? 'Voir le profil' : 'View profile'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}