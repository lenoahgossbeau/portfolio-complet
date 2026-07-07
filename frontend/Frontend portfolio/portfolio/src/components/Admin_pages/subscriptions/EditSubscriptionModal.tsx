'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/lib/api';

type Subscription = {
  id: number;
  profile_id: number;
  start_date: string;
  end_date: string;
  type: string;
  payment_method: string;
};

type Props = {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
};

export default function EditSubscriptionModal({ subscription, isOpen, onClose, onUpdated }: Props) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    profile_id: '',
    start_date: '',
    end_date: '',
    type: 'Premium',
    payment_method: 'Carte bancaire'
  });

  useEffect(() => {
    if (subscription) {
      setFormData({
        profile_id: subscription.profile_id.toString(),
        start_date: subscription.start_date.split('T')[0],
        end_date: subscription.end_date.split('T')[0],
        type: subscription.type,
        payment_method: subscription.payment_method
      });
    }
  }, [subscription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/admin/subscriptions/${subscription?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          profile_id: parseInt(formData.profile_id),
          start_date: formData.start_date,
          end_date: formData.end_date,
          type: formData.type,
          payment_method: formData.payment_method
        })
      });
      
      if (response.ok) {
        toast.success(t('subscription_updated', language));
        onUpdated();
        onClose();
      } else {
        const error = await response.json();
        toast.error(`${t('error', language)}: ${error.detail || t('update_error', language)}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(t('network_error', language));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !subscription) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('edit_subscription', language)} #{subscription.id}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('profile_id_label', language)} *
            </label>
            <input
              type="number"
              required
              value={formData.profile_id}
              onChange={(e) => setFormData({...formData, profile_id: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('start_date_label', language)} *
            </label>
            <input
              type="date"
              required
              value={formData.start_date}
              onChange={(e) => setFormData({...formData, start_date: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('end_date_label', language)} *
            </label>
            <input
              type="date"
              required
              value={formData.end_date}
              onChange={(e) => setFormData({...formData, end_date: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('type_label', language)}
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Premium">{t('premium', language)}</option>
              <option value="Standard">{t('standard', language)}</option>
              <option value="Basic">{t('basic', language)}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('payment_method_label', language)}
            </label>
            <select
              value={formData.payment_method}
              onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Carte bancaire">{t('credit_card', language)}</option>
              <option value="PayPal">{t('paypal', language)}</option>
              <option value="Virement">{t('bank_transfer', language)}</option>
              <option value="Visa">{t('visa', language)}</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              {t('cancel', language)}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition disabled:opacity-50"
            >
              {loading ? t('updating', language) : t('edit', language)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}