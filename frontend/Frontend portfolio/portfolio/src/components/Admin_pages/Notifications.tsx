'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

type Props = {
  subscriptions: any[];
};

export default function Notifications({ subscriptions }: Props) {
  const { language } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [expiringSoon, setExpiringSoon] = useState<any[]>([]);

  useEffect(() => {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    const expiring = subscriptions.filter(sub => {
      const endDate = new Date(sub.end_date);
      return endDate >= today && endDate <= thirtyDaysLater;
    });

    setExpiringSoon(expiring);
  }, [subscriptions]);

  const hasNotifications = expiringSoon.length > 0;

  if (!hasNotifications) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative bg-yellow-500 text-white px-3 py-2 rounded-full hover:bg-yellow-600 transition"
      >
        🔔
        {hasNotifications && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {expiringSoon.length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-3 border-b bg-gray-50 rounded-t-lg">
            <h3 className="font-semibold">{t('notifications', language) || 'Notifications'}</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {expiringSoon.map(sub => (
              <div key={sub.id} className="p-3 border-b hover:bg-gray-50">
                <p className="text-sm font-medium">{t('subscription_expiring', language)}</p>
                <p className="text-xs text-gray-500">
                  {t('profile_id', language)}: {sub.profile_id} - 
                  {t('end_date', language)}: {sub.end_date}
                </p>
              </div>
            ))}
          </div>
          <div className="p-2 border-t bg-gray-50 rounded-b-lg">
            <button className="text-xs text-blue-600 hover:underline">
              {t('view_all', language)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}