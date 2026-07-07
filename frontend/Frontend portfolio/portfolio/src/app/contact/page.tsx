'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    recipient_email: ''  // 👈 NOUVEAU CHAMP
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/contact/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de l\'envoi');
      }

      toast.success('Message envoyé avec succès !');
      setFormData({ name: '', email: '', message: '', recipient_email: '' });

    } catch (error: any) {
      console.error('Erreur:', error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          {t('get_in_touch', language)}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Nom</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Votre email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email du chercheur destinataire</label>
            <input
              type="email"
              required
              value={formData.recipient_email}
              onChange={(e) => setFormData({ ...formData, recipient_email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ex: chercheur@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Message</label>
            <textarea
              rows={6}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#002754] text-white py-3 rounded-lg hover:bg-[#001B40] transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Envoi...' : (t('send', language) || 'Envoyer')}
          </button>
        </form>
      </div>
    </main>
  );
}