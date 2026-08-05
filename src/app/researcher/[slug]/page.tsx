'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';
import PublicNavbar from '@/components/PublicNavbar';
import toast from 'react-hot-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

type ResearcherProfile = {
  id: number;
  email: string;
  slug: string;
  name: string;
  firstName: string;
  lastName: string;
  profession: string;
  bio: string;
  description: string;
  specialite: string;
  diplome: string;
  linkedin: string;
  github: string;
  twitter: string;
  whatsapp: string;
  cvUrl: string;
  avatar: string;
  publications: { id: number; title: string; year: number; description: string; link: string }[];
  projects: { id: number; title: string; year: number; description: string; link: string }[];
  technical_skills: { id: number; name: string; level: number }[];
  soft_skills: { id: number; name: string; level: number }[];
  languages: { id: number; name: string; level: string; percent: number }[];
  degrees: { id: number; title: string; institution: string; year: number; description: string }[];
  experiences: { id: number; title: string; company: string; start_date: string; end_date: string; description: string }[];
};

export default function ResearcherSlugPage() {
  const { language } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<ResearcherProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/researcher/public/slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          toast.error('Chercheur non trouvé');
        }
      } catch (error) {
        console.error('Erreur chargement profil public:', error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProfile();
  }, [slug]);

  const getMediaUrl = (path: string | null | undefined) => {
    if (!path || typeof path !== 'string') return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
  };

  if (loading) return <div className="text-center py-20">{t('loading', language)}</div>;
  if (!profile) return <div className="text-center py-20">{t('researcher_not_found', language)}</div>;

  return (
    <>
      <PublicNavbar key={`navbar-${language}`} />
      <main className="max-w-5xl mx-auto px-4 py-10">

        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
            <div className="flex items-center gap-6">
              {profile.avatar ? (
                <img
                  src={getMediaUrl(profile.avatar) || '/favicon.ico'}
                  alt={profile.firstName}
                  className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/favicon.ico'; }}
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-blue-400 flex items-center justify-center text-4xl font-bold text-white border-4 border-white">
                  {profile.firstName?.[0]}{profile.lastName?.[0]}
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold">{profile.firstName} {profile.lastName}</h1>
                <p className="text-blue-100 mt-1 text-lg">{profile.profession || t('not_specified', language)}</p>
                {profile.specialite && <p className="text-blue-200 mt-1 text-sm">🎯 {profile.specialite}</p>}
                {profile.diplome && <p className="text-blue-200 mt-1 text-sm">🎓 {profile.diplome}</p>}
              </div>
              {/* Réseaux sociaux */}
              <div className="flex gap-3 text-2xl">
                {profile.linkedin && (
                  <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-200">💼</a>
                )}
                {profile.github && (
                  <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-200">🐙</a>
                )}
                {profile.twitter && (
                  <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-200">🐦</a>
                )}
                {profile.whatsapp && (
                  <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-200">💬</a>
                )}
              </div>
            </div>
          </div>

          {/* Bio + Description */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-3">🧬 {t('bio_title', language)}</h2>
            <p className="text-gray-700">{profile.bio || t('no_bio', language)}</p>
            {profile.description && (
              <p className="text-gray-600 mt-3 italic">{profile.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Compétences techniques */}
          {profile.technical_skills && profile.technical_skills.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                ⚙️ {t('technical_skills', language)}
              </h2>
              <div className="space-y-3">
                {profile.technical_skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                      <span className="text-sm text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {profile.soft_skills && profile.soft_skills.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                🤝 {t('soft_skills', language)}
              </h2>
              <div className="space-y-3">
                {profile.soft_skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                      <span className="text-sm text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Langues */}
          {profile.languages && profile.languages.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                🌍 {t('languages_title', language)}
              </h2>
              <div className="space-y-2">
                {profile.languages.map((lang) => (
                  <div key={lang.id} className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">{lang.name}</span>
                    <span className="text-sm px-3 py-1 rounded-full bg-purple-100 text-purple-800 capitalize">
                      {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diplômes */}
          {profile.degrees && profile.degrees.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                🎓 {t('degrees_title', language)}
              </h2>
              <div className="space-y-3">
                {profile.degrees.map((degree) => (
                  <div key={degree.id} className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-800">{degree.title}</p>
                    {degree.institution && <p className="text-sm text-gray-600">{degree.institution}</p>}
                    {degree.year && <p className="text-sm text-gray-500">{degree.year}</p>}
                    {degree.description && <p className="text-sm text-gray-500 italic">{degree.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Expériences */}
        {profile.experiences && profile.experiences.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              💼 {t('experiences_title', language)}
            </h2>
            <div className="space-y-4">
              {profile.experiences.map((exp) => (
                <div key={exp.id} className="border-l-4 border-green-500 pl-4">
                  <p className="font-semibold text-gray-800">{exp.title}</p>
                  {exp.company && <p className="text-sm text-gray-600">{exp.company}</p>}
                  <p className="text-sm text-gray-500">{exp.start_date} — {exp.end_date}</p>
                  {exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CV */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">📄 {t('cv_title', language)}</h2>
          {profile.cvUrl ? (
            <div className="flex gap-4">
              <a
                href={`/api/pdf-proxy?url=${encodeURIComponent(getMediaUrl(profile.cvUrl) || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
              >
                👁️ {t('view_cv', language)}
              </a>
              <a
                href={getMediaUrl(profile.cvUrl) || '#'}
                download
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 inline-block"
              >
                ⬇ {t('download_cv', language)}
              </a>
            </div>
          ) : (
            <p className="text-gray-500">{t('no_cv', language)}</p>
          )}
        </div>

        {/* Publications */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📚 {t('publications_title', language)}</h2>
          {profile.publications.length === 0 ? (
            <p className="text-gray-500">{t('no_publications', language)}</p>
          ) : (
            <div className="space-y-3">
              {profile.publications.map((pub) => (
                <div key={pub.id} className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-semibold text-gray-800">{pub.title} <span className="text-gray-500 font-normal">({pub.year})</span></p>
                  {pub.description && <p className="text-sm text-gray-600">{pub.description}</p>}
                  {pub.link && (
                    <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      {t('view_publication', language)} →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projets */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🚀 {t('projects_title', language)}</h2>
          {profile.projects.length === 0 ? (
            <p className="text-gray-500">{t('no_projects', language)}</p>
          ) : (
            <div className="space-y-3">
              {profile.projects.map((proj) => (
                <div key={proj.id} className="border-l-4 border-red-500 pl-4">
                  <p className="font-semibold text-gray-800">{proj.title} <span className="text-gray-500 font-normal">({proj.year})</span></p>
                  {proj.description && <p className="text-sm text-gray-600">{proj.description}</p>}
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      {t('view_project', language)} →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📬 {t('contact_title', language)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {profile.email && <p className="text-gray-700">📧 <span className="font-medium">{t('email_label', language)} :</span> {profile.email}</p>}
              {profile.whatsapp && <p className="text-gray-700">💬 <span className="font-medium">{t('whatsapp_label', language)} :</span> {profile.whatsapp}</p>}
            </div>
            <div className="space-y-2">
              {profile.linkedin && <p className="text-gray-700">💼 <span className="font-medium">{t('linkedin_label', language)} :</span> {profile.linkedin}</p>}
              {profile.github && <p className="text-gray-700">🐙 <span className="font-medium">{t('github_label', language)} :</span> {profile.github}</p>}
            </div>
          </div>
        </div>

      </main>
    </>
  );
}