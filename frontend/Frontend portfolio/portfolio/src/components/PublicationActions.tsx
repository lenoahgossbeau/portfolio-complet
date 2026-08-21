// src/components/PublicationActions.tsx
"use client";

import PublicationLike from "@/components/PublicationLike";
import PublicationFavorite from "@/components/PublicationFavorite";
import PublicationStats from "@/components/PublicationStats"; // 👈 AJOUTÉ

interface PublicationActionsProps {
  publicationId: number;
}

export default function PublicationActions({
  publicationId,
}: PublicationActionsProps) {
  console.log("📦 PublicationActions rendu pour publication:", publicationId);
  
  return (
    <div className="flex items-center gap-4">
      {/* ❤️ LIKE */}
      <PublicationLike publicationId={publicationId} />

      {/* ⭐ FAVORI */}
      <PublicationFavorite publicationId={publicationId} />

      {/* 📊 STATISTIQUES */}
      <PublicationStats publicationId={publicationId} /> {/* 👈 AJOUTÉ */}
    </div>
  );
}