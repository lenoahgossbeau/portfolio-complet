'use client';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import toast from 'react-hot-toast';

type AuditLog = {
  id: number;
  user_id: number | null;
  user_role: string;
  action_description: string;
  date: string;
};

export default function AuditLogs() {
  const { language } = useLanguage();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/admin/audit/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotal(data.total);
      } else {
        toast.error('Erreur chargement logs');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">{t('loading', language)}</div>;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">{t('audit', language)} ({total})</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr className="text-left">
              <th className="p-3">ID</th>
              <th className="p-3">{t('user', language)} ID</th>
              <th className="p-3">{t('role', language)}</th>
              <th className="p-3">{t('action', language)}</th>
              <th className="p-3">{t('date', language)}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{log.id}</td>
                <td className="p-3">{log.user_id ?? '-'}</td>
                <td className="p-3">{log.user_role}</td>
                <td className="p-3">{log.action_description}</td>
                <td className="p-3">{new Date(log.date).toLocaleString()}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  {t('no_data', language)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}