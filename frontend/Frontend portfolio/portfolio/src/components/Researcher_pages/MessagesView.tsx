'use client';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import toast from 'react-hot-toast';

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: number;
};

export default function MessagesView() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/researcher/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/researcher/messages/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(t('mark_as_read', language) || 'Message marqué comme lu');
      fetchMessages();
    } catch (error) {
      console.error('Erreur marquage lu:', error);
    }
  };

  if (loading) return <div className="text-center py-10">{t('loading', language)}</div>;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-6">{t('messages', language)}</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500">{t('no_messages', language)}</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`border rounded-lg p-4 ${msg.is_read ? 'bg-gray-50' : 'bg-white border-blue-300 shadow-sm'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{msg.name} ({msg.email})</p>
                  <p className="text-sm text-gray-500">{new Date(msg.created_at).toLocaleString()}</p>
                </div>
                {!msg.is_read && (
                  <button
                    onClick={() => markAsRead(msg.id)}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    {t('mark_as_read', language) || 'Marquer comme lu'}
                  </button>
                )}
              </div>
              <p className="mt-2 text-gray-700">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}