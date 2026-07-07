'use client'
import React, { useMemo, useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
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
import { fetchUsers, fetchSubscriptions, User } from "@/lib/adminApi";
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import dynamic from 'next/dynamic';
import { useDebounce } from '@/hooks/useDebounce';

// Type local pour Subscription
type LocalSubscription = {
  id: string | number;
  profile_id: string | number;
  start_date: string;
  end_date: string;
  type: string;
  payment_method: string;
  amount?: number;
};

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

const AdminDashboard: React.FC<{ admin?: boolean }> = ({ admin = false }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("accounts");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<LocalSubscription[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const router = useRouter();

  const refreshSubscriptions = async () => {
    try {
      const subsData = await fetchSubscriptions();
      setSubscriptions(Array.isArray(subsData) ? subsData as LocalSubscription[] : []);
    } catch (error) {
      console.error('Erreur refresh abonnements:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const usersData = await fetchUsers();
        const subsData = await fetchSubscriptions();
        setUsers(Array.isArray(usersData) ? usersData : []);
        setSubscriptions(Array.isArray(subsData) ? subsData as LocalSubscription[] : []);
      } catch (error) {
        console.error('Erreur chargement données admin:', error);
        setUsers([]);
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const accounts = users.map(user => ({
    id: user.id,
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
    const total = subscriptions.length;
    const revenue = subscriptions.reduce((sum, s) => sum + (s.amount || 29.99), 0);
    const renewalRate = 100;
    return { total, revenue, renewalRate };
  }, [subscriptions]);

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
                onClick={() => router.push("/auth/register")}
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
                  <AccountCard key={researcher.id} researcher={researcher} />
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
              onClick={() => alert("Publié")}
              className="cursor-pointer flex p-2 text-sm px-3 rounded-lg gap-2 items-center bg-[#003F7F] text-white"
            >
              <FiUpload size={17}/> 
              {t('publish', language)}
            </button>
          )}
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;