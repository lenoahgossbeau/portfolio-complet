'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

import { Line } from 'react-chartjs-2';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type Props = {
  data: {
    year: number;
    month: number;
    amount: number;
  }[];
};

const MONTHS_FR = [
  '',
  'Jan',
  'Fév',
  'Mars',
  'Avr',
  'Mai',
  'Juin',
  'Juil',
  'Août',
  'Sep',
  'Oct',
  'Nov',
  'Déc',
];

const MONTHS_EN = [
  '',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export default function PaymentsChart({ data }: Props) {
  const { language } = useLanguage();

  const labels = data.map((item) => {
    const month =
      language === 'fr'
        ? MONTHS_FR[item.month]
        : MONTHS_EN[item.month];

    return `${month} ${item.year}`;
  });

  const values = data.map((item) => item.amount);

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
      <Line
        data={{
          labels,
          datasets: [
            {
              label: t('monthly_revenue', language),
              data: values,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16,185,129,0.15)',
              fill: true,
              tension: 0.35,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
            title: {
              display: true,
              text: t('monthly_revenue', language),
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.parsed.y ?? 0;

                  return `${value.toLocaleString()} FCFA`;
                },
              },
            },
          },
          scales: {
            y: {
              ticks: {
                callback: (value) => {
                  return `${Number(value).toLocaleString()} FCFA`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
}