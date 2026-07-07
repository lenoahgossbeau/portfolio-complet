'use client';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  subscriptions: any[];
};

export default function SubscriptionPieChart({ subscriptions }: Props) {
  const { language } = useLanguage();

  // Compter les abonnements par type
  const typeCount: { [key: string]: number } = {};
  subscriptions.forEach(sub => {
    const type = sub.type || 'Standard';
    typeCount[type] = (typeCount[type] || 0) + 1;
  });

  const types = Object.keys(typeCount);
  const counts = types.map(t => typeCount[t]);

  const colors = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(139, 92, 246, 0.8)',
  ];

  const data = {
    labels: types,
    datasets: [
      {
        data: counts,
        backgroundColor: colors.slice(0, types.length),
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: t('subscription_by_type', language) || 'Répartition par type' },
      tooltip: { callbacks: { label: (ctx: any) => `${ctx.label}: ${ctx.raw} (${((ctx.raw / subscriptions.length) * 100).toFixed(1)}%)` } }
    },
  };

  if (subscriptions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
      <Pie data={data} options={options} />
    </div>
  );
}