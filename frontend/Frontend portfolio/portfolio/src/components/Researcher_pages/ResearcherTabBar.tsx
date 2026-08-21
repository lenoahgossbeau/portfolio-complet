'use client';

import React, { useState, useEffect } from "react";
import Resume from "@/sections/Resume";
import { FiUpload, FiDownload, FiFileText, FiCalendar, FiPhone } from "react-icons/fi";
import PersonalInfoCard from "./PersonalInfoCard";
import Researcher_Project_Tab_Content from "./Researcher_Project_Tab_Content";
import Researcher_Publication_Tab_Content from "./Researcher_Publication_Tab_Content";
import Researcher_Cours_Tab_Content from "./Researcher_Cours_Tab_Content";
import Researcher_Distinction_Tab_Content from "./Researcher_Distinction_Tab_Content";
import Researcher_Media_Tab_Content from "./Researcher_Media_Tab_Content";
import MessagesView from "./MessagesView";
import CVUpload from "./CVUpload";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/locales/translations";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "@/lib/api";

const tabs = [
  { id: "profile", label: "profile" },
  { id: "resume", label: "resume_section" },
  { id: "project", label: "project_section" },
  { id: "publication", label: "publication_section" },
  { id: "course", label: "courses" },
  { id: "distinction", label: "distinctions" },
  { id: "media", label: "media" },
  { id: "messages", label: "messages" },
  { id: "payment", label: "payment" },
  { id: "statistics", label: "statistics" },
];

type Props = {
  admin?: boolean;
  mode?: "create" | "edit";
  researcherId?: number;
};

type SubscriptionStatus = 'active' | 'inactive' | 'expired';
type Payment = {
  id: number;
  operator: string;
  phoneNumber: string;
  amount: number;
  date: string;
  status: 'success' | 'pending' | 'failed';
};

