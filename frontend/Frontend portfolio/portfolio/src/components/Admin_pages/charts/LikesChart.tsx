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
    month: number;
    value: number;
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

export default function LikesChart({ data }: Props) {
  const { language } = useLanguage();

  const labels = data.map((item) =>
    language === 'fr'
      ? MONTHS_FR[item.month]
      : MONTHS_EN[item.month]
  );

  const values = data.map((item) => item.value);

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
      <Line
        data={{
          labels,
          datasets: [
            {
              label: t('likes', language),
              data: values,
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239,68,68,0.15)',
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
              text: t('likes', language),
            },
          },
        }}
      />
    </div>
  );
}