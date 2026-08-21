'use client';

import { useState } from "react";
import EditSecurityInfoModal from "./editSecurityInfoModal";
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import { API_BASE_URL } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SecurityCard() {
  const { language } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(t('password_mismatch', language));
      return;
    }

    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          data.message || t('password_updated', language)
        );

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsEditing(false);
      } else {
        toast.error(
          data.detail || t('password_change_error', language)
        );
      }
    } catch (error) {
      console.error('Erreur changement de mot de passe:', error);
      toast.error(t('network_error', language));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 h-35">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-base font-medium text-gray-700">
          {t('security', language)}
        </h2>

        <button
          onClick={() => setIsEditing(true)}
          className="cursor-pointer text-gray-500 hover:text-gray-700 text-sm"
        >
          ✏️
        </button>
      </div>

      <EditSecurityInfoModal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
      />

      <p className="text-sm mt-7">
        {t('password', language)}:
        <span className="ml-1 tracking-wider">
          ••••••••••••
        </span>
      </p>
    </div>
  );
}