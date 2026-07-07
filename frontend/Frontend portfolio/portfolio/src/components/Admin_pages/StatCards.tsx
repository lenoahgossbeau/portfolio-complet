import red_wave from "@/assets/red_wave.png"
import blue_wave from "@/assets/blue_wave.png"
import green_wave from "@/assets/green_wave.png"
import dollar_sign from "@/assets/currency-dollar.png"
import refresh from "@/assets/refresh.png"
import summation_sign from "@/assets/summation_sign.png"
import Image from "next/image"
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

type Props = {
  stats: {
    total: number;
    revenue: number;
    renewalRate: number;
  };
};

export default function SubscriptionStats({ stats }: Props) {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="relative flex flex-row gap-2 bg-white border border-gray-300 shadow rounded-xl p-5">
        <div className="w-12 h-12 bg-[#33557D] rounded-3xl">
          <Image src={summation_sign} alt="summation_sign" className="relative left-[11px] top-[10px] w-[23px]" />
        </div>
        <div className="text-left">
          <p className="text-2xl font-semibold">{stats.total}</p>
          <p className="text-gray-500 text-sm">{t('total_subscriptions', language)}</p>
        </div>
<<<<<<< HEAD
        <Image src={blue_wave} alt="blue_wave" className="absolute top-17 right-2" />
=======
        <Image src={blue_wave} alt="blue_wave" className="absolute top-17 right-2 pointer-events-none" />
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
      </div>

      <div className="relative flex flex-row gap-2 bg-white border border-gray-300 shadow rounded-xl p-5">
        <div className="w-12 h-12 bg-[#33557D] rounded-3xl">
          <Image src={refresh} alt="refresh" className="relative left-[7px] top-[7px]" />
        </div>
        <div className="text-left">
          <p className="text-2xl font-semibold">{stats.renewalRate}%</p>
          <p className="text-gray-500 text-sm">{t('renewal_rate', language)}</p>
        </div>
<<<<<<< HEAD
        <Image src={green_wave} alt="green_wave" className="absolute top-17 right-2" />
=======
        <Image src={green_wave} alt="green_wave" className="absolute top-17 right-2 pointer-events-none" />
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
      </div>

      <div className="relative flex flex-row gap-2 bg-white border border-gray-300 shadow rounded-xl p-5">
        <div className="w-12 h-12 bg-[#33557D] rounded-3xl">
          <Image src={dollar_sign} alt="dollar_sign" className="relative left-[7px] top-[7px]" />
        </div>
        <div className="text-left">
          <p className="text-2xl font-semibold">${stats.revenue}</p>
          <p className="text-gray-500 text-sm">{t('total_revenue', language)}</p>
        </div>
<<<<<<< HEAD
        <Image src={red_wave} alt="red_wave" className="absolute top-17 right-2" />
=======
        <Image src={red_wave} alt="red_wave" className="absolute top-17 right-2 pointer-events-none" />
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
      </div>
    </div>
  );
}