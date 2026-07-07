import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "@/components/Researcher_pages/ResearcherNavBar"
import Tabbar from '@/components/Researcher_pages/ResearcherTabBar'


{/** 
export default function page({ params }: { params: { id: number } }) {
  return (
    <div>
      // For editing researcher 
        <Navbar />
        <Tabbar mode="edit" researcherId={params.id} />
    
    </div>
  )
}*/}

interface PageProps {
  params: Promise<{ id: number }>;
}

export default async function Page({ params }: PageProps) {
  // 1. Unwrap the params promise
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="p-4">
        {/** * 2. Pass the unwrapped ID to your Tabbar.
         * Ensure 'Tabbar' component expects a string for researcherId.
         */}
        <Tabbar mode="edit" researcherId={id} />
      </main>
    </div>
  );
}

