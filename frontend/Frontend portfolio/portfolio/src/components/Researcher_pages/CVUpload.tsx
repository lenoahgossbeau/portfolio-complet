'use client';

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import { API_BASE_URL } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CVUpload() {
  const { language } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.type !== 'application/pdf') {
        toast.error('Seuls les fichiers PDF sont acceptés');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(`${API_BASE_URL}/cv/upload-cv`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          data.message || t('cv_upload_success', language)
        );

        setSelectedFile(null);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(
          data.detail || t('cv_upload_error', language)
        );
      }
    } catch (error) {
      toast.error('Erreur réseau');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCV = async () => {
    if (
      !window.confirm(
        t('delete_cv_confirm', language)
      )
    ) {
      return;
    }

    setDeleting(true);

    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(
        `${API_BASE_URL}/cv/delete-cv`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          t('cv_delete_success', language)
        );

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(
          data.detail || t('delete_error', language)
        );
      }
    } catch (error) {
      toast.error(t('network_error', language));
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
          id="cvFile"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <label
          htmlFor="cvFile"
          className="px-4 py-2 border rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
        >
          {t('choose_file', language)}
        </label>

        <span className="text-sm text-gray-600">
          {selectedFile
            ? selectedFile.name
            : t('no_file_chosen', language)}
        </span>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className={`px-4 py-2 rounded text-white ${
            !selectedFile || uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Upload...' : t('upload', language)}
        </button>

        <button
          onClick={handleDeleteCV}
          disabled={deleting}
          className="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700"
        >
          {deleting
            ? 'Suppression...'
            : t('delete_cv', language)}
        </button>
      </div>
    </div>
  );
}