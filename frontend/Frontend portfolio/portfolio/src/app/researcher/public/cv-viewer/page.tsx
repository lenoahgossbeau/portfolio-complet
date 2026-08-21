'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

function ViewerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();

  const userId = searchParams.get('userId');

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError(t('no_cv_to_display', language));
      return;
    }

    let objectUrl: string | null = null;

    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/cv-proxy?userId=${encodeURIComponent(userId)}&format=json`,
          {
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        const result = await response.json();

        if (!result.data) {
          throw new Error('Les données du PDF sont absentes.');
        }

        const binaryString = window.atob(result.data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], {
          type: 'application/pdf',
        });

        objectUrl = URL.createObjectURL(blob);

        setPdfUrl(objectUrl);
      } catch (err) {
        console.error('Erreur affichage CV:', err);
        setError(t('cv_display_error', language));
      } finally {
        setLoading(false);
      }
    };

    loadPdf();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [userId, language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">
          {t('cv_loading', language)}
        </p>
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600 text-lg">
          {error || t('no_cv_to_display', language)}
        </p>

        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
        >
          {t('back', language)}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">

      <div className="bg-white shadow px-6 py-4 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            {t('cv_preview_title', language)}
          </h1>

          <p className="text-gray-500">
            {t('cv_preview_description', language)}
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
          >
            {t('back', language)}
          </button>

          <a
            href={pdfUrl}
            download="CV.pdf"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {t('download', language)}
          </a>

        </div>
      </div>

      <div className="flex-1 p-4">

        <iframe
          src={pdfUrl}
          className="w-full h-[calc(100vh-120px)] rounded-lg bg-white"
          title="CV"
        />

      </div>

    </div>
  );
}

export default function CVViewerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">
            {t('loading', 'fr')}
          </p>
        </div>
      }
    >
      <ViewerContent />
    </Suspense>
  );
}