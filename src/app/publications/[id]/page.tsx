// src/app/publications/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_ENDPOINTS, fetchWithAuth } from "@/lib/api";
import PublicationDetail from "@/components/PublicationDetail";
import Navbar from "@/components/Navbar";

export default function PublicationPage() {
  const params = useParams();
  const id = params.id;

  const [publication, setPublication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("Veuillez vous connecter");
          setLoading(false);
          return;
        }

        const response = await fetchWithAuth(
          `${API_ENDPOINTS.publications}${id}`
        );

        if (!response.ok) {
          throw new Error("Publication non trouvée");
        }

        const data = await response.json();

        // Formater les données pour PublicationDetail
        setPublication({
          id: data.id,
          title: data.title,
          description: data.description || "",
          date: data.year?.toString() || "",
          image: data.image || "",
          author: data.coauthor || [],
          journal: data.journal || "",
          doi: data.doi || "",
          link: data.link || "",
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPublication();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          Chargement...
        </div>
      </>
    );
  }

  if (error || !publication) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center text-red-600">
          {error || "Publication non trouvée"}
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-20">
        <PublicationDetail publication={publication} showComments={true} />
      </div>
    </>
  );
}