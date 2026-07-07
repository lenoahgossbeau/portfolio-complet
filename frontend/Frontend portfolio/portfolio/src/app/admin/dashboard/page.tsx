<<<<<<< HEAD
import React from 'react'
import Sidebar from '@/components/Admin_pages/Sidebar'
import Navbar from '@/components/Researcher_pages/ResearcherNavBar'


export default function page() {
  return (
    <div>

      <Navbar admin = { true } />
      <Sidebar />

    </div>
  )
}
 
=======
'use client';

import { useLanguage } from '@/hooks/useLanguage';
import AdminDashboard from '@/components/Admin_pages/AdminDashboard';
import Navbar from '@/components/Researcher_pages/ResearcherNavBar';

export default function AdminDashboardPage() {
  const { language } = useLanguage();

  return (
    <div key={language}>
      <Navbar admin={true} />
      <AdminDashboard />
    </div>
  );
}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
