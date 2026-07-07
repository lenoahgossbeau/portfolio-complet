'use client'
import React, { useMemo, useState } from "react";
import { FiUpload } from "react-icons/fi";
import AccountCard from "./AccountCard";
import DonutChart from "../Donut_Chat";
import { useRouter } from "next/navigation";
import { MOCK_SUBSCRIPTIONS } from "./MOCK_data";
import SubscriptionStats from "./StatCards";
import SubscriptionActions from "./SubActions";
import SubscriptionTable from "./SubscriptionTable";
import { useLanguage } from '@/hooks/useLanguage'; // ✅ ajout
import { t } from '@/locales/translations';         // ✅ ajout


const AdminDashboard: React.FC = ({ admin = false }:{ admin?: boolean}) => {

  const { language } = useLanguage(); // ✅ récupère la langue courante

  // ✅ Tabs traduits dynamiquement
  const tabs = [
    { id: "accounts", label: t('accounts', language) },
    { id: "subscriptions", label: t('subscriptions', language) },
  ];

  const [activeTab, setActiveTab] = useState<string>("accounts");

  const [account, setAccount] = useState([
  {
    id: 1,
    name: "admin",
    profession: "admin",
    email: "admin@test.com",
    status: "active",
    avatar: ""
  }
  ]);

  const router = useRouter();

  const [search, setSearch] = useState("");

  const filteredAccounts = account.filter((acc) =>
    acc.name.toLowerCase().includes(search.toLowerCase()) ||
    acc.email.toLowerCase().includes(search.toLowerCase()) ||
    acc.profession.toLowerCase().includes(search.toLowerCase())
  );

  const [subscriptions, setSubscriptions] = useState(MOCK_SUBSCRIPTIONS);

  const stats = useMemo(() => {
    const total = subscriptions.length;
    const revenue = subscriptions.reduce((sum, s) => sum + s.amount, 0);
    const renewalRate = 100;
    return { total, revenue, renewalRate };
  }, [subscriptions]);

  const renderContent = () => {
    switch (activeTab) {
      case "accounts":
        return (
          <div className="mt-10 text-center text-gray-600 text-lg">
            <div className="flex justify-center gap-10 mt-8">
              <DonutChart percentage={100} admin={true} label={t('total', language)} />
              <DonutChart percentage={50} admin={true} label={t('active', language)} />
              <DonutChart percentage={20} admin={true} label={t('inactive', language)} />
              <DonutChart percentage={10} admin={true} label={t('new', language)} />
            </div>

            <div className="flex justify-between items-center mt-12 mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-sm tracking-widest text-gray-500">
                  {t('accounts', language).toUpperCase()}
                </h2>
                <input
                  type="text"
                  placeholder={t('search', language)}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-2 text-sm rounded-full border border-gray-300 focus:outline-none"
                />
              </div>

              <button
                onClick={() => router.push("/researcher/dashboard")}
                className="flex items-center gap-2 bg-[#003F7F] text-white px-4 py-2 rounded-lg text-sm"
              >
                + {t('create', language)}
              </button>
            </div>

            {filteredAccounts.length === 0 ? (
              <p className="text-gray-400 text-sm mt-10">
                {t('no_accounts', language)}
              </p>
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
              <SubscriptionStats stats={stats} />
              <SubscriptionActions subscriptions={subscriptions} />
              <SubscriptionTable subscriptions={subscriptions} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-10 py-6">
      <div className="flex justify-between items-center w-full h-13">
        {/* Tabs */}
        <div className="flex gap-0 p-2 rounded-full h-13 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center text-sm gap-2 px-6 py-2 rounded-full transition-all ${
                activeTab === tab.id
                  ? "bg-[#E6EEF7] text-[#474747]"
                  : "text-[#A8A8A8] hover:bg-gray-100/30"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Admin publish Button */}
        {admin && (
          <button
            onClick={() => alert("Published")}
            className="cursor-pointer flex p-2 text-sm px-3 rounded-lg gap-2 items-center bg-[#003F7F] text-white"
          >
            <FiUpload size={17} />
            {t('publish', language)}
          </button>
        )}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;
