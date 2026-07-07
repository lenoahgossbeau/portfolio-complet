'use client';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  subscriptions: any[];
};

export default function NewSubscriptionsBarChart({ subscriptions }: Props) {
  const { language } = useLanguage();

  // Grouper les nouveaux abonnements par mois
  const subscriptionsByMonth: { [key: string]: number } = {};
  
  subscriptions.forEach(sub => {
    const date = new Date(sub.start_date);
    const monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    subscriptionsByMonth[monthKey] = (subscriptionsByMonth[monthKey] || 0) + 1;
  });

  // Ajouter les 6 derniers mois
  const today = new Date();
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    last6Months.push(monthKey);
  }

  const sortedMonths = [...new Set([...last6Months, ...Object.keys(subscriptionsByMonth)])].sort();
  const counts = sortedMonths.map(month => subscriptionsByMonth[month] || 0);

  const data = {
    labels: sortedMonths,
    datasets: [
      {
        label: t('new_subscriptions', language) || 'Nouveaux abonnements',
        data: counts,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: t('new_subscriptions_chart', language) || 'Nouveaux abonnements par mois' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: t('count', language) || 'Nombre' }, ticks: { stepSize: 1 } },
      x: { title: { display: true, text: t('month', language) || 'Mois' } }
    }
  };

  if (subscriptions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
      <Bar data={data} options={options} />
    </div>
  );
}