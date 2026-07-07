'use client';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

type Props = {
  subscriptions: any[];
};

export default function RevenueChart({ subscriptions }: Props) {
  const { language } = useLanguage();

  // Grouper les revenus par mois
  const revenuesByMonth: { [key: string]: number } = {};
  
  subscriptions.forEach(sub => {
    const date = new Date(sub.start_date);
    const monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    revenuesByMonth[monthKey] = (revenuesByMonth[monthKey] || 0) + 29.99;
  });

  // Ajouter les 6 derniers mois même sans données
  const today = new Date();
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    last6Months.push(monthKey);
  }

  const sortedMonths = [...new Set([...last6Months, ...Object.keys(revenuesByMonth)])].sort();
  const revenues = sortedMonths.map(month => revenuesByMonth[month] || 0);

  // Traduction des mois pour l'affichage
  const translateMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString(language === 'en' ? 'en' : 'fr', { month: 'short', year: 'numeric' });
  };

  const data = {
    labels: sortedMonths.map(month => translateMonth(month)),
    datasets: [
      {
        label: t('total_revenue', language),
        data: revenues,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointHoverRadius: 6,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { 
        position: 'top' as const, 
        labels: { font: { size: 12 } } 
      },
      title: { 
        display: true, 
        text: t('revenue_chart', language), 
        font: { size: 14 } 
      },
      tooltip: { 
        callbacks: { 
          label: (ctx: any) => `${ctx.raw.toFixed(2)} €` 
        } 
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        title: { display: true, text: '€', font: { size: 12 } } 
      },
      x: { 
        title: { display: true, text: t('month', language), font: { size: 12 } } 
      }
    }
  };

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 bg-white p-6 rounded-xl shadow border">
        {t('no_data', language)}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
      <Line data={data} options={options} />
    </div>
  );
}