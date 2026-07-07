'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { API_BASE_URL } from '@/lib/api';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

// Composant qui utilise useSearchParams (encapsulé dans Suspense)
function ActivateContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(language === 'fr' ? 'Token d\'activation manquant' : 'Missing activation token');
      return;
    }

    const activateAccount = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/activate?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(language === 'fr' ? 'Votre compte a été activé avec succès !' : 'Your account has been activated successfully!');
          // Rediriger vers la page de connexion après 3 secondes
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.detail || (language === 'fr' ? 'Erreur lors de l\'activation du compte' : 'Error activating account'));
        }
      } catch (error) {
        setStatus('error');
        setMessage(language === 'fr' ? 'Erreur réseau. Veuillez réessayer.' : 'Network error. Please try again.');
      }
    };

    activateAccount();
  }, [token, router, language]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        
        {status === 'loading' && (
          <>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">{language === 'fr' ? 'Activation en cours...' : 'Activating...'}</h2>
            <p className="text-gray-600">{language === 'fr' ? 'Veuillez patienter...' : 'Please wait...'}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">{language === 'fr' ? 'Compte activé !' : 'Account Activated!'}</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500">{language === 'fr' ? 'Redirection vers la connexion...' : 'Redirecting to login...'}</p>
            <Link
              href="/auth/login"
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {language === 'fr' ? 'Se connecter maintenant' : 'Login now'}
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">{language === 'fr' ? 'Erreur d\'activation' : 'Activation Error'}</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              href="/auth/register"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {language === 'fr' ? 'Créer un compte' : 'Create an account'}
            </Link>
          </>
        )}
        
      </div>
    </div>
  );
}

// Page principale avec Suspense boundary
export default function ActivatePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Chargement...</h2>
            <p className="text-gray-600">Veuillez patienter...</p>
          </div>
        </div>
      }>
        <ActivateContent />
      </Suspense>
    </>
  );
}