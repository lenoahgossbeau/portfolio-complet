'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import { API_BASE_URL } from '@/lib/api';
import toast from 'react-hot-toast';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateResearcherModal({
  isOpen,
  onClose,
  onCreated,
}: Props) {
  const { language } = useLanguage();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'researcher',
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.password
    ) {
      toast.error(t('all_fields_required', language));
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(`${API_BASE_URL}/admin/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t('researcher_created_success', language));

        setForm({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          role: 'researcher',
        });

        onClose();
        onCreated();
      } else {
        toast.error(
          data.detail || t('researcher_creation_error', language)
        );
      }
    } catch (error) {
      toast.error(t('network_error', language));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-4">
          {t('create_researcher', language)}
        </h2>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              {t('first_name', language)} *
            </label>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('first_name', language)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              {t('last_name', language)} *
            </label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('last_name', language)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              {t('password', language)} *
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              {t('role', language)}
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="researcher">
                {t('researcher', language)}
              </option>
              <option value="admin">
                {t('administrator', language)}
              </option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            {t('cancel', language)}
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 px-4 py-2 rounded-lg text-sm text-white transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading
              ? t('creating', language)
              : t('create', language)}
          </button>
        </div>
      </div>
    </div>
  );
}