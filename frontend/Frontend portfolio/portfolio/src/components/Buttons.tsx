<<<<<<< HEAD
import React from 'react'
import { IoIosArrowForward } from "react-icons/io";
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

export default function Buttons() {
  const { language } = useLanguage();
  
  return (
    <button className="cursor-pointer flex items-center gap-2 mt-6 px-3 py-3 bg-[#002754] font-md text-white rounded-2xl shadow-md hover:bg-[#001B40] transition">
      {t('get_in_touch', language)} <IoIosArrowForward />
    </button>
  )
=======
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
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
}

export function ProjectButtons() {
  const { language } = useLanguage();
<<<<<<< HEAD
  
  return (
    <button className="cursor-pointer flex items-center gap-2 mt-6 px-4 py-3 bg-[#002754] font-md text-white rounded-2xl shadow-md hover:bg-[#001B40] transition">
      {t('view_all', language)}
    </button>
  )
=======

  return (
    <button className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-[#002754] text-white rounded-xl shadow-md hover:bg-[#001B40] transition">
      {t('view_all', language)}
    </button>
  );
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
}