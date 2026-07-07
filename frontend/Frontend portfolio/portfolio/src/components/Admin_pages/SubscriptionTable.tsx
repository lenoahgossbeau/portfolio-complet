<<<<<<< HEAD
import { Subscription } from "./types";

type Props = {
  subscriptions: Subscription[];
};

export default function SubscriptionTable({ subscriptions }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b border-[#ADADAD]">
          <tr className="text-left text-[#999999]">
            <th className="p-4">Username</th>
            <th>Email</th>
            <th>Total Amount</th>
            <th>Started At</th>
            <th>Next Billing Date</th>
          </tr>
        </thead>

        <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No subscription yet
                </td>
              </tr>
            ) : (
                subscriptions.map((sub) => (
                    <tr key={sub.id} className=" text-left border-b border-[#ADADAD] last:border-none text-sm">
                    <td className="p-4 font-medium">{sub.username}</td>
                    <td>{sub.email}</td>
                    <td>${sub.amount.toFixed(2)}</td>

                    <td>
                        <div className="flex flex-col text-sm space-y-0">
                        <div className="flex gap-1">
                            <span className="text-[#9F9F9F] ">Date:</span>
                            <span className="text-gray-700">{formatDate(sub.startedAt)}</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="text-[#9F9F9F] ">Time:</span>
                            <span className="text-gray-700">{formatTime(sub.startedAt)}</span>
                        </div>
                        </div>
                    </td>

                    <td>
                        <div className="flex flex-col text-sm space-y-0">
                        <div className="flex gap-1">
                            <span className="text-[#9F9F9F] ">Date:</span>
                            <span className="text-gray-700">{formatDate(sub.nextBillingDate)}</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="text-[#9F9F9F] ">Time:</span>
                            <span className="text-gray-700">{formatTime(sub.nextBillingDate)}</span>
                        </div>
                        </div>
                    </td>

                    </tr>
                ))
            )}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(date: string) {
  const d = new Date(date);
  return `${d.toDateString()}`;
}

function formatTime(date: string) {
  const d = new Date(date);
  return `${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}
=======
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/lib/api';
import EditSubscriptionModal from './subscriptions/EditSubscriptionModal';

// Type local pour éviter les conflits
type Subscription = {
  id: string | number;
  profile_id: string | number;
  start_date: string;
  end_date: string;
  type: string;
  payment_method: string;
  amount?: number;
};

type Props = {
  subscriptions: Subscription[];
  onSubscriptionUpdated?: () => void;
};

// Fonction pour formater les dates de manière uniforme
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  // Si la date contient déjà l'heure, on la garde
  if (dateString.includes(' ')) {
    return dateString;
  }
  // Sinon, on ajoute l'heure 00:00:00 pour uniformiser
  return `${dateString} 00:00:00`;
};

// Fonctions de traduction pour les valeurs backend
const translateType = (type: string, language: string) => {
  const typeMap: Record<string, { fr: string; en: string }> = {
    'Premium': { fr: 'Premium', en: 'Premium' },
    'Standard': { fr: 'Standard', en: 'Standard' },
    'Basic': { fr: 'Basique', en: 'Basic' },
  };
  return typeMap[type]?.[language] || type;
};

const translatePaymentMethod = (method: string, language: string) => {
  const methodMap: Record<string, { fr: string; en: string }> = {
    'Carte bancaire': { fr: 'Carte bancaire', en: 'Credit card' },
    'Visa': { fr: 'Visa', en: 'Visa' },
    'Mastercard': { fr: 'Mastercard', en: 'Mastercard' },
    'PayPal': { fr: 'PayPal', en: 'PayPal' },
    'Virement': { fr: 'Virement', en: 'Bank transfer' },
  };
  return methodMap[method]?.[language] || method;
};

export default function SubscriptionTable({ subscriptions, onSubscriptionUpdated }: Props) {
  const { language } = useLanguage();
  const [filterType, setFilterType] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const uniqueTypes = [...new Set(subscriptions.map(s => s.type))];

  const filteredSubscriptions = subscriptions.filter(sub => {
    let match = true;
    if (filterType && sub.type !== filterType) match = false;
    if (filterStartDate && sub.start_date < filterStartDate) match = false;
    if (filterEndDate && sub.end_date > filterEndDate) match = false;
    return match;
  });

  const resetFilters = () => {
    setFilterType('');
    setFilterStartDate('');
    setFilterEndDate('');
  };

  const handleSubscriptionUpdated = () => {
    if (onSubscriptionUpdated) {
      onSubscriptionUpdated();
    }
    setIsEditModalOpen(false);
    setEditingSubscription(null);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm(t('delete_confirm', language))) return;
    
    setDeletingId(id);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/admin/subscriptions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        toast.success(t('delete_success', language));
        if (onSubscriptionUpdated) {
          onSubscriptionUpdated();
        }
      } else {
        toast.error(t('delete_error', language));
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(t('delete_error', language));
    } finally {
      setDeletingId(null);
    }
  };

  if (subscriptions.length === 0) {
    return <div className="text-center py-4 text-gray-400">{t('no_subscriptions', language)}</div>;
  }

  return (
    <div>
      <div className="bg-gray-50 p-4 rounded-lg mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('type', language)}</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">{t('all', language) || 'Tous'}</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>{translateType(type, language)}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('start_date', language)}</label>
          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('end_date', language)}</label>
          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm"
        >
          {t('reset', language) || 'Réinitialiser'}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#ADADAD]">
            <tr className="text-left text-[#999999]">
              <th className="p-4">{t('id', language)}</th>
              <th>{t('profile_id', language)}</th>
              <th>{t('start_date', language)}</th>
              <th>{t('end_date', language)}</th>
              <th>{t('type', language)}</th>
              <th>{t('payment_method', language)}</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  {t('no_subscriptions', language)}
                </td>
              </tr>
            ) : (
              filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className="text-left border-b border-[#ADADAD] last:border-none text-sm">
                  <td className="p-4 font-medium">{sub.id}</td>
                  <td className="p-4">{sub.profile_id}</td>
                  <td className="p-4">{formatDate(sub.start_date)}</td>
                  <td className="p-4">{formatDate(sub.end_date)}</td>
                  <td className="p-4">{translateType(sub.type, language)}</td>
                  <td className="p-4">{translatePaymentMethod(sub.payment_method, language)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingSubscription(sub);
                          setIsEditModalOpen(true);
                        }}
                        className="text-yellow-600 hover:text-yellow-800 transition"
                        title={t('edit', language)}
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        disabled={deletingId === sub.id}
                        className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                        title={t('delete', language)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="text-sm text-gray-500 mt-4 text-center">
        {filteredSubscriptions.length} / {subscriptions.length} {t('subscriptions', language)}
      </div>

      <EditSubscriptionModal
        subscription={editingSubscription}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingSubscription(null);
        }}
        onUpdated={handleSubscriptionUpdated}
      />
    </div>
  );
}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
