'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import Navbar from '@/components/Navbar';
import { API_BASE_URL } from '@/lib/api';

export default function RegisterPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError(t("passwords_not_match", language));
      setLoading(false);
      return;
    }

    try {
      // 1. Inscription - URL CORRIGÉE (sans username)
      const response = await fetch(`${API_BASE_URL}/users/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          role: "researcher",
          status: "pending",
          language: language
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || t("registration_error", language)
        );
      }

      // 2. Demander l'envoi de l'email d'activation
      const activationRes = await fetch(`${API_BASE_URL}/admin/users/activation-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          language: language 
        })
      });

      if (activationRes.ok) {
        setSuccess(t("registration_success", language));
        
        // Vider le formulaire
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          first_name: '',
          last_name: ''
        });
      } else {
        setSuccess(t("registration_success_activate", language));
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold text-center mb-8">
          {t('register', language)}
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">
              {t("first_name", language)}
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              {t("last_name", language)}
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.last_name}
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              {t('email', language)}
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              {t('password', language)}
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              {t("confirm_password", language)}
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading 
              ? t("registering", language)
              : t('register', language)}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          {t("already_have_account", language)}{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            {t("login", language)}
          </Link>
        </p>
      </div>
    </main>
  );
}