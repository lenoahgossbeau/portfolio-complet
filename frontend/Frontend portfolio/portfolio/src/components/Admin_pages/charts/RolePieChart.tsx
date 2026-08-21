'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

import { Pie } from 'react-chartjs-2';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations'; // ✅ IMPORT AJOUTÉ

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

type Props = {
  data: {
    role: string;
    count: number;
  }[];
};

export default function RolePieChart({ data }: Props) {
  const { language } = useLanguage();

  // ✅ Traduction des rôles en fonction de la langue
  const labels = data.map((item) => {
    if (item.role === "researcher") {
      return t("researcher", language);
    }

    if (item.role === "super_admin") {
      return t("super_admin", language);
    }

    if (item.role === "admin") {
      return t("administrator", language);
    }

    if (item.role === "user") {
      return t("user", language);
    }

    return item.role;
  });

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 h-[450px] flex items-center justify-center">
      <Pie
        style={{
          maxHeight: "360px",
          maxWidth: "360px",
        }}
        data={{
          // ✅ Utilisation des labels traduits
          labels: labels,
          datasets: [
            {
              data: data.map((item) => item.count),
              backgroundColor: [
                '#2563eb',
                '#10b981',
                '#f59e0b',
                '#ef4444',
                '#8b5cf6',
                '#06b6d4',
              ],
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              // ✅ UTILISATION DE LA TRADUCTION
              text: t('roles_distribution', language),
            },
            legend: {
              position: 'bottom',
            },
          },
        }}
      />
    </div>
  );
}