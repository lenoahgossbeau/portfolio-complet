'use client';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type Props = {
  subscriptions: any[];
};

export default function ExportPDF({ subscriptions }: Props) {
  const { language } = useLanguage();

  const exportToPDF = () => {
    if (!subscriptions || subscriptions.length === 0) {
      toast.error(t('no_data_to_export', language));
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Titre
      doc.setFontSize(18);
      doc.text(t('subscriptions', language), 14, 20);
      
      // Date d'export (traduite)
      doc.setFontSize(10);
      doc.text(`${t('exported_on', language)}: ${new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR')}`, 14, 30);
      
      // Préparer les données pour le tableau
      const headers = [
        [
          t('id', language), 
          t('profile_id', language), 
          t('start_date', language), 
          t('end_date', language), 
          t('type', language), 
          t('payment_method', language)
        ]
      ];
      
      const rows = subscriptions.map(sub => [
        sub.id,
        sub.profile_id,
        sub.start_date,
        sub.end_date,
        sub.type,
        sub.payment_method
      ]);
      
      // Ajouter le tableau
      autoTable(doc, {
        head: headers,
        body: rows,
        startY: 40,
        theme: 'striped',
        headStyles: { fillColor: [0, 55, 127], textColor: [255, 255, 255] },
        styles: { fontSize: 10, cellPadding: 3 },
      });
      
      // Sauvegarder le PDF
      doc.save(`subscriptions_${new Date().toISOString().slice(0, 19)}.pdf`);
      toast.success(t('export_pdf_success', language));  // ← MODIFIÉ ICI
      
    } catch (err) {
      console.error('Erreur PDF:', err);
      toast.error(t('export_error', language));
    }
  };

  return (
    <button
      type="button"
      onClick={exportToPDF}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
    >
      {t('export_pdf', language)}
    </button>
  );
}