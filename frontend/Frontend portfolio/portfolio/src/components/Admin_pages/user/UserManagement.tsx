'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import toast from 'react-hot-toast';
import {
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { API_BASE_URL } from '@/lib/api';
import ImportContentModal from './ImportContentModal';

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

/*
 * Largeur minimale volontairement importante.
 * Elle permet de conserver toutes les colonnes et surtout
 * d'aller jusqu'au bouton Supprimer avec la barre horizontale.
 */
const TABLE_MIN_WIDTH = 2000;

const USERS_PER_PAGE = 8;

export default function UserManagement() {
  const { language } = useLanguage();
  const router = useRouter();

  // ============================================================
  // DONNÉES
  // ============================================================

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // ACTIONS
  // ============================================================

  const [changingRole, setChangingRole] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [selectedRole, setSelectedRole] = useState<{
    [key: number]: string;
  }>({});

  const [importUserId, setImportUserId] = useState<number | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // ============================================================
  // RECHERCHE / FILTRES
  // ============================================================

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // ============================================================
  // PAGINATION
  // ============================================================

  const [currentPage, setCurrentPage] = useState(1);

  // ============================================================
  // BARRES DE DÉFILEMENT HORIZONTALES
  // ============================================================

  const topScrollRef = useRef<HTMLDivElement | null>(null);
  const tableScrollRef = useRef<HTMLDivElement | null>(null);
  const isSyncingScroll = useRef(false);

  const syncTopScroll = () => {
    if (!topScrollRef.current || !tableScrollRef.current) return;

    if (isSyncingScroll.current) return;

    isSyncingScroll.current = true;

    tableScrollRef.current.scrollLeft =
      topScrollRef.current.scrollLeft;

    requestAnimationFrame(() => {
      isSyncingScroll.current = false;
    });
  };

  const syncTableScroll = () => {
    if (!topScrollRef.current || !tableScrollRef.current) return;

    if (isSyncingScroll.current) return;

    isSyncingScroll.current = true;

    topScrollRef.current.scrollLeft =
      tableScrollRef.current.scrollLeft;

    requestAnimationFrame(() => {
      isSyncingScroll.current = false;
    });
  };

  // ============================================================
  // UTILISATEUR CONNECTÉ
  // ============================================================

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

  // ============================================================
  // CHARGEMENT DES UTILISATEURS
  // ============================================================

  const loadUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('access_token');

      if (!token) {
        setUsers([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      toast.error(
        language === 'fr'
          ? 'Impossible de charger les utilisateurs.'
          : 'Unable to load users.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ============================================================
  // TRADUCTION DES RÔLES
  // ============================================================

  const translateRole = (role: string) => {
    const roleMap: Record<
      string,
      { fr: string; en: string }
    > = {
      super_admin: {
        fr: 'Super Administrateur',
        en: 'Super Admin',
      },
      admin: {
        fr: 'Administrateur',
        en: 'Admin',
      },
      researcher: {
        fr: 'Chercheur',
        en: 'Researcher',
      },
      user: {
        fr: 'Utilisateur',
        en: 'User',
      },
    };

    const lang = language === 'fr' ? 'fr' : 'en';

    return roleMap[role]?.[lang] ?? role;
  };

  // ============================================================
  // FILTRAGE
  // ============================================================

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      const firstName = user.profile?.first_name || '';
      const lastName = user.profile?.last_name || '';

      const fullName =
        `${firstName} ${lastName}`.trim().toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        String(user.id).includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        fullName.includes(normalizedSearch);

      const matchesRole =
        !roleFilter || user.role === roleFilter;

      const matchesStatus =
        !statusFilter || user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [users, search, roleFilter, statusFilter]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE)
  );

  const paginatedUsers = useMemo(() => {
    const start =
      (currentPage - 1) * USERS_PER_PAGE;

    return filteredUsers.slice(
      start,
      start + USERS_PER_PAGE
    );
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter]);

  // ============================================================
  // RÉINITIALISATION
  // ============================================================

  const resetFilters = () => {
    setSearch('');
    setRoleFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  // ============================================================
  // MODIFICATION DU RÔLE
  // ============================================================

  const changeRole = async (
    userId: number,
    newRole: string
  ) => {
    const currentUserId = getCurrentUserId();

    if (
      userId === currentUserId &&
      newRole !== 'super_admin'
    ) {
      const confirmed = window.confirm(
        `${t('role_warning', language)}\n\n${t(
          'role_warning_continue',
          language
        )}`
      );

      if (!confirmed) return;
    }

    setChangingRole(userId);

    try {
      const token =
        localStorage.getItem('access_token');

      const response = await fetch(
        `${API_BASE_URL}/admin/users/${userId}/role`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      if (response.ok) {
        await loadUsers();

        toast.success(
          t('role_updated', language)
        );

        if (
          userId === currentUserId &&
          newRole !== 'super_admin'
        ) {
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
      } else {
        const error = await response.json();

        toast.error(
          `${t('error', language)}: ${
            error.detail ||
            t('role_update_error', language)
          }`
        );
      }
    } catch (error) {
      console.error('Erreur:', error);

      toast.error(
        t('network_error', language)
      );
    } finally {
      setChangingRole(null);
    }
  };

  // ============================================================
  // SUPPRESSION UTILISATEUR
  // ============================================================

  const handleDeleteUser = async (
    userId: number
  ) => {
    const currentUserId = getCurrentUserId();

    if (userId === currentUserId) {
      toast.error(
        t('cannot_delete_self', language)
      );

      return;
    }

    if (
      !confirm(
        t('delete_user_confirm', language)
      )
    ) {
      return;
    }

    setDeletingId(userId);

    try {
      const token =
        localStorage.getItem('access_token');

      const response = await fetch(
        `${API_BASE_URL}/admin/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success(
          t('delete_user_success', language)
        );

        await loadUsers();
      } else {
        const error = await response.json();

        toast.error(
          error.detail ||
          t('delete_user_error', language)
        );
      }
    } catch (error) {
      console.error('Erreur:', error);

      toast.error(
        t('delete_user_error', language)
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================
  // IMPORT
  // ============================================================

  const openImportModal = (
    userId: number
  ) => {
    setImportUserId(userId);
    setIsImportModalOpen(true);
  };

  // ============================================================
  // ACTIVATION / DÉSACTIVATION
  // ============================================================

  const changeStatus = async (
    userId: number,
    active: boolean
  ) => {
    try {
      const token =
        localStorage.getItem('access_token');

      const response = await fetch(
        `${API_BASE_URL}/admin/users/${userId}/status?active=${active}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success(
          active
            ? t(
                'user_activated_success',
                language
              )
            : t(
                'user_deactivated_success',
                language
              )
        );

        await loadUsers();
      } else {
        toast.error(
          active
            ? t(
                'activate_user_error',
                language
              )
            : t(
                'deactivate_user_error',
                language
              )
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        t('network_error', language)
      );
    }
  };

  // ============================================================
  // ÉTATS DE CHARGEMENT
  // ============================================================

  if (loading) {
    return (
      <div className="text-center py-10">
        {t('loading', language)}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        {t('no_users', language)}
      </div>
    );
  }

  // ============================================================
  // AFFICHAGE
  // ============================================================

  return (
    <div className="mt-8 mb-20 bg-white rounded-xl shadow overflow-hidden">

      {/* ======================================================
          TITRE
          ====================================================== */}

      <div className="p-5 bg-gray-50 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              {t('user_management', language)}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {filteredUsers.length}{' '}
              {language === 'fr'
                ? 'utilisateur(s)'
                : 'user(s)'}
            </p>
          </div>

        </div>
      </div>

      {/* ======================================================
          RECHERCHE + FILTRES
          ====================================================== */}

      <div className="p-4 border-b bg-white">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* RECHERCHE */}

          <div className="relative">
            <FiSearch
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder={
                language === 'fr'
                  ? 'Rechercher par ID, email ou nom...'
                  : 'Search by ID, email or name...'
              }
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* FILTRE RÔLE */}

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {language === 'fr'
                ? 'Tous les rôles'
                : 'All roles'}
            </option>

            <option value="researcher">
              {translateRole('researcher')}
            </option>

            <option value="admin">
              {translateRole('admin')}
            </option>

            <option value="super_admin">
              {translateRole('super_admin')}
            </option>

            <option value="user">
              {translateRole('user')}
            </option>
          </select>

          {/* FILTRE STATUT */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {language === 'fr'
                ? 'Tous les statuts'
                : 'All statuses'}
            </option>

            <option value="active">
              {t('active', language)}
            </option>

            <option value="inactive">
              {t('inactive', language)}
            </option>
          </select>

          {/* RESET */}

          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
          >
            <FiRefreshCw size={16} />

            {language === 'fr'
              ? 'Réinitialiser'
              : 'Reset filters'}
          </button>

        </div>
      </div>

      {/* ======================================================
          BARRE HORIZONTALE SUPÉRIEURE
          ====================================================== */}

      <div className="px-4 pt-3 bg-white">

        <div className="flex items-center justify-between mb-2">

          <span className="text-xs font-medium text-gray-500">
            {language === 'fr'
              ? 'Défilement horizontal du tableau'
              : 'Horizontal table scroll'}
          </span>

          <span className="text-xs text-gray-400">
            ← {language === 'fr'
              ? 'faire glisser'
              : 'scroll'} →
          </span>

        </div>

        <div
          ref={topScrollRef}
          onScroll={syncTopScroll}
          className="w-full overflow-x-auto overflow-y-hidden border border-gray-200 rounded-t-lg bg-gray-50"
          style={{
            scrollbarWidth: 'auto',
          }}
        >
          <div
            style={{
              width: `${TABLE_MIN_WIDTH}px`,
              height: '18px',
            }}
          />
        </div>

      </div>

      {/* ======================================================
          TABLEAU
          ====================================================== */}

      <div
        ref={tableScrollRef}
        onScroll={syncTableScroll}
        className="w-full overflow-x-auto overflow-y-hidden"
      >

        <table
          className="border-collapse"
          style={{
            minWidth: `${TABLE_MIN_WIDTH}px`,
            width: `${TABLE_MIN_WIDTH}px`,
          }}
        >

          <thead className="bg-gray-100">

            <tr className="text-left border-b border-gray-300">

              <th
                className="sticky left-0 z-30 p-4 font-semibold text-gray-600 bg-gray-100 border-r border-gray-300"
                style={{ width: '90px', minWidth: '90px' }}
              >
                {t('id', language)}
              </th>

              <th
                className="sticky left-[90px] z-30 p-4 font-semibold text-gray-600 bg-gray-100 border-r border-gray-300 shadow-[4px_0_8px_-6px_rgba(0,0,0,0.35)]"
                style={{ width: '350px', minWidth: '350px' }}
              >
                {t('email', language)}
              </th>

              <th
                className="p-4 font-semibold text-gray-600"
                style={{ width: '220px', minWidth: '220px' }}
              >
                {t('name', language)}
              </th>

              <th
                className="p-4 font-semibold text-gray-600"
                style={{ width: '200px', minWidth: '200px' }}
              >
                {t('current_role', language)}
              </th>

              <th
                className="p-4 font-semibold text-gray-600"
                style={{ width: '240px', minWidth: '240px' }}
              >
                {t('new_role', language)}
              </th>

              <th
                className="p-4 font-semibold text-gray-600"
                style={{ width: '700px', minWidth: '700px' }}
              >
                {t('action', language)}
              </th>

            </tr>

          </thead>

          <tbody>

            {paginatedUsers.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="text-center py-12 text-gray-500"
                >
                  {language === 'fr'
                    ? 'Aucun utilisateur ne correspond aux filtres.'
                    : 'No users match the filters.'}
                </td>

              </tr>

            ) : (

              paginatedUsers.map((user) => (

                <tr
                  key={user.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >

                  {/* ID */}

                  <td className="sticky left-0 z-20 p-4 font-medium text-gray-700 bg-white border-r border-gray-200">
                    {user.id}
                  </td>

                  {/* EMAIL */}

                  <td className="sticky left-[90px] z-20 p-4 text-gray-700 bg-white border-r border-gray-200 shadow-[4px_0_8px_-6px_rgba(0,0,0,0.25)]">
                    <div
                      className="truncate"
                      title={user.email}
                    >
                      {user.email}
                    </div>
                  </td>

                  {/* NOM */}

                  <td className="p-4 text-gray-700">

                    {user.profile?.first_name ||
                    user.profile?.last_name ? (
                      <>
                        {user.profile?.first_name || ''}
                        {' '}
                        {user.profile?.last_name || ''}
                      </>
                    ) : (
                      <span className="text-gray-400">
                        —
                      </span>
                    )}

                  </td>

                  {/* RÔLE ACTUEL */}

                  <td className="p-4">

                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
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

                  {/* NOUVEAU RÔLE */}

                  <td className="p-4">

                    <select
                      value={
                        selectedRole[user.id] ||
                        user.role
                      }
                      disabled={
                        changingRole === user.id
                      }
                      onChange={(e) =>
                        setSelectedRole({
                          ...selectedRole,
                          [user.id]:
                            e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >

                      <option value="researcher">
                        {t(
                          'researcher',
                          language
                        )}
                      </option>

                      <option value="admin">
                        {t(
                          'admin',
                          language
                        )}
                      </option>

                      <option value="super_admin">
                        {t(
                          'super_admin',
                          language
                        )}
                      </option>

                      <option value="user">
                        {t(
                          'user',
                          language
                        )}
                      </option>

                    </select>

                  </td>

                  {/* ACTIONS */}

                  <td className="p-4">

                    <div className="flex items-center gap-3 whitespace-nowrap min-w-max">

                      {/* MODIFIER RÔLE */}

                      {changingRole === user.id ? (

                        <span className="inline-flex items-center justify-center w-28 h-9 text-xs text-gray-500">
                          {t(
                            'updating',
                            language
                          )}
                        </span>

                      ) : (

                        <button
                          type="button"
                          onClick={() =>
                            changeRole(
                              user.id,
                              selectedRole[user.id] ||
                              user.role
                            )
                          }
                          className="w-28 h-9 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium transition"
                        >
                          {t(
                            'update',
                            language
                          )}
                        </button>

                      )}

                      {/* STATUT */}

                      {user.status === 'active' ? (

                        <>
                          <span className="inline-flex items-center justify-center px-3 h-9 rounded-lg bg-green-100 text-green-700 text-xs font-semibold">
                            {t(
                              'active',
                              language
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              changeStatus(
                                user.id,
                                false
                              )
                            }
                            className="w-28 h-9 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-medium transition"
                          >
                            {t(
                              'deactivate',
                              language
                            )}
                          </button>
                        </>

                      ) : (

                        <>
                          <span className="inline-flex items-center justify-center px-3 h-9 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">
                            {t(
                              'inactive',
                              language
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              changeStatus(
                                user.id,
                                true
                              )
                            }
                            className="w-28 h-9 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium transition"
                          >
                            {t(
                              'activate',
                              language
                            )}
                          </button>
                        </>

                      )}

                      {/* IMPORT */}

                      <button
                        type="button"
                        onClick={() =>
                          openImportModal(
                            user.id
                          )
                        }
                        className="w-28 h-9 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium transition"
                      >
                        {t(
                          'import',
                          language
                        )}
                      </button>

                      {/* DÉTAIL */}

                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/admin/researchers/${user.id}`
                          )
                        }
                        className="w-24 h-9 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-xs font-medium transition"
                      >
                        {t(
                          'detail',
                          language
                        )}
                      </button>

                      {/* SUPPRESSION */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteUser(
                            user.id
                          )
                        }
                        disabled={
                          deletingId === user.id
                        }
                        className="w-10 h-9 shrink-0 flex items-center justify-center rounded-lg text-red-600 border border-red-200 bg-white hover:bg-red-50 hover:text-red-700 transition disabled:opacity-50"
                        title={t(
                          'delete',
                          language
                        )}
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

      {/* ======================================================
          BAS DU TABLEAU / PAGINATION
          ====================================================== */}

      <div className="px-4 py-4 border-t bg-gray-50">

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* COMPTEUR */}

          <div className="text-sm text-gray-500">

            {filteredUsers.length === 0
              ? '0'
              : `${(currentPage - 1) *
                  USERS_PER_PAGE +
                  1}-${Math.min(
                    currentPage *
                      USERS_PER_PAGE,
                    filteredUsers.length
                  )}`}

            {' '}

            {language === 'fr'
              ? `sur ${filteredUsers.length} utilisateur(s)`
              : `of ${filteredUsers.length} user(s)`}

          </div>

          {/* PAGINATION */}

          <div className="flex items-center gap-2">

            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(1, page - 1)
                )
              }
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              title={
                language === 'fr'
                  ? 'Page précédente'
                  : 'Previous page'
              }
            >
              <FiChevronLeft size={18} />
            </button>

            <span className="px-3 text-sm text-gray-600">
              {language === 'fr'
                ? `Page ${currentPage} / ${totalPages}`
                : `Page ${currentPage} / ${totalPages}`}
            </span>

            <button
              type="button"
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(
                    totalPages,
                    page + 1
                  )
                )
              }
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              title={
                language === 'fr'
                  ? 'Page suivante'
                  : 'Next page'
              }
            >
              <FiChevronRight size={18} />
            </button>

          </div>

        </div>

      </div>

      {/* ======================================================
          MODAL IMPORT
          ====================================================== */}

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