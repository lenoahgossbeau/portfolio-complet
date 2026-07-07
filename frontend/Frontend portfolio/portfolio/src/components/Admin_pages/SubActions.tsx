<<<<<<< HEAD
export default function SubscriptionActions({ subscriptions }: any) {

  const exportCSV = () => {
    try {
      console.log("CLICK CSV");
      console.log("DATA:", subscriptions);

      // ✅ Vérification des données
      if (!subscriptions || subscriptions.length === 0) {
        alert("Aucune donnée à exporter");
        return;
      }

      // ✅ En-têtes
      const headers = ["Username", "Email", "Amount", "Started At", "Next Billing Date"];

      // ✅ Lignes
      const rows = subscriptions.map((s: any) => [
        s.username ?? "",
        s.email ?? "",
        s.amount ?? "",
        s.startedAt ?? "",
        s.nextBillingDate ?? ""
      ]);

      // ✅ Création CSV propre
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(","))
        .join("\n");

      // ✅ Blob UTF-8 (important pour Excel)
      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;"
      });

      const url = URL.createObjectURL(blob);

      // ✅ Téléchargement forcé
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "subscriptions.csv");
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Erreur export CSV :", err);
      alert("Erreur lors de l'export CSV");
    }
  };

  const exportPDF = () => {
    window.open("http://localhost:8000/admin/dashboard/export/pdf", "_blank");
  };

  return (
    <div className="flex justify-end gap-3">
      
      {/* ✅ CSV */}
      <button
        type="button"
        onClick={exportCSV}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Export CSV
      </button>

      {/* ✅ PDF */}
      <button
        type="button"
        onClick={exportPDF}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Export PDF
      </button>

    </div>
=======
'use client';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import toast from 'react-hot-toast';

type Props = {
  subscriptions: any[];
};

export default function SubscriptionActions({ subscriptions }: Props) {
  const { language } = useLanguage();

  const exportCSV = () => {
    console.log("=== EXPORT CSV ===");
    console.log("subscriptions reçues:", subscriptions);
    console.log("type:", typeof subscriptions);
    console.log("longueur:", subscriptions?.length);
    
    if (!subscriptions || subscriptions.length === 0) {
      toast.error(t('no_data_to_export', language));
      return;
    }

    try {
      const headers = [
        t('id', language),
        t('profile_id', language),
        t('start_date', language),
        t('end_date', language),
        t('type', language),
        t('payment_method', language)
      ];

      const rows = subscriptions.map((s: any) => [
        s.id ?? "",
        s.profile_id ?? "",
        s.start_date ?? "",
        s.end_date ?? "",
        s.type ?? "",
        s.payment_method ?? ""
      ]);

      let csvContent = headers.join(",") + "\n";
      rows.forEach(row => {
        csvContent += row.join(",") + "\n";
      });

      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `subscriptions_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log("CSV exporté avec succès !");
      toast.success(t('export_csv_success', language));  // ← MODIFIÉ ICI
      
    } catch (err) {
      console.error("Erreur:", err);
      toast.error(t('export_error', language));
    }
  };

  return (
    <button
      type="button"
      onClick={exportCSV}
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
    >
      {t('export', language)}
    </button>
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
  );
}