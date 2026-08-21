'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaXTwitter,
  FaWhatsapp,
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaCode,
  FaGlobe,
  FaComments,
  FaInfo,
  FaRegFileLines,
  FaPenToSquare,
  FaEye,
  FaLock,
  FaCircleCheck,
  FaCalendar,
  FaLocationDot,
} from 'react-icons/fa6';

import { API_BASE_URL } from '@/lib/api';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

type ResearcherDetails = {
  id: number;
  email: string;
  role: string;
  status: string;
  is_published: boolean;
  project_count: number;
  publication_count: number;
  course_count: number;
  distinction_count: number;
  media_count: number;
  cv_url: string | null;
  projects: {
    id: number;
    title: string;
    year: number;
    description: string | null;
    budget: number | null;
    coauthor: string[];
  }[];
  publications: {
    id: number;
    title: string;
    year: number;
    journal: string | null;
    doi: string | null;
    coauthor: string[];
  }[];
  cours: {
    id: number;
    title: string;
    description: string | null;
    curricula: string | null;
  }[];
  distinctions: {
    id: number;
    year: number;
    title: string;
    description: string | null;
  }[];
  media_artefacts: {
    id: number;
    name: string;
    url: string;
    description: string | null;
  }[];
  academic_careers: {
    id: number;
    year: number;
    title_formation: string;
    diplome: string | null;
    description: string | null;
  }[];
  technical_skills: {
    id: number;
    name: string;
    level: number;
  }[];
  soft_skills: {
    id: number;
    name: string;
    level: number;
  }[];
  languages: {
    id: number;
    name: string;
    level: string;
    percent: number;
  }[];
  degrees: {
    id: number;
    title: string;
    institution: string;
    year: number;
    description: string;
  }[];
  experiences: {
    id: number;
    title: string;
    company: string;
    start_date: string;
    end_date: string;
    description: string;
  }[];
  profile: {
    first_name: string;
    last_name: string;

    gender: string;

    grade: string;
    specialite: string;
    diplome: string;

    bio: string;
    description: string;

    avatar: string;
    profile_picture: string;

    linkedin: string;
    whatsapp: string;
    twitter: string;
    github: string;
  } | null;
};

