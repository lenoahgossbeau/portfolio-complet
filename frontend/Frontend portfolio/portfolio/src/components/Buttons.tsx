'use client';

import React from 'react';
import { IoIosArrowForward } from "react-icons/io";
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import Link from 'next/link';

export default function Buttons() {
  const { language } = useLanguage();

  return (
    <Link href="/contact">
      <button className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-[#002754] text-white rounded-xl shadow-md hover:bg-[#001B40] transition">
        {t('get_in_touch', language)}
        <IoIosArrowForward />
      </button>
    </Link>
  );
}

export function ProjectButtons() {
  const { language } = useLanguage();

  return (
    <button className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-[#002754] text-white rounded-xl shadow-md hover:bg-[#001B40] transition">
      {t('view_all', language)}
    </button>
  );
}