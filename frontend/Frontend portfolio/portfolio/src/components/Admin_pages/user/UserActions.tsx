'use client';

import { FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

import {
  deleteUser,
  changeUserStatus,
} from '@/lib/adminApi';

type User = {
  id: number;
  email: string;
  role: string;
  status: string;
};

type Props = {
  user: User;
  onRefresh: () => Promise<void>;
  onImport: (userId: number) => void;
  onDetail: (userId: number) => void;
};

export default function UserActions({
  user,
  onRefresh,
  onImport,
  onDetail,
}: Props) {
  const { language } = useLanguage();

  const handleDelete = async () => {
    if (!confirm(t('delete_user_confirm', language))) return;

    const success = await deleteUser(user.id);

    if (success) {
      toast.success(t('delete_user_success', language));
      await onRefresh();
    } else {
      toast.error(t('delete_user_error', language));
    }
  };

  const handleChangeStatus = async (active: boolean) => {
    const success = await changeUserStatus(user.id, active);

    if (success) {
      toast.success(
        active
          ? t('user_activated_success', language)
          : t('user_deactivated_success', language)
      );

      await onRefresh();
    } else {
      toast.error(
        active
          ? t('activate_user_error', language)
          : t('deactivate_user_error', language)
      );
    }
  };

  return (
    <div className="flex items-center gap-2 min-w-max">
      {user.status === "active" ? (
        <>
          <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[11px] font-medium">
            {t('active', language)}
          </span>

          <button
            onClick={() => handleChangeStatus(false)}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs"
          >
            {t('deactivate', language)}
          </button>
        </>
      ) : (
        <>
          <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-medium">
            {t('inactive', language)}
          </span>

          <button
            onClick={() => handleChangeStatus(true)}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs"
          >
            {t('activate', language)}
          </button>
        </>
      )}

      <button
        onClick={() => onImport(user.id)}
        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs"
      >
        {t('import', language)}
      </button>

      <button
        onClick={() => onDetail(user.id)}
        className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-xs"
      >
        {t('detail', language)}
      </button>

      <button
        onClick={handleDelete}
        className="p-2 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );
}