const ResearcherDashboard: React.FC<Props> = ({
  admin = false,
  mode = "create",
  researcherId,
}) => {
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<string>("profile");

  // États pour le paiement
  const [operator, setOperator] = useState("orange");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(1000);
  const [processing, setProcessing] = useState(false);

  const [loadingSubscription, setLoadingSubscription] = useState(true);

  const [isPremium, setIsPremium] = useState(false); 
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('inactive');
  const [expiryDate, setExpiryDate] = useState<string | null>(null);

  // ✅ Nouvel état pour gérer l'affichage du formulaire lors du renouvellement
  const [renewMode, setRenewMode] = useState(false);

  // Historique des paiements (tableau vide au démarrage)
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);

  // ✅ ÉTAT POUR LE TÉLÉCHARGEMENT
  const [downloadingReceiptId, setDownloadingReceiptId] = useState<number | null>(null);

  // ✅ ÉTAT POUR LES STATISTIQUES DU CHERCHEUR (Corrigé en objet)
  const [statistics, setStatistics] = useState<any>(null);

  // Helpers UI
  const getDaysRemaining = () => {
    if (!expiryDate) return 0;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Mapping des couleurs par opérateur
  const getOperatorColors = (op: string) => {
    if (op.includes("Orange")) return { bg: "bg-orange-100", text: "text-orange-700", icon: "🟧" };
    if (op.includes("MTN")) return { bg: "bg-yellow-100", text: "text-yellow-700", icon: "🟨" };
    return { bg: "bg-gray-100", text: "text-gray-700", icon: "🟦" };
  };

  // Publication du profil
  const handlePublish = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      toast.error("Vous devez être connecté");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/researcher/publish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          t("publish_success", language) ||
            "Profil publié avec succès !"
        );
      } else {
        toast.error(
          data.message || "Erreur lors de la publication"
        );
      }
    } catch (error) {
      console.error("Erreur publication :", error);
      toast.error("Erreur réseau");
    }
  };

  // FONCTION : Charger les infos de l'abonnement
  const loadSubscription = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    try {
      setLoadingSubscription(true);

      const response = await fetch(
        `${API_BASE_URL}/payment/subscription`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.active) {
          setIsPremium(true);
          setSubscriptionStatus("active");
          setExpiryDate(data.end_date);
        } else {
          setIsPremium(false);
          setSubscriptionStatus("inactive");
          setExpiryDate(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSubscription(false);
    }
  };

  // FONCTION pour charger l'historique des paiements
  const loadPaymentHistory = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/payment/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPaymentHistory(
          data.map((item: any) => ({
            id: item.id,
            operator: item.operator,
            phoneNumber: item.phone,
            amount: item.amount,
            date: item.date,
            status: item.status.toLowerCase(),
          }))
        );
      }
    } catch (error) {
      console.error("Erreur historique :", error);
    }
  };

  // ✅ FONCTION POUR CHARGER LES STATISTIQUES
  const loadStatistics = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/publications/researcher/statistics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des statistiques");
      }

      const data = await response.json();
      console.log("STATISTIQUES :", data);

      setStatistics(data);
    } catch (error) {
      console.error("Erreur statistiques :", error);
    }
  };

  // ✅ CHARGEMENT INITIAL (Abonnement + Historique + Statistiques)
  useEffect(() => {
    loadSubscription();
    loadPaymentHistory();
    loadStatistics();
  }, []);

  // ✅ Réinitialiser renewMode lorsque l'abonnement est rechargé
  useEffect(() => {
    if (subscriptionStatus === 'active' && isPremium) {
      setRenewMode(false);
    }
  }, [subscriptionStatus, isPremium]);

  // Paiement Mobile Money
  const handlePayment = async () => {
    if (!phone || phone.length !== 9 || !phone.startsWith("6")) {
      toast.error("Numéro invalide (ex: 612345678)");
      return;
    }

    if (amount <= 0) {
      toast.error("Montant invalide");
      return;
    }

    setProcessing(true);

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/payment/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            operator,
            phone,
            amount,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          data.message || t("payment_started_success", language)
        );
        setPhone("");
        setAmount(1000);

        // Recharger l'abonnement ET l'historique après paiement
        await loadSubscription();
        await loadPaymentHistory();
      } else {
        toast.error(
          data.detail || t("payment_error", language)
        );
      }
    } catch (error) {
      console.error("Erreur paiement :", error);
      toast.error(t("network_error", language));
    } finally {
      setProcessing(false);
    }
  };

  // ================================================================
  // ✅ FONCTION DE TÉLÉCHARGEMENT DU REÇU PDF (AMÉLIORÉE)
  // ================================================================
  const handleDownloadReceipt = async (paymentId: number) => {
    if (downloadingReceiptId === paymentId) return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      toast.error("Vous devez être connecté.");
      return;
    }

    setDownloadingReceiptId(paymentId);

    try {
      const response = await fetch(
        `${API_BASE_URL}/payment/receipt/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error(error);
        toast.error(t("receipt_download_error", language));
        return;
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `recu_${paymentId}.pdf`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.warn(
        "Téléchargement interrompu (gestionnaire de téléchargement ou navigateur) :",
        err
      );
      // On ne montre plus d'erreur à l'utilisateur ici.
    } finally {
      setDownloadingReceiptId(null);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "project":
        return <Researcher_Project_Tab_Content />;

      case "publication":
        return <Researcher_Publication_Tab_Content />;

      case "course":
        return <Researcher_Cours_Tab_Content researcherId={researcherId} />;

      case "distinction":
        return (
          <Researcher_Distinction_Tab_Content
            researcherId={researcherId}
          />
        );

      case "media":
        return <Researcher_Media_Tab_Content researcherId={researcherId} />;

      case "resume":
        return (
          <div className="mt-[-20px]">
            <Resume editable={true} />
            <div className="mt-6">
              <CVUpload />
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="mt-10 text-center text-gray-600 text-lg">
            <PersonalInfoCard
              researcherId={researcherId}
              mode={mode}
            />
          </div>
        );

      case "messages":
        return <MessagesView />;

      case "payment":
        return (
          <div className="max-w-3xl mx-auto mt-8 space-y-8">
            
            {/* 1. Carte Premium */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl p-6 text-white shadow-lg relative">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold flex items-center gap-2">
                    ⭐ PREMIUM
                  </h2>
                  <p className="mt-2 text-blue-100 text-sm">
                    {t("premium_description", language)}
                  </p>
                  <ul className="mt-4 space-y-1 text-sm text-blue-100">
                    <li>✔ {t("unlimited_publications", language)}</li>
                    <li>✔ {t("featured_profile", language)}</li>
                    <li>✔ {t("priority_search", language)}</li>
                    <li>✔ {t("full_statistics_access", language)}</li>
                    <li>✔ {t("priority_support", language)}</li>
                  </ul>
                  <div className="mt-6">
                    <span className="text-4xl font-bold">5 000 FCFA</span>
                    <span className="ml-2 text-blue-100">
                      / {t("month", language).toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Badge Statut */}
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-right min-w-[160px]">
                  <p className="text-xs uppercase tracking-wider text-blue-200 mb-1">
                    {t("status", language)}
                  </p>
                  {loadingSubscription ? (
                    <p className="text-sm text-white animate-pulse">
                      {t("loading", language)}
                    </p>
                  ) : subscriptionStatus === 'active' && isPremium ? (
                    <div className="flex flex-col items-end">
                      <span className="flex items-center gap-1 text-sm font-bold text-white">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        {t("premium_active", language)}
                      </span>
                      <p className="text-xs text-blue-200 mt-1">
                        {t("expires_on", language)} :
                      </p>
                      <p className="text-sm font-medium">{formatDate(expiryDate || '')}</p>
                      <p className="text-xs text-blue-200 mt-1">
                        {t("days_remaining", language)} :
                      </p>
                      <p className="text-sm font-medium">{getDaysRemaining()} jours</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className="flex items-center gap-1 text-sm font-bold text-gray-300">
                        <span className="w-2 h-2 rounded-full bg-red-400"></span>
                        {t("no_subscription", language)}
                      </span>
                      <p className="text-xs text-gray-300 mt-1">
                        {t("subscribe_now", language)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Formulaire de Paiement */}
            <div className="bg-white rounded-xl shadow border p-6">
              <h3 className="text-xl font-semibold mb-5">
                {subscriptionStatus === 'active' && isPremium
                  ? t("subscription_management", language)
                  : t("mobile_money_payment", language)}
              </h3>

              {loadingSubscription ? (
                <div className="py-6 text-center text-gray-500">
                  {t("loading_subscription", language)}
                </div>
              ) : subscriptionStatus === 'active' && isPremium && !renewMode ? (
                <div className="text-center py-6 space-y-4">
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-lg">
                    <p className="font-medium">✅ {t("already_subscribed", language)}</p>
                    <p className="text-sm mt-1">
                      {t("subscription_expires", language)}{" "}
                      <span className="font-bold">{formatDate(expiryDate || '')}</span>.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="bg-[#1F3A5F] text-white px-6 py-2 rounded-lg hover:bg-[#29598e] transition"
                    onClick={() => {
                      setOperator("orange");
                      setPhone("");
                      setAmount(5000);
                      setRenewMode(true);
                    }}
                  >
                    {t("renew", language)}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="orange">Orange Money</option>
                    <option value="mtn">MTN Mobile Money</option>
                  </select>

                  <input
                    type="tel"
                    placeholder="Numéro (ex: 612345678)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />

                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full border rounded-lg p-3"
                  />

                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3"
                  >
                    {processing
                      ? t("payment_in_progress", language)
                      : "Payer maintenant"}
                  </button>
                </div>
              )}
            </div>

            {/* 3. Historique des paiements */}
            <div className="bg-white rounded-xl shadow border p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiFileText className="text-blue-600" />
                {t("payment_history", language)}
              </h3>
              
              {paymentHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {t("no_payment_recorded", language)}
                </p>
              ) : (
                <div className="space-y-4">
                  {paymentHistory.map((payment) => {
                    const { bg, text, icon } = getOperatorColors(payment.operator);
                    return (
                      <div key={payment.id} className="border rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm hover:shadow-md transition gap-4">
                        
                        {/* GAUCHE : Informations principales */}
                        <div className="flex-1 space-y-2">
                          {/* Opérateur avec badge */}
                          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${bg} ${text} text-sm font-medium`}>
                            <span>{icon}</span>
                            {payment.operator}
                          </div>
                          
                          {/* Détails secondaires */}
                          <div className="space-y-1 mt-2 text-sm text-gray-600 pl-1">
                            <div className="flex items-center gap-2">
                              <FiPhone size={14} className="text-gray-400" />
                              <span>{payment.phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiCalendar size={14} className="text-gray-400" />
                              <span>{formatDate(payment.date)}</span>
                            </div>
                          </div>
                        </div>

                        {/* DROITE : Montant & Statut */}
                        <div className="flex flex-col items-end gap-2 md:border-l md:border-gray-200 md:pl-6 w-full md:w-auto">
                          {/* Badge de prix */}
                          <span className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold border border-green-100">
                            {payment.amount.toLocaleString()} FCFA
                          </span>
                          
                          <div className="flex flex-col items-end gap-1 mt-1">
                            <span className="text-[10px] uppercase tracking-wider text-gray-400">
                              Premium • Mensuel
                            </span>
                            
                            <div className="flex items-center gap-2">
                              {payment.status === 'success' && (
                                <>
                                  <span className="text-green-600 font-medium text-sm">✔ Réussi</span>
                                </>
                              )}
                              {payment.status === 'pending' && (
                                <span className="text-yellow-600 font-medium text-sm">En attente</span>
                              )}
                              {payment.status === 'failed' && (
                                <span className="text-red-600 font-medium text-sm">Échoué</span>
                              )}
                            </div>
                            
                            {payment.status === 'success' && (
                              <button
                                type="button"
                                disabled={downloadingReceiptId === payment.id}
                                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-1.5 rounded-full transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleDownloadReceipt(payment.id)}
                              >
                                <FiDownload size={14} />
                                {downloadingReceiptId === payment.id
                                  ? t("downloading", language)
                                  : "Télécharger le reçu"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        );

      // ✅ NOUVEAU DESIGN DES STATISTIQUES (Cartes élégantes)
      case "statistics":
        return (
          <div className="mt-10 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-[#1F3A5F] border-b pb-4">
              {t("stats_title", language) || "Mes statistiques"}
            </h2>

            {!statistics ? (
              <div className="text-center py-10 text-gray-500">
                {t("loading_statistics", language)}
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* Ligne du haut : 4 cartes principales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Publications */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
                    <div className="text-3xl mb-1">📄</div>
                    <div className="text-2xl font-bold text-[#1F3A5F]">
                      {statistics.publications ?? 0}
                    </div>
                    <div className="text-sm text-gray-500 font-medium mt-1">
                      {t("publication_section", language) || "Publications"}
                    </div>
                  </div>

                  {/* Projets */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
                    <div className="text-3xl mb-1">🚀</div>
                    <div className="text-2xl font-bold text-[#1F3A5F]">
                      {statistics.projects ?? 0}
                    </div>
                    <div className="text-sm text-gray-500 font-medium mt-1">
                      {t("project_section", language) || "Projets"}
                    </div>
                  </div>

                  {/* Likes */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
                    <div className="text-3xl mb-1">❤️</div>
                    <div className="text-2xl font-bold text-[#1F3A5F]">
                      {statistics.likes ?? 0}
                    </div>
                    <div className="text-sm text-gray-500 font-medium mt-1">
                      {t("likes", language) || "Likes"}
                    </div>
                  </div>

                  {/* Favoris */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
                    <div className="text-3xl mb-1">⭐</div>
                    <div className="text-2xl font-bold text-[#1F3A5F]">
                      {statistics.favorites ?? 0}
                    </div>
                    <div className="text-sm text-gray-500 font-medium mt-1">
                      {t("favorites", language) || "Favoris"}
                    </div>
                  </div>
                </div>

                {/* Ligne du bas : 2 cartes plus larges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Commentaires */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">💬</span>
                      <div>
                        <div className="text-sm text-gray-500 font-medium">
                          {t("comments", language) || "Commentaires"}
                        </div>
                        <div className="text-2xl font-bold text-[#1F3A5F]">
                          {statistics.comments ?? 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vues des publications */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">👁️</span>
                      <div>
                        <div className="text-sm text-gray-500 font-medium">
                          {t("publication_views", language) || "Vues des publications"}
                        </div>
                        <div className="text-2xl font-bold text-[#1F3A5F]">
                          {statistics.publication_views ?? 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carte Premium (Statut de l'abonnement) */}
                <div className={`bg-gradient-to-r rounded-xl p-6 shadow-md ${statistics.premium ? 'from-green-500 to-green-700 text-white' : 'from-gray-100 to-gray-200 text-gray-600 border border-gray-200'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{statistics.premium ? '👑' : '🔒'}</span>
                      <div>
                        <div className="text-lg font-bold">
                          {statistics.premium ? t("premium_active", language) : t("premium_inactive", language)}
                        </div>
                        <div className={statistics.premium ? 'text-green-100 text-sm' : 'text-gray-500 text-sm'}>
                          {statistics.premium 
                            ? `${t("premium_plan", language) || "Plan"} : ${statistics.premium_plan}`
                            : (t("upgrade_to_premium", language) || "Passez à Premium pour plus de fonctionnalités.")}
                        </div>
                      </div>
                    </div>
                    
                    {statistics.premium && statistics.premium_end_date && (
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-right min-w-[140px]">
                        <div className="text-xs uppercase opacity-90">{t("expires_on", language) || "Expire le"}</div>
                        <div className="font-medium">{formatDate(statistics.premium_end_date)}</div>
                        <div className="text-xs mt-1 opacity-80">
                          {getDaysRemaining()} {t("days_remaining", language) || "jours restants"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-10 py-6">
      <div className="flex justify-between items-center w-full h-13">
        <div className="flex gap-0 p-2 rounded-full h-13 w-fit">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center text-sm gap-2 px-6 py-2 rounded-full transition-all ${
                activeTab === tab.id
                  ? "bg-[#E6EEF7] text-[#474747]"
                  : "text-[#A8A8A8] hover:bg-gray-200/30"
              }`}
            >
              {t(tab.label, language)}
            </button>
          ))}
        </div>

        {/*
        {admin && mode === "create" && (
          <button
            type="button"
            onClick={handlePublish}
            className="cursor-pointer flex p-2 text-sm px-3 rounded-lg gap-2 items-center bg-[#003F7F] text-white"
          >
            <FiUpload size={17} />
            {t("publish", language)}
          </button>
        )}
        */}
      </div>

      {renderContent()}
    </div>
  );
};

export default ResearcherDashboard;