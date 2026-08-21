'use client';

import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "@/components/Researcher_pages/ResearcherNavBar";
import Tabbar from '@/components/Researcher_pages/ResearcherTabBar';
import { useLanguage } from '@/hooks/useLanguage';

export default function Page() {
  const { language } = useLanguage();

  return (
    <div key={language}>
      <Navbar />
      <Tabbar admin={true} mode="create" />
    </div>
  );
}