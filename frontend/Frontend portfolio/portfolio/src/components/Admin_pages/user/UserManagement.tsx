'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';
import { API_BASE_URL } from '@/lib/api';
import ImportContentModal from './ImportContentModal';
import AccountCard from "../AccountCard"; // ✅ CORRIGÉ

type User = {
  id: number;
  email: string;
  role: string;
  status: string;
  profile: {
    first_name: string | null;
    last_name: string | null;
  } | null;
};

export default function UserManagement() {
  const { language } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [changingRole, setChangingRole] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<{ [key: number]: string }>({});
  const [importUserId, setImportUserId] = useState<number | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const getCurrentUserId = (): number | null => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub ? parseInt(payload.sub) : null;
    } catch {
      return null;
    }
  };

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/admin/users/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Erreur API');
      }

      const data = await response.json();
      console.log('Données reçues:', data);

      if (data && Array.isArray(data.users)) {
        setUsers(data.users);
        const initialRoles: { [key: number]: string } = {};
        data.users.forEach((user: User) => {
          initialRoles[user.id] = user.role;
        });
        setSelectedRole(initialRoles);
      } else if (Array.isArray(data)) {
        setUsers(data);
        const initialRoles: { [key: number]: string } = {};
        data.forEach((user: User) => {
          initialRoles[user.id] = user.role;
        });
        setSelectedRole(initialRoles);
      } else {
        console.error('Format de données inattendu:', data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeRole = async (userId: number, newRole: string) => {
    const currentUserId = getCurrentUserId();

    if (userId === currentUserId && newRole !== 'super_admin') {
      const confirm = window.confirm(`${t('role_warning', language)}\n\n${t('role_warning_continue', language)}`);
      if (!confirm) return;
    }

    setChangingRole(userId);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        await loadUsers();
        toast.success(t('role_updated', language));

        if (userId === currentUserId && newRole !== 'super_admin') {
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
      } else {
        const error = await response.json();
        toast.error(`${t('error', language)}: ${error.detail || t('role_update_error', language)}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(t('network_error', language));
    } finally {
      setChangingRole(null);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const currentUserId = getCurrentUserId();

    if (userId === currentUserId) {
      toast.error(t('cannot_delete_self', language));
      return;
    }

    if (!confirm(t('delete_user_confirm', language))) return;

    setDeletingId(userId);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success(t('delete_user_success', language));
        await loadUsers();
      } else {
        const error = await response.json();
        toast.error(error.detail || t('delete_user_error', language));
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(t('delete_user_error', language));
    } finally {
      setDeletingId(null);
    }
  };

  const openImportModal = (userId: number) => {
    setImportUserId(userId);
    setIsImportModalOpen(true);
  };

  const translateRole = (role: string) => {
    const roleMap: Record<string, { fr: string; en: string }> = {
      super_admin: { fr: 'Super Admin', en: 'Super Admin' },
      admin: { fr: 'Administrateur', en: 'Admin' },
      researcher: { fr: 'Chercheur', en: 'Researcher' },
      user: { fr: 'Utilisateur', en: 'User' }
    };
    return roleMap[role]?.[language.toLowerCase()] || role;
  };

  if (loading) {
    return <div className="text-center py-10">{t('loading', language)}</div>;
  }

  if (users.length === 0) {
    return <div className="text-center py-10 text-gray-500">{t('no_users', language)}</div>;
  }

  return (
    <div className="mt-8 mb-20 bg-white rounded-xl shadow overflow-hidden">
      <h2 className="text-xl font-semibold p-4 border-b bg-gray-50">{t('user_management', language)}</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-3">{t('id', language)}</th>
              <th className="p-3">{t('email', language)}</th>
              <th className="p-3">{t('name', language)}</th>
              <th className="p-3">{t('current_role', language)}</th>
              <th className="p-3">{t('new_role', language)}</th>
              <th className="p-3">{t('action', language)}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-3">{user.id}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.profile?.first_name || ''} {user.profile?.last_name || ''}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'super_admin'
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'admin'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {translateRole(user.role)}
                  </span>
                </td>
                <td className="p-3">
                  <select
                    value={selectedRole[user.id] || user.role}
                    disabled={changingRole === user.id}
                    onChange={(e) => setSelectedRole({ ...selectedRole, [user.id]: e.target.value })}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="researcher">{t('researcher', language)}</option>
                    <option value="admin">{t('admin', language)}</option>
                    <option value="super_admin">{t('super_admin', language)}</option>
                  </select>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2 items-center">
                    {changingRole === user.id ? (
                      <span className="text-sm text-gray-500">{t('updating', language)}</span>
                    ) : (
                      <button
                        onClick={() => changeRole(user.id, selectedRole[user.id] || user.role)}
                        disabled={changingRole === user.id}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs disabled:opacity-50"
                      >
                        {t('update', language)}
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={deletingId === user.id}
                      className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                      title={t('delete', language)}
                    >
                      <FiTrash2 size={18} />
                    </button>
                    <button
                      onClick={() => openImportModal(user.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs"
                    >
                      Importer contenu
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-8"></div>

      <ImportContentModal
        key={language}
        userId={importUserId}
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setImportUserId(null);
        }}
        onImportComplete={loadUsers}
      />
    </div>
  );
}