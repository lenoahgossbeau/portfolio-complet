import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Navbar from "@/components/Researcher_pages/ResearcherNavBar";
import Tabbar from "@/components/Researcher_pages/ResearcherTabBar";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="p-4">
        <Tabbar mode="edit" />
      </main>
    </div>
  );
}