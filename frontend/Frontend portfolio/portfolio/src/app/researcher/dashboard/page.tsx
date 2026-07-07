<<<<<<< HEAD
=======
'use client';
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "@/components/Researcher_pages/ResearcherNavBar"
import Tabbar from '@/components/Researcher_pages/ResearcherTabBar'
<<<<<<< HEAD

export default function page() {
  return (
    <div>
        {/** For creating new researcher */}
        <Navbar />
        <Tabbar admin={true} mode="create" />
    
=======
import { useLanguage } from '@/hooks/useLanguage';

export default function Page() {
  const { language } = useLanguage();

  return (
    <div key={language}>
      <Navbar />
      <Tabbar admin={true} mode="create" />
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
    </div>
  )
}