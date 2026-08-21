'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import toast from 'react-hot-toast';
import {
  FiRefreshCw,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

type AuditLog = {
  id: number;
  user_id: number | null;
  user_email: string | null;
  user_role: string;
  action_description: string;
  date: string | null;
};

type AuditResponse = {
  total: number;
  limit: number;
  offset: number;
  logs: AuditLog[];
};

const PAGE_SIZE = 20;

const roleLabels: Record<string, { fr: string; en: string }> = {
  admin: {
    fr: 'Administrateur',
    en: 'Administrator',
  },
  super_admin: {
    fr: 'Super administrateur',
    en: 'Super administrator',
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

const translateRole = (role: string, language: string) => {
  const translation = roleLabels[role];

  if (!translation) {
    return role;
  }

  return language === 'en'
    ? translation.en
    : translation.fr;
};

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-blue-100 text-blue-700';

    case 'super_admin':
      return 'bg-purple-100 text-purple-700';

    case 'researcher':
      return 'bg-green-100 text-green-700';

    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const formatDate = (
  date: string | null,
  language: string
) => {
  if (!date) {
    return '-';
  }

  try {
    return new Date(date).toLocaleString(
      language === 'en' ? 'en-US' : 'fr-FR',
      {
        dateStyle: 'short',
        timeStyle: 'short',
      }
    );
  } catch {
    return date;
  }
};

export default function AuditLogs() {
  const { language } = useLanguage();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE)
  );

  // ==========================================================
  // CHARGEMENT DES LOGS
  // ==========================================================

  const fetchLogs = async (
    currentPage = page,
    showRefresh = false
  ) => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setLoading(false);
      return;
    }

    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const offset =
        (currentPage - 1) * PAGE_SIZE;

      const response = await fetch(
        `${API_BASE_URL}/admin/audit/logs?limit=${PAGE_SIZE}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const data: AuditResponse =
        await response.json();

      setLogs(
        Array.isArray(data.logs)
          ? data.logs
          : []
      );

      setTotal(
        Number(data.total) || 0
      );
    } catch (error) {
      console.error(
        'Erreur chargement audit:',
        error
      );

      toast.error(
        t(
          'audit_logs_load_error',
          language
        )
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  // ==========================================================
  // FILTRES
  // ==========================================================

  const uniqueRoles = useMemo(() => {
    return Array.from(
      new Set(
        logs
          .map((log) => log.user_role)
          .filter(Boolean)
      )
    );
  }, [logs]);

  const uniqueActions = useMemo(() => {
    return Array.from(
      new Set(
        logs
          .map(
            (log) =>
              log.action_description
          )
          .filter(Boolean)
      )
    );
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        !searchValue ||
        String(log.id)
          .toLowerCase()
          .includes(searchValue) ||
        String(log.user_id ?? '')
          .toLowerCase()
          .includes(searchValue) ||
        String(log.user_email ?? '')
          .toLowerCase()
          .includes(searchValue) ||
        String(log.user_role ?? '')
          .toLowerCase()
          .includes(searchValue) ||
        String(
          log.action_description ?? ''
        )
          .toLowerCase()
          .includes(searchValue);

      const matchesRole =
        !roleFilter ||
        log.user_role === roleFilter;

      const matchesAction =
        !actionFilter ||
        log.action_description ===
          actionFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesAction
      );
    });
  }, [
    logs,
    search,
    roleFilter,
    actionFilter,
  ]);

  const resetFilters = () => {
    setSearch('');
    setRoleFilter('');
    setActionFilter('');
  };

  // ==========================================================
  // DÉFILEMENT HORIZONTAL SYNCHRONISÉ
  // ==========================================================

  const handleTopScroll = () => {
    if (
      topScrollRef.current &&
      tableScrollRef.current
    ) {
      tableScrollRef.current.scrollLeft =
        topScrollRef.current.scrollLeft;
    }
  };

  const handleTableScroll = () => {
    if (
      topScrollRef.current &&
      tableScrollRef.current
    ) {
      topScrollRef.current.scrollLeft =
        tableScrollRef.current.scrollLeft;
    }
  };

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage((current) => current - 1);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage((current) => current + 1);
    }
  };

  const startItem =
    total === 0
      ? 0
      : (page - 1) * PAGE_SIZE + 1;

  const endItem = Math.min(
    page * PAGE_SIZE,
    total
  );

  // ==========================================================
  // AFFICHAGE
  // ==========================================================

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        {t('loading', language)}
      </div>
    );
  }

  return (
    <div className="mt-10 w-full">

      {/* ======================================================
          EN-TÊTE
      ====================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {t('audit', language)}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {total}{' '}
            {language === 'en'
              ? 'audit actions'
              : 'actions enregistrées'}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            fetchLogs(page, true)
          }
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#003F7F] text-white rounded-lg hover:bg-[#00356b] transition disabled:opacity-50"
        >
          <FiRefreshCw
            size={16}
            className={
              refreshing
                ? 'animate-spin'
                : ''
            }
          />

          {language === 'en'
            ? 'Refresh'
            : 'Actualiser'}
        </button>
      </div>

      {/* ======================================================
          FILTRES
      ====================================================== */}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Recherche */}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {language === 'en'
                ? 'Search'
                : 'Rechercher'}
            </label>

            <div className="relative">
              <FiSearch
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder={
                  language === 'en'
                    ? 'User, email, action...'
                    : 'Utilisateur, email, action...'
                }
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Rôle */}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {language === 'en'
                ? 'Role'
                : 'Rôle'}
            </label>

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(
                  event.target.value
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {language === 'en'
                  ? 'All roles'
                  : 'Tous les rôles'}
              </option>

              {uniqueRoles.map(
                (role) => (
                  <option
                    key={role}
                    value={role}
                  >
                    {translateRole(
                      role,
                      language
                    )}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Action */}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {language === 'en'
                ? 'Action'
                : 'Action'}
            </label>

            <select
              value={actionFilter}
              onChange={(event) =>
                setActionFilter(
                  event.target.value
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {language === 'en'
                  ? 'All actions'
                  : 'Toutes les actions'}
              </option>

              {uniqueActions.map(
                (action) => (
                  <option
                    key={action}
                    value={action}
                  >
                    {action}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Reset */}

          <div className="flex items-end">
            <button
              type="button"
              onClick={resetFilters}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
            >
              {language === 'en'
                ? 'Reset filters'
                : 'Réinitialiser'}
            </button>
          </div>

        </div>
      </div>

      {/* ======================================================
          BARRE HORIZONTALE SUPÉRIEURE
          Elle permet de faire défiler le tableau sans descendre
          jusqu'en bas.
      ====================================================== */}

      <div
        ref={topScrollRef}
        onScroll={handleTopScroll}
        className="overflow-x-auto overflow-y-hidden mb-2 h-4"
      >
        <div className="min-w-[1000px] h-1" />
      </div>

      {/* ======================================================
          TABLEAU
      ====================================================== */}

      <div
        ref={tableScrollRef}
        onScroll={handleTableScroll}
        className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200"
      >
        <table className="min-w-[1000px] w-full text-sm">

          <thead className="bg-gray-100 border-b border-gray-200">
            <tr className="text-left text-gray-600">

              <th className="p-4 whitespace-nowrap">
                ID
              </th>

              <th className="p-4 whitespace-nowrap">
                {language === 'en'
                  ? 'User'
                  : 'Utilisateur'}
              </th>

              <th className="p-4 whitespace-nowrap">
                {language === 'en'
                  ? 'Role'
                  : 'Rôle'}
              </th>

              <th className="p-4 min-w-[350px]">
                {language === 'en'
                  ? 'Action'
                  : 'Action'}
              </th>

              <th className="p-4 whitespace-nowrap">
                {language === 'en'
                  ? 'Date'
                  : 'Date'}
              </th>

            </tr>
          </thead>

          <tbody>

            {filteredLogs.map(
              (log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >

                  <td className="p-4 font-medium text-gray-700">
                    #{log.id}
                  </td>

                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-800">
                        {log.user_email ||
                          `User #${log.user_id ?? '-'}`}
                      </div>

                      {log.user_email && (
                        <div className="text-xs text-gray-400 mt-1">
                          ID: {log.user_id ?? '-'}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(
                        log.user_role
                      )}`}
                    >
                      {translateRole(
                        log.user_role,
                        language
                      )}
                    </span>
                  </td>

                  <td className="p-4 text-gray-700 min-w-[350px]">
                    {log.action_description}
                  </td>

                  <td className="p-4 text-gray-500 whitespace-nowrap">
                    {formatDate(
                      log.date,
                      language
                    )}
                  </td>

                </tr>
              )
            )}

            {filteredLogs.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-12 text-gray-500"
                >
                  {language === 'en'
                    ? 'No audit logs found.'
                    : 'Aucun journal d’audit trouvé.'}
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* ======================================================
          PAGINATION
      ====================================================== */}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5">

        <div className="text-sm text-gray-500">
          {startItem}–{endItem}{' '}
          {language === 'en'
            ? `of ${total}`
            : `sur ${total}`}
        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={goToPreviousPage}
            disabled={page <= 1}
            className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiChevronLeft size={16} />

            {language === 'en'
              ? 'Previous'
              : 'Précédent'}
          </button>

          <span className="px-3 py-2 text-sm text-gray-600">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            onClick={goToNextPage}
            disabled={
              page >= totalPages
            }
            className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {language === 'en'
              ? 'Next'
              : 'Suivant'}

            <FiChevronRight size={16} />
          </button>

        </div>
      </div>

    </div>
  );
}