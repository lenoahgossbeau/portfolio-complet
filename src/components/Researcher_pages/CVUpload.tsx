'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import { API_BASE_URL, fetchWithAuth } from '@/lib/api';
import toast from 'react-hot-toast';

interface CVUploadProps {
  cvUrl?: string | null;
  onCVUpdated?: () => void;
}

export default function CVUpload({ cvUrl, onCVUpdated }: CVUploadProps = {}) {
  const { language } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentCvUrl, setCurrentCvUrl] = useState<string | null>(cvUrl ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetFileInput = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const loadCurrentCV = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/cv/me`);

      if (!response.ok) return;

      const data = await response.json();

      setCurrentCvUrl(data.cv_url || null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCurrentCV();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.type !== 'application/pdf') {
        toast.error(t('cv_pdf_only', language) || 'Seuls les fichiers PDF sont acceptés');
        resetFileInput();
        return;
      }

      // Vérification de la taille (5 MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('cv_size_error', language) || 'Le fichier ne doit pas dépasser 5 MB');
        resetFileInput();
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error(t('cv_select_file', language) || 'Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/cv/upload-cv`, {
        method: "POST",
        body: formData,
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok && data.success) {
        toast.success(
          data.message || t('cv_upload_success', language)
        );

        resetFileInput();
        await loadCurrentCV();
        onCVUpdated?.();
      } else {
        const errorMessage =
          typeof data.detail === "string"
            ? data.detail
            : data.detail?.[0]?.msg || t("cv_upload_error", language);

        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error(t('network_error', language) || 'Erreur réseau');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCV = async () => {
    if (!currentCvUrl) {
      toast.error(t('no_cv_to_delete', language) || 'Aucun CV à supprimer');
      return;
    }

    if (!window.confirm(t('delete_cv_confirm', language) || 'Supprimer ce CV ?')) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/cv/delete-cv`, {
        method: "DELETE",
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok && data.success) {
        toast.success(
          t('cv_delete_success', language)
        );

        resetFileInput();
        setCurrentCvUrl(null);
        onCVUpdated?.();
      } else {
        const errorMessage =
          typeof data.detail === "string"
            ? data.detail
            : data.detail?.[0]?.msg || t("delete_error", language);

        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error(t('network_error', language) || 'Erreur réseau');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-3">
        {t('upload_cv', language)}
      </h3>

      <div className="flex items-center gap-4 flex-wrap">
        <input
          ref={inputRef}
          id="cvFile"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <label
          htmlFor="cvFile"
          className="px-4 py-2 border rounded cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
        >
          {t('choose_file', language)}
        </label>

        <span className="text-sm text-gray-600 truncate max-w-[200px]">
          {selectedFile
            ? selectedFile.name
            : t('no_file_chosen', language)}
        </span>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className={`px-4 py-2 rounded text-white transition ${
            !selectedFile || uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading 
            ? t('uploading', language) || 'Upload...' 
            : t('upload', language)}
        </button>

        {currentCvUrl && (
          <button
            onClick={handleDeleteCV}
            disabled={deleting}
            className={`px-4 py-2 rounded text-white transition ${
              deleting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {deleting
              ? t('deleting', language) || 'Suppression...'
              : t('delete_cv', language)}
          </button>
        )}
      </div>

      {currentCvUrl && (
        <div className="mt-3 text-sm text-green-600">
          ✅ {t('cv_exists', language) || 'CV actuellement téléversé'}
        </div>
      )}
    </div>
  );
}