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