export default function ResearcherDetailsPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const params = useParams();

  const researcherId = params.id;

  const [loading, setLoading] = useState(true);
  const [researcher, setResearcher] =
    useState<ResearcherDetails | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const loadResearcher = async () => {
      try {
        const token = localStorage.getItem('access_token');

        const response = await fetch(
          `${API_BASE_URL}/admin/users/${researcherId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors du chargement');
        }

        const data = await response.json();
        console.log(data);
        setResearcher(data);
      } catch (error) {
        console.error(error);
        toast.error(t('error', language));
      } finally {
        setLoading(false);
      }
    };

    if (researcherId) {
      loadResearcher();
    }
  }, [researcherId, language]);

  const handlePublication = async () => {
    if (!researcher) return;

    try {
      const token = localStorage.getItem('access_token');

      const newPublishedState = !researcher.is_published;

      const response = await fetch(
        `${API_BASE_URL}/admin/users/${researcher.id}/publication?published=${newPublishedState}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || 'Erreur lors de la modification de la publication'
        );
      }

      setResearcher((prev) =>
        prev
          ? {
              ...prev,
              is_published: data.is_published,
            }
          : prev
      );

      toast.success(data.message);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la modification de la publication'
      );
    }
  };

  // ============================================================
  // ACTIVER / DÉSACTIVER LE CHERCHEUR
  // ============================================================
  const handleStatus = async () => {
    if (!researcher) return;

    const token = localStorage.getItem('access_token');

    if (!token) {
      toast.error('Vous devez être connecté');
      return;
    }

    const newActiveState = researcher.status !== 'active';

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/users/${researcher.id}/status?active=${newActiveState}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || 'Erreur lors de la modification du statut'
        );
      }

      setResearcher((prev) =>
        prev
          ? {
              ...prev,
              status: data.status,
            }
          : prev
      );

      toast.success(data.message);
    } catch (error) {
      console.error('Erreur statut chercheur :', error);

      toast.error(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la modification du statut'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {t('loading', language)}...
      </div>
    );
  }

  if (!researcher) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h2 className="text-2xl font-semibold">
          {t('researcher_not_found', language)}
        </h2>

        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {t('back', language)}
        </button>
      </div>
    );
  }

  const getAvatarSrc = () => {
    const avatarPath = researcher.profile?.profile_picture || researcher.profile?.avatar;
    if (avatarPath) {
      return `${API_BASE_URL}${avatarPath}`;
    }
    return "/images/default-avatar.png";
  };

  const translateLevel = (level: string) => {
    const levels: Record<string, { fr: string; en: string }> = {
      'Natif': { fr: 'Natif', en: 'Native' },
      'Courant': { fr: 'Courant', en: 'Fluent' },
      'Intermédiaire': { fr: 'Intermédiaire', en: 'Intermediate' },
      'Débutant': { fr: 'Débutant', en: 'Beginner' },
    };
    return levels[level]?.[language as 'fr' | 'en'] || level || 'Non spécifié';
  };

  const getSpecialites = () => {
    const specialites = researcher.profile?.specialite;
    if (!specialites) return [];
    return specialites.split(',').map(s => s.trim()).filter(Boolean);
  };

  const specialites = getSpecialites();

  const getProfileCompletion = () => {
    let completed = 0;
    const total = 8;
    if (researcher.profile?.first_name) completed++;
    if (researcher.profile?.last_name) completed++;
    if (researcher.profile?.bio) completed++;
    if (researcher.profile?.specialite) completed++;
    if (researcher.profile?.diplome) completed++;
    if (researcher.technical_skills?.length > 0) completed++;
    if (researcher.languages?.length > 0) completed++;
    if (researcher.profile?.profile_picture) completed++;
    return Math.round((completed / total) * 100);
  };

  const completion = getProfileCompletion();

  // Formatage des dates pour l'affichage
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Gestion des URLs sociales
  const getSocialUrl = (value: string | null | undefined, type: 'github' | 'linkedin' | 'twitter' | 'whatsapp') => {
    if (!value) return null;
    
    // Si c'est déjà une URL complète
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    switch (type) {
      case 'github':
        return `https://github.com/${value}`;
      case 'linkedin':
        // Si c'est déjà une URL linkedin complète
        if (value.includes('linkedin.com')) return value;
        return `https://linkedin.com/in/${value}`;
      case 'twitter':
        return `https://x.com/${value}`;
      case 'whatsapp':
        // Nettoyer le numéro (enlever les espaces, +, etc.)
        const clean = value.replace(/\s/g, '').replace(/^\+/, '');
        return `https://wa.me/${clean}`;
      default:
        return value;
    }
  };

  const githubUrl = getSocialUrl(researcher.profile?.github, 'github');
  const linkedinUrl = getSocialUrl(researcher.profile?.linkedin, 'linkedin');
  const twitterUrl = getSocialUrl(researcher.profile?.twitter, 'twitter');
  const whatsappUrl = getSocialUrl(researcher.profile?.whatsapp, 'whatsapp');

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">

      {/* ======================= HEADER ======================= */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-xl shadow-lg mb-6">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-2xl text-white/80 hover:text-white transition"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {researcher.profile?.first_name} {researcher.profile?.last_name}
              </h1>
              <p className="text-sm text-blue-100">
                {researcher.profile?.grade || researcher.role}
              </p>
              {specialites.length > 0 && (
                <p className="text-xs text-blue-200/80 mt-1 flex items-center gap-1">
                  <span>🧠</span> {specialites.join(' • ')}
                </p>
              )}
              {researcher.profile?.diplome && (
                <p className="text-xs text-blue-200/80">
                  🎓 {researcher.profile.diplome}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
              researcher.status === "active"
                ? "bg-green-500/30 text-green-100"
                : "bg-red-500/30 text-red-100"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {researcher.status === "active"
                ? t('active', language)
                : t('inactive', language)}
            </span>
            <button
              onClick={() => {
                if (researcher.profile) {
                  router.push(`/researcher/public/${researcher.id}`);
                } else {
                  toast.error("Profil du chercheur introuvable");
                }
              }}
              className="px-4 py-2 bg-white/15 text-white hover:bg-white/25 rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium flex items-center gap-2"
            >
              <FaEye className="w-4 h-4" />
              {t('view_profile', language)}
            </button>
            <button
              onClick={() => {
                router.push(`/researcher/dashboard/${researcher.id}`);
              }}
              className="px-4 py-2 bg-white/15 text-white hover:bg-white/25 rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium flex items-center gap-2"
            >
              <FaPenToSquare className="w-4 h-4" />
              {t('edit', language)}
            </button>
            <button
              onClick={handleStatus}
              className={`px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium flex items-center gap-2 ${
                researcher.status === 'active'
                  ? 'bg-white/15 text-white hover:bg-red-500/30'
                  : 'bg-green-500/20 text-green-100 hover:bg-green-500/30'
              }`}
            >
              <FaLock className="w-4 h-4" />
              {researcher.status === 'active'
                ? t('deactivate', language)
                : t('activate', language)}
            </button>
            <button
              onClick={handlePublication}
              className={`px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium flex items-center gap-2 ${
                researcher.is_published
                  ? "bg-red-500/20 text-red-100 hover:bg-red-500/30"
                  : "bg-green-500/20 text-green-100 hover:bg-green-500/30"
              }`}
            >
              {researcher.is_published ? (
                <>
                  <FaLock className="w-4 h-4" />
                  {t('unpublish', language)}
                </>
              ) : (
                <>
                  <FaCircleCheck className="w-4 h-4" />
                  {t('publish', language)}
                </>
              )}
            </button>
          </div>
        </div>
        {/* Jauge de complétude */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-blue-200">{t('profile_completion', language)}</span>
            <div className="flex-1 max-w-xs h-2 bg-blue-900/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            <span className="text-xs text-blue-200 font-medium">{completion}%</span>
          </div>
        </div>
      </div>

      {/* ======================= ONGLETS ======================= */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-1 px-4 md:px-6 overflow-x-auto">
          {[
            { id: "profile", label: `👤 ${t('profile', language)}` },
            { id: "cv", label: `📄 ${t('cv', language)}` },
            { id: "projects", label: `📁 ${t('projects_title', language)}` },
            { id: "publications", label: `📚 ${t('publications_title', language)}` },
            { id: "cours", label: `🎓 ${language === "fr" ? "Cours" : "Courses"}` },
            { id: "distinctions", label: `🏆 ${language === "fr" ? "Distinctions" : "Awards"}` },
            { id: "media", label: `🖼️ ${language === "fr" ? "Médias" : "Media"}` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-600 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ======================= CONTENU ======================= */}

      {/* Onglet Profil */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

          {/* COLONNE GAUCHE - Photo + Contact + Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {/* Bandeau bleu */}
              <div className="h-20 bg-gradient-to-r from-blue-600 to-blue-400"></div>
              
              <div className="flex justify-center -mt-12">
                <div className="relative">
                  <img
                    src={getAvatarSrc()}
                    alt="avatar"
                    className="w-[150px] h-[150px] rounded-full border-4 border-white object-cover shadow-xl ring-2 ring-blue-200"
                    onError={(e) => {
                      e.currentTarget.src = "/images/default-avatar.png";
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5 shadow-md">
                    <FaCircleCheck className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4 text-center">
                <h2 className="text-lg font-bold mt-2 flex items-center justify-center gap-1">
                  {researcher.profile?.first_name} {researcher.profile?.last_name}
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">✓ Vérifié</span>
                </h2>
                <p className="text-sm text-gray-500">{researcher.profile?.grade || researcher.role}</p>
                {specialites.length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">{specialites.join(' • ')}</p>
                )}
                <p className="text-xs text-gray-400 mt-1 break-all">{researcher.email}</p>

                {/* Statistiques avec curseur pointer */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className="bg-blue-50 rounded-xl p-2 border border-blue-200 transition-all duration-300 hover:scale-105 cursor-pointer shadow-sm">
                    <div className="text-2xl font-bold text-blue-700">{researcher.technical_skills?.length || 0}</div>
                    <div className="text-[8px] text-blue-600 font-medium uppercase tracking-wider">Compétences</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-2 border border-blue-200 transition-all duration-300 hover:scale-105 cursor-pointer shadow-sm">
                    <div className="text-2xl font-bold text-blue-700">{researcher.project_count || 0}</div>
                    <div className="text-[8px] text-blue-600 font-medium uppercase tracking-wider">Projets</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-2 border border-blue-200 transition-all duration-300 hover:scale-105 cursor-pointer shadow-sm">
                    <div className="text-2xl font-bold text-blue-700">{researcher.publication_count || 0}</div>
                    <div className="text-[8px] text-blue-600 font-medium uppercase tracking-wider">Publications</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-2 border border-blue-200 transition-all duration-300 hover:scale-105 cursor-pointer shadow-sm">
                    <div className="text-2xl font-bold text-blue-700">{researcher.course_count || 0}</div>
                    <div className="text-[8px] text-blue-600 font-medium uppercase tracking-wider">Cours</div>
                  </div>
                </div>

                {/* Contact avec icônes - gestion des URLs */}
                <div className="flex justify-center gap-2 mt-4">
                  {/* Email - toujours actif */}
                  <a
                    href={`mailto:${researcher.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all hover:scale-110"
                    title="Email"
                  >
                    <FaEnvelope className="w-5 h-5" />
                  </a>

                  {/* LinkedIn */}
                  {linkedinUrl ? (
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all hover:scale-110"
                      title="LinkedIn"
                    >
                      <FaLinkedin className="w-5 h-5" />
                    </a>
                  ) : (
                    <span className="w-11 h-11 flex items-center justify-center text-gray-300 cursor-default" title="Non renseigné">
                      <FaLinkedin className="w-5 h-5 opacity-40" />
                    </span>
                  )}

                  {/* GitHub */}
                  {githubUrl ? (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all hover:scale-110"
                      title="GitHub"
                    >
                      <FaGithub className="w-5 h-5" />
                    </a>
                  ) : (
                    <span className="w-11 h-11 flex items-center justify-center text-gray-300 cursor-default" title="Non renseigné">
                      <FaGithub className="w-5 h-5 opacity-40" />
                    </span>
                  )}

                  {/* Twitter/X */}
                  {twitterUrl ? (
                    <a
                      href={twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-50 rounded-full transition-all hover:scale-110"
                      title="Twitter / X"
                    >
                      <FaXTwitter className="w-5 h-5" />
                    </a>
                  ) : (
                    <span className="w-11 h-11 flex items-center justify-center text-gray-300 cursor-default" title="Non renseigné">
                      <FaXTwitter className="w-5 h-5 opacity-40" />
                    </span>
                  )}

                  {/* WhatsApp */}
                  {whatsappUrl ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all hover:scale-110"
                      title="WhatsApp"
                    >
                      <FaWhatsapp className="w-5 h-5" />
                    </a>
                  ) : (
                    <span className="w-11 h-11 flex items-center justify-center text-gray-300 cursor-default" title="Non renseigné">
                      <FaWhatsapp className="w-5 h-5 opacity-40" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE - Détails */}
          <div className="lg:col-span-3 space-y-3">

            {/* Bio */}
            {researcher.profile?.bio && (
              <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <h3 className="font-semibold text-base text-blue-800 mb-3 flex items-center gap-2 border-b border-blue-200 pb-2">
                  <FaComments className="w-4 h-4" /> {t('about_section', language)}
                </h3>
                <p className="text-sm text-gray-700">{researcher.profile.bio}</p>
                {researcher.profile?.description && (
                  <p className="text-sm text-gray-600 mt-1">{researcher.profile.description}</p>
                )}
              </div>
            )}

            {/* Informations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h3 className="font-semibold text-base text-blue-800 mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
                <FaInfo className="w-4 h-4" /> {t('personal_info', language)}
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-400 text-xs uppercase tracking-wider block">
                    🚻 {t('gender', language)}
                  </span>
                  <span className="text-gray-700 font-medium text-base">
                    {researcher.profile?.gender || "-"}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 text-xs uppercase tracking-wider block">
                    👤 {t('grade', language)}
                  </span>
                  <span className="text-gray-700 font-medium text-base">
                    {researcher.profile?.grade || "-"}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 text-xs uppercase tracking-wider block">
                    🧠 {t('domain', language)}
                  </span>
                  <span className="text-gray-700 font-medium text-base">
                    {researcher.profile?.specialite || "-"}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 text-xs uppercase tracking-wider block">
                    🎓 {t('degree', language)}
                  </span>
                  <span className="text-gray-700 font-medium text-base">
                    {researcher.profile?.diplome || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Compétences techniques */}
            {researcher.technical_skills && researcher.technical_skills.length > 0 && (
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <h3 className="font-semibold text-base text-blue-800 mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
                  <FaCode className="w-4 h-4" /> {t('technical_skills', language)}
                </h3>
                <div className="space-y-2 max-w-[80%]">
                  {researcher.technical_skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <div className="w-full max-w-[80%] h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Soft Skills */}
            {researcher.soft_skills && researcher.soft_skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <h3 className="font-semibold text-base text-blue-800 mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
                  <FaUser className="w-4 h-4" /> {t('soft_skills', language)}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {researcher.soft_skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium cursor-default transition hover:scale-105"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Langues */}
            {researcher.languages && researcher.languages.length > 0 && (
              <div className="bg-purple-50 rounded-xl border border-purple-100 p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <h3 className="font-semibold text-base text-blue-800 mb-3 flex items-center gap-2 border-b border-purple-200 pb-2">
                  <FaGlobe className="w-4 h-4" /> {t('languages_i_speak', language)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {researcher.languages.map((lang) => {
                    const flags: Record<string, string> = {
                      'Français': '🇫🇷',
                      'Anglais': '🇬🇧',
                      'Arabe': '🇸🇦',
                      'Chinois': '🇨🇳',
                      'Turc': '🇹🇷',
                      'Espagnol': '🇪🇸',
                      'Allemand': '🇩🇪',
                      'Italien': '🇮🇹',
                      'Portugais': '🇵🇹',
                      'Russe': '🇷🇺',
                      'Japonais': '🇯🇵',
                      'Coréen': '🇰🇷',
                    };
                    const flag = flags[lang.name] || '🌍';
                    return (
                      <div key={lang.id} className="flex items-center gap-2">
                        <span className="text-base">{flag}</span>
                        <span className="text-sm font-medium min-w-[70px]">{lang.name}</span>
                        <span className="text-xs text-gray-500 min-w-[70px]">{translateLevel(lang.level)}</span>
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
                          <div
                            className="h-1.5 bg-purple-600 rounded-full transition-all duration-500"
                            style={{ width: `${lang.percent || 50}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Diplômes + Expériences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Diplômes */}
              {researcher.degrees && researcher.degrees.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <h3 className="font-semibold text-base text-blue-800 mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
                    <FaGraduationCap className="w-4 h-4" /> {t('degrees_certifications', language)}
                  </h3>
                  <div className="space-y-4">
                    {researcher.degrees.map((degree) => (
                      <div key={degree.id} className="relative pl-4 border-l-2 border-blue-400 pb-4 last:pb-0">
                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                        <p className="font-semibold text-sm">{degree.title}</p>
                        {degree.institution && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FaLocationDot className="w-3 h-3" /> {degree.institution}
                          </p>
                        )}
                        {degree.year && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <FaCalendar className="w-3 h-3" /> {degree.year}
                          </p>
                        )}
                        {degree.description && <p className="text-xs text-gray-600 mt-1">{degree.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expériences */}
              {researcher.experiences && researcher.experiences.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <h3 className="font-semibold text-base text-blue-800 mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
                    <FaBriefcase className="w-4 h-4" /> {t('experience', language)}
                  </h3>
                  <div className="space-y-4">
                    {researcher.experiences.map((exp) => (
                      <div key={exp.id} className="relative pl-4 border-l-2 border-blue-400 pb-4 last:pb-0">
                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                        <p className="font-semibold text-sm">{exp.title}</p>
                        {exp.company && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FaLocationDot className="w-3 h-3" /> {exp.company}
                          </p>
                        )}
                        {(exp.start_date || exp.end_date) && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <FaCalendar className="w-3 h-3" /> {formatDate(exp.start_date)} {exp.end_date ? `— ${formatDate(exp.end_date)}` : ''}
                          </p>
                        )}
                        {exp.description && <p className="text-xs text-gray-600 mt-1">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Onglet CV */}
      {activeTab === "cv" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-xl font-bold mb-2">{t('cv_title', language)}</h3>
          <p className="text-gray-500 mb-4">{t('cv_description', language)}</p>
          {researcher.cv_url ? (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {/* ✅ BOUTON VOIR LE CV (MODIFIÉ) */}
              <button
                onClick={() =>
                  router.push(
                    `/admin/cv-viewer?userId=${researcher.id}`
                  )
                }
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition inline-block"
              >
                👁️ {t('view_cv', language)}
              </button>
              
              <a
                href={`${API_BASE_URL}/cv/download/${researcher.id}`}
                download
                className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition inline-block"
              >
                ⬇ {t('download', language)}
              </a>
            </div>
          ) : (
            <p className="text-gray-500">{t('no_cv', language)}</p>
          )}
        </div>
      )}

      {/* Onglet Projets */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          {researcher.projects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {t('no_projects', language)}
            </div>
          ) : (
            researcher.projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{project.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{project.description || t('no_description', language)}</p>
                  </div>
                  <span className="text-sm text-gray-500">{project.year}</span>
                </div>
                {project.coauthor && project.coauthor.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.coauthor.map((author, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {author}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Onglet Publications */}
      {activeTab === "publications" && (
        <div className="space-y-4">
          {researcher.publications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {t('no_publications', language)}
            </div>
          ) : (
            researcher.publications.map((pub) => (
              <div key={pub.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{pub.title}</h3>
                    {pub.journal && <p className="text-sm text-gray-600 mt-1">{t('journal', language)}: {pub.journal}</p>}
                    {pub.doi && <p className="text-sm text-gray-500">DOI: {pub.doi}</p>}
                  </div>
                  <span className="text-sm text-gray-500">{pub.year}</span>
                </div>
                {pub.coauthor && pub.coauthor.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {pub.coauthor.map((author, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {author}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Onglet Cours */}
      {activeTab === "cours" && (
        <div className="space-y-4">
          {!researcher.cours || researcher.cours.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {language === "fr" ? "Aucun cours enregistré." : "No courses registered."}
            </div>
          ) : (
            researcher.cours.map((cours) => (
              <div
                key={cours.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-blue-800">
                      {cours.title}
                    </h3>

                    {cours.description && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {language === "fr" ? "Description" : "Description"}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {cours.description}
                        </p>
                      </div>
                    )}

                    {cours.curricula && (
                      <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                          {language === "fr" ? "Curriculum" : "Curriculum"}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {cours.curricula}
                        </p>
                      </div>
                    )}
                  </div>

                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap">
                    #{cours.id}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Onglet Distinctions */}
      {activeTab === "distinctions" && (
        <div className="space-y-4">
          {!researcher.distinctions || researcher.distinctions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {language === "fr"
                ? "Aucune distinction enregistrée."
                : "No awards registered."}
            </div>
          ) : (
            researcher.distinctions.map((distinction) => (
              <div
                key={distinction.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-blue-800">
                      {distinction.title}
                    </h3>

                    {distinction.description && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {language === "fr" ? "Description" : "Description"}
                        </p>

                        <p className="text-sm text-gray-700 mt-1">
                          {distinction.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium whitespace-nowrap">
                    🏆 {distinction.year}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Onglet Media */}
      {activeTab === "media" && (
        <div className="space-y-4">
          {!researcher.media_artefacts || researcher.media_artefacts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {language === "fr"
                ? "Aucun média enregistré."
                : "No media registered."}
            </div>
          ) : (
            researcher.media_artefacts.map((media) => (
              <div
                key={media.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-blue-800">
                      {media.name}
                    </h3>

                    {media.description && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {language === "fr" ? "Description" : "Description"}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {media.description}
                        </p>
                      </div>
                    )}

                    {media.url && (
                      <div className="mt-4">
                        <a
                          href={media.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 text-sm font-medium"
                        >
                          🔗 {language === "fr" ? "Voir le média" : "View media"}
                        </a>
                      </div>
                    )}
                  </div>

                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium whitespace-nowrap">
                    #{media.id}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}