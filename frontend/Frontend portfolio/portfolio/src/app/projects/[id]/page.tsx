"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProjectDetail from "@/components/ProjectDetail";
import { API_ENDPOINTS, fetchWithAuth } from "@/lib/api";

export default function ProjectPage() {
  const params = useParams();
  const id = params.id;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("Veuillez vous connecter");
          return;
        }

        const response = await fetchWithAuth(
          `${API_ENDPOINTS.projects}${id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Projet non trouvé");
          }

          throw new Error(
            "Erreur lors du chargement du projet"
          );
        }

        const data = await response.json();

        setProject({
          id: data.id,
          title: data.title,
          description: data.description || "",
          year: data.year,
          image: data.image || "",
          budget: data.budget ?? null,
          coauthor: Array.isArray(data.coauthor)
            ? data.coauthor
            : [],
          link: data.link || "",
        });
      } catch (err: any) {
        console.error(
          "Erreur chargement projet :",
          err
        );

        setError(
          err?.message ||
            "Impossible de charger le projet"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 pt-24">
          <div className="max-w-5xl mx-auto px-4 py-16 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1F3A5F] border-r-transparent" />

            <p className="mt-4 text-gray-500">
              Chargement du projet...
            </p>
          </div>
        </main>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 pt-24">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <div className="bg-white border border-red-100 shadow-sm rounded-2xl p-10 text-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Projet indisponible
              </h1>

              <p className="mt-3 text-red-600">
                {error || "Projet non trouvé"}
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectDetail project={project} />
        </div>
      </main>
    </>
  );
}