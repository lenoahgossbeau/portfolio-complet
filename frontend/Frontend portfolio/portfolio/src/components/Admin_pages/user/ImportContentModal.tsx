'use client';
import { useState, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/lib/api';

type Props = {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
};

export default function ImportContentModal({ userId, isOpen, onClose, onImportComplete }: Props) {
  const { language } = useLanguage();
  const langKey = language.toLowerCase(); // 👈 TRÈS IMPORTANT

  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [publicationsFile, setPublicationsFile] = useState<File | null>(null);
  const [projectsFile, setProjectsFile] = useState<File | null>(null);

  const cvInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const publicationsInputRef = useRef<HTMLInputElement>(null);
  const projectsInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('bio', bio);
    if (cvFile) formData.append('cv', cvFile);
    if (photoFile) formData.append('photo', photoFile);
    if (publicationsFile) formData.append('publications', publicationsFile);
    if (projectsFile) formData.append('projects', projectsFile);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/import-content`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        toast.success(t('import_success', langKey));
        onImportComplete();
        onClose();
        setBio('');
        setCvFile(null);
        setPhotoFile(null);
        setPublicationsFile(null);
        setProjectsFile(null);
      } else {
        const error = await response.json();
        toast.error(error.detail || t('import_error', langKey));
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(t('network_error', langKey));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('import_title', langKey)}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('bio', langKey)}</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('bio_placeholder', langKey)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cv', langKey)}</label>
            <input
              type="file"
              ref={cvInputRef}
              accept=".pdf"
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => cvInputRef.current?.click()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              {t('choose_file', langKey)}
            </button>
            {cvFile && <span className="ml-2 text-sm text-gray-600">{cvFile.name}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('photo', langKey)}</label>
            <input
              type="file"
              ref={photoInputRef}
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              {t('choose_file', langKey)}
            </button>
            {photoFile && <span className="ml-2 text-sm text-gray-600">{photoFile.name}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('publications', langKey)}</label>
            <input
              type="file"
              ref={publicationsInputRef}
              accept=".json"
              onChange={(e) => setPublicationsFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => publicationsInputRef.current?.click()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              {t('choose_file', langKey)}
            </button>
            {publicationsFile && <span className="ml-2 text-sm text-gray-600">{publicationsFile.name}</span>}
            <p className="text-xs text-gray-500 mt-1">{t('publications_format', langKey)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('projects', langKey)}</label>
            <input
              type="file"
              ref={projectsInputRef}
              accept=".json"
              onChange={(e) => setProjectsFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => projectsInputRef.current?.click()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              {t('choose_file', langKey)}
            </button>
            {projectsFile && <span className="ml-2 text-sm text-gray-600">{projectsFile.name}</span>}
            <p className="text-xs text-gray-500 mt-1">{t('projects_format', langKey)}</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              {t('cancel', langKey)}
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50">
              {loading ? t('importing', langKey) : t('import', langKey)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}