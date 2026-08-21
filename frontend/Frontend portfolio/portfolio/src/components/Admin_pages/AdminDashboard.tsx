'use client'
import React, { useMemo, useState, useEffect } from "react";
import { FiUpload, FiUsers, FiBookOpen, FiFolder, FiHeart, FiStar, FiMessageCircle, FiEye, FiCreditCard, FiAward, FiDollarSign, FiBookmark } from "react-icons/fi";
import AccountCard from "./AccountCard";
import DonutChart from "../Donut_Chat";
import { useRouter } from "next/navigation";
import SubscriptionStats from "./StatCards";
import SubscriptionActions from "./SubActions";
import SubscriptionTable from "./SubscriptionTable";
import ExportPDF from "./ExportPDF";
import Notifications from "./Notifications";
import UserManagement from "./user/UserManagement";
import CreateSubscription from "./subscriptions/CreateSubscription";
import AuditLogs from "./AuditLogs";
// ✅ Import du nouveau composant
import AdminPublications from "./AdminPublications";
import DashboardStatCard from "./DashboardStatCard";
import CreateResearcherModal from "./CreateResearcherModal";
import { fetchUsers, fetchSubscriptions, User } from "@/lib/adminApi";
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import dynamic from 'next/dynamic';
import { useDebounce } from '@/hooks/useDebounce';
import { API_BASE_URL, fetchWithAuth } from "@/lib/api";
import { Subscription } from "./types";

// Lazy loading des composants de graphiques
const RevenueChart = dynamic(() => import('./RevenueChart'), { 
  ssr: false, 
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-xl" /> 
});
const SubscriptionPieChart = dynamic(() => import('./charts/SubscriptionPieChart'), { 
  ssr: false, 
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-xl" /> 
});
const NewSubscriptionsBarChart = dynamic(() => import('./charts/NewSubscriptionsBarChart'), { 
  ssr: false, 
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-xl" /> 
});

// ✅ AJOUT DE L'IMPORT DYNAMIQUE POUR PublicationsChart
const PublicationsChart = dynamic(
  () => import("./charts/PublicationsChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
    ),
  }
);

// ✅ AJOUT DE L'IMPORT DYNAMIQUE POUR ProjectsChart
const ProjectsChart = dynamic(
  () => import("./charts/ProjectsChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
    ),
  }
);

// ✅ AJOUT DE L'IMPORT DYNAMIQUE POUR ResearchersChart
const ResearchersChart = dynamic(
  () => import("./charts/ResearchersChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
    ),
  }
);

// ✅ AJOUT DE L'IMPORT DYNAMIQUE POUR LikesChart
const LikesChart = dynamic(
  () => import("./charts/LikesChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
    ),
  }
);

// ✅ AJOUT DE L'IMPORT DYNAMIQUE POUR CommentsChart
const CommentsChart = dynamic(
  () => import("./charts/CommentsChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
    ),
  }
);

// ✅ AJOUT DE L'IMPORT DYNAMIQUE POUR PaymentsChart
const PaymentsChart = dynamic(
  () => import("./charts/PaymentsChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
    ),
  }
);

// ✅ AJOUT DE L'IMPORT DYNAMIQUE POUR RolePieChart
const RolePieChart = dynamic(
  () => import("./charts/RolePieChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
    ),
  }
);

const AdminDashboard: React.FC<{ admin?: boolean }> = ({ admin = false }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("accounts");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const router = useRouter();

  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // ✅ État enrichi avec les nouvelles propriétés
  const [platformStats, setPlatformStats] = useState({
    researchers: 0,
    publications: 0,
    projects: 0,
    likes: 0,
    favorites: 0,
    comments: 0,
    views: 0,
    payments: 0,
    subscriptions: 0,
    total_revenue: 0,
    renewal_rate: 0,
    paying_profiles: 0,
    renewed_profiles: 0,
  });

  // ✅ ÉTAT POUR LES DONNÉES DES GRAPHIQUES
  const [chartData, setChartData] = useState({
    publications: [],
    projects: [],
    researchers: [],
    comments: [],
    likes: [],
    payments: [],
    roles: [],
  });

  const refreshSubscriptions = async () => {
    try {
      const subsData = await fetchSubscriptions();
      setSubscriptions(Array.isArray(subsData) ? subsData : []);
    } catch (error) {
      console.error('Erreur refresh abonnements:', error);
    }
  };

  const loadPlatformStatistics = async () => {
    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/admin/statistics/`
      );

      if (!res.ok) {
        console.error("Erreur statistiques :", res.status);
        return;
      }

      const data = await res.json();

      setPlatformStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FONCTION POUR CHARGER LES DONNÉES DES GRAPHIQUES
  const loadCharts = async () => {
    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/admin/statistics/charts`
      );

      if (!res.ok) return;

      const data = await res.json();

      setChartData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const usersData = await fetchUsers();
        const subsData = await fetchSubscriptions();

        setUsers(Array.isArray(usersData) ? usersData : []);
        setSubscriptions(Array.isArray(subsData) ? subsData : []);

        await loadPlatformStatistics();
        await loadCharts(); // ✅ Chargement des graphiques
      } catch (error) {
        console.error('Erreur chargement données admin:', error);
        setUsers([]);
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const accounts = users.map(user => ({
    userId: user.id,
    id: user.profile?.id ?? user.id,
    name: user.profile?.first_name 
      ? `${user.profile.first_name} ${user.profile.last_name || ''}` 
      : user.email.split('@')[0],
    profession: user.profile?.grade || user.role,
    email: user.email,
    status: user.status,
    avatar: ""
  }));

  const filteredAccounts = accounts.filter((acc) =>
    acc.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    acc.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    acc.profession.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const inactive = total - active;
    const newUsers = users.filter(() => true).length;
    return { total, active, inactive, newUsers };
  }, [users]);

  const subStats = useMemo(() => {
    return {
      total: platformStats.subscriptions,
      revenue: platformStats.total_revenue,
      renewalRate: platformStats.renewal_rate,
    };
  }, [
    platformStats.subscriptions,
    platformStats.total_revenue,
    platformStats.renewal_rate,
  ]);

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-20">{t('loading', language)}</div>;
    }

    switch (activeTab) {
      case "accounts":
        return (
          <div className="mt-10 text-center text-gray-600 text-lg">
            {/* Cercles statistiques (DonutChart) */}
            <div className="flex justify-center gap-10 mt-8">
              <DonutChart 
                percentage={stats.total > 0 ? 100 : 0} 
                admin={true} 
                label={t('total', language)} 
                value={stats.total}
              />
              <DonutChart 
                percentage={stats.total > 0 ? (stats.active / stats.total) * 100 : 0} 
                admin={true} 
                label={t('active', language)} 
                value={stats.active}
              />
              <DonutChart 
                percentage={stats.total > 0 ? (stats.inactive / stats.total) * 100 : 0} 
                admin={true} 
                label={t('inactive', language)} 
                value={stats.inactive}
              />
              <DonutChart 
                percentage={stats.total > 0 ? (stats.newUsers / stats.total) * 100 : 0} 
                admin={true} 
                label={t('new', language)} 
                value={stats.newUsers}
              />
            </div>
            
            <div className="flex justify-between items-center mt-12 mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-sm tracking-widest text-gray-500">{t('accounts', language)}</h2>
                <input
                  type="text"
                  placeholder={t('search', language)}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-2 text-sm rounded-full border border-gray-300 focus:outline-none"
                />
              </div>
              <button 
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-[#003F7F] text-white px-4 py-2 rounded-lg text-sm"
              >
                + {t('create', language)}
              </button>
            </div>

            <div className="mt-10 mb-12">
              <UserManagement />
            </div>

            {filteredAccounts.length === 0 ? (
              <p className="text-gray-400 text-sm mt-10">{t('no_accounts', language)}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAccounts.map((researcher) => (
                  <AccountCard key={`account_${researcher.email}`} researcher={researcher} onDeleted={() => window.location.reload()} />
                ))}
              </div>
            )}
          </div>
        );

      case "subscriptions":
        return (
          <div className="mt-10 text-center text-gray-600 text-lg">
            <div className="space-y-6">
              <SubscriptionStats stats={subStats} />
              <div className="flex justify-between items-center mb-6">
                <CreateSubscription onSubscriptionCreated={refreshSubscriptions} />
                <div className="flex gap-3">
                  <ExportPDF subscriptions={subscriptions} />
                  <SubscriptionActions subscriptions={subscriptions} />
                </div>
              </div>
              <SubscriptionTable subscriptions={subscriptions} onSubscriptionUpdated={refreshSubscriptions} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <RevenueChart subscriptions={subscriptions} />
                <SubscriptionPieChart subscriptions={subscriptions} />
              </div>
              <NewSubscriptionsBarChart subscriptions={subscriptions} />
            </div>
          </div>
        );

      case "statistics":
        return (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-8">
              {t("platform_statistics", language)}
            </h2>

            {/* ✅ Grille ajustée pour 10 cartes (lg:grid-cols-5) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

              {/* ✅ CARTE CHERCHEURS */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      {t("researchers", language)}
                    </p>
                    <h2 className="text-4xl font-bold text-[#003F7F] mt-2">
                      {platformStats.researchers}
                    </h2>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiUsers size={28} className="text-[#003F7F]" />
                  </div>
                </div>
              </div>

              {/* ✅ CARTE PUBLICATIONS */}
              <DashboardStatCard
                title={t("publication_section", language)}
                value={platformStats.publications}
                icon={<FiBookOpen size={26} />}
                color="indigo"
              />

              {/* ✅ CARTE LIKES */}
              <DashboardStatCard
                title={t("likes", language)}
                value={platformStats.likes}
                icon={<FiHeart size={26} />}
                color="red"
              />

              {/* ✅ CARTE FAVORIS */}
              <DashboardStatCard
                title={t("favorites", language)}
                value={platformStats.favorites}
                icon={<FiBookmark size={26} />}
                color="purple"
              />

              {/* ✅ CARTE COMMENTAIRES */}
              <DashboardStatCard
                title={t("comments", language)}
                value={platformStats.comments}
                icon={<FiMessageCircle size={26} />}
                color="yellow"
              />

              {/* ✅ CARTE VUES */}
              <DashboardStatCard
                title={t("views", language)}
                value={platformStats.views}
                icon={<FiEye size={26} />}
                color="green"
              />

              {/* ✅ CARTE PROJETS */}
              <DashboardStatCard
                title={t("projects", language)}
                value={platformStats.projects}
                icon={<FiFolder size={26} />}
                color="indigo"
              />

              {/* ✅ CARTE PAIEMENTS */}
              <DashboardStatCard
                title={t("payments", language)}
                value={platformStats.payments}
                icon={<FiCreditCard size={26} />}
                color="emerald"
              />

              {/* ✅ CARTE ABONNEMENTS */}
              <DashboardStatCard
                title={t("subscriptions", language)}
                value={platformStats.subscriptions}
                icon={<FiUsers size={26} />}
                color="pink"
              />

              {/* ✅ CARTE REVENU (Icône supprimée) */}
              <DashboardStatCard
                title={t("total_revenue", language)}
                value={`${platformStats.total_revenue.toLocaleString()} FCFA`}
                icon={null}
                color="orange"
              />

            </div>

            {/* ✅ GRAPHIQUES CÔTE À CÔTE (PUBLICATIONS + PROJETS) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
              <PublicationsChart
                data={chartData.publications}
              />
              <ProjectsChart
                data={chartData.projects}
              />
            </div>

            {/* ✅ GRAPHIQUES CÔTE À CÔTE (CHERCHEURS + LIKES) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <ResearchersChart
                data={chartData.researchers}
              />
              <LikesChart
                data={chartData.likes}
              />
            </div>

            {/* ✅ GRAPHIQUES CÔTE À CÔTE (COMMENTAIRES + PAIEMENTS) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <CommentsChart
                data={chartData.comments}
              />
              <PaymentsChart
                data={chartData.payments}
              />
            </div>

            {/* ✅ CAMEMBERT DES RÔLES (PLEINE LARGEUR) */}
            <div className="mt-8">
              <RolePieChart
                data={chartData.roles}
              />
            </div>

          </div>
        );

      // ✅ CORRECTION DU CASE PUBLICATIONS
      case "publications":
        return <AdminPublications />;

      case "audit":
        return <AuditLogs />;

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-10 py-6">
      <div className="flex justify-between items-center w-full h-13">
        <div className="flex gap-0 p-2 rounded-full h-13 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("accounts")}
            className={`flex items-center text-sm gap-2 px-6 py-2 rounded-full transition-all ${
              activeTab === "accounts"
                ? "bg-[#E6EEF7] text-[#474747]"
                : "text-[#A8A8A8] hover:bg-gray-100/30"
            }`}
          >
            {t('accounts', language)}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("subscriptions")}
            className={`flex items-center text-sm gap-2 px-6 py-2 rounded-full transition-all ${
              activeTab === "subscriptions"
                ? "bg-[#E6EEF7] text-[#474747]"
                : "text-[#A8A8A8] hover:bg-gray-100/30"
            }`}
          >
            {t('subscriptions', language)}
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab("statistics")}
            className={`flex items-center text-sm gap-2 px-6 py-2 rounded-full transition-all ${
              activeTab === "statistics"
                ? "bg-[#E6EEF7] text-[#474747]"
                : "text-[#A8A8A8] hover:bg-gray-100/30"
            }`}
          >
            {t("statistics", language)}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("publications")}
            className={`flex items-center text-sm gap-2 px-6 py-2 rounded-full transition-all ${
              activeTab === "publications"
                ? "bg-[#E6EEF7] text-[#474747]"
                : "text-[#A8A8A8] hover:bg-gray-100/30"
            }`}
          >
            {t("publications", language)}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`flex items-center text-sm gap-2 px-6 py-2 rounded-full transition-all ${
              activeTab === "audit"
                ? "bg-[#E6EEF7] text-[#474747]"
                : "text-[#A8A8A8] hover:bg-gray-100/30"
            }`}
          >
            {t('audit', language)}
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <Notifications subscriptions={subscriptions} />
          {admin && (
            <button 
              type="button"
              onClick={() => alert(t("published", language))}
              className="cursor-pointer flex p-2 text-sm px-3 rounded-lg gap-2 items-center bg-[#003F7F] text-white"
            >
              <FiUpload size={17}/> 
              {t('publish', language)}
            </button>
          )}
        </div>
      </div>
      
      {renderContent()}

      <CreateResearcherModal
      isOpen={showCreateModal}
      onClose={() => setShowCreateModal(false)}
      onCreated={() => window.location.reload()}
       />
    </div>
  );
};

export default AdminDashboard;