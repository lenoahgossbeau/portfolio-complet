"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiExternalLink,
} from "react-icons/fi";
import { API_BASE_URL } from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/locales/translations";

interface ProjectDetailProps {
  project: {
    id: number;
    title: string;
    description?: string;
    year?: number | string;
    image?: string;
    budget?: number | null;
    coauthor?: string[];
    link?: string;
  };
}

export default function ProjectDetail({
  project,
}: ProjectDetailProps) {
  const router = useRouter();
  const { language } = useLanguage();

  const imageSrc =
    project.image && project.image !== ""
      ? project.image.startsWith("http")
        ? project.image
        : `${API_BASE_URL}${project.image}`
      : "/favicon.ico";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Bouton Retour */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#1F3A5F] hover:text-blue-700 mb-4"
      >
        <FiArrowLeft />
        {t("back", language)}
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* ✅ 1. Image agrandie pour un effet immersif */}
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-t-2xl bg-gray-100 shadow-inner">
          <Image
            src={imageSrc}
            alt={project.title}
            fill
            className="object-contain bg-gray-100 p-4"
            unoptimized
          />
        </div>

        {/* Contenu */}
        <div className="p-10">

          {/* ✅ 2. Titre rapproché (mt-8 au lieu de mt-10) */}
          <h1 className="mt-8 text-4xl font-bold text-[#1F3A5F] mb-10">
            {project.title}
          </h1>

          {/* ========================================= */}
          {/* 📄 SECTION 1 : DESCRIPTION                 */}
          {/* ========================================= */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-[#1F3A5F] mb-4 flex items-center gap-3">
              <span className="text-3xl">📄</span>
              {t("description", language)}
            </h2>

            <p className="text-gray-700 leading-8 whitespace-pre-line mb-6">
              {project.description || t("no_description", language)}
            </p>
            
            <hr className="border-gray-200" />
          </div>

          {/* ========================================= */}
          {/* 🎯 SECTION 2 : INFORMATIONS (Année, Budget, Collaborateurs) */}
          {/* ========================================= */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-[#1F3A5F] mb-6 flex items-center gap-3">
              <span className="text-3xl">📊</span>
              {t("project_details", language)}
            </h2>

            {/* ✅ 3. Année compacte (badge au lieu d'une grande carte) */}
            <div
              className={`grid gap-4 ${
                (project.budget !== null && project.budget !== undefined) ||
                (project.coauthor && project.coauthor.length > 0)
                  ? "grid-cols-1 md:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {/* Année - Badge compact */}
              {project.year && (
                <div className="flex items-center gap-3 border rounded-full px-5 py-3 bg-white shadow-sm hover:shadow-md transition w-fit">
                  <span className="text-lg">📅</span>
                  <span className="font-semibold text-lg">{project.year}</span>
                </div>
              )}

              {/* Budget */}
              {project.budget !== null &&
                project.budget !== undefined && (
                  <div className="border rounded-xl p-5">
                    <p className="text-sm text-gray-500 mb-2">💰 {t("budget", language)}</p>
                    <p className="font-semibold text-lg">
                      {Number(project.budget).toLocaleString()} €
                    </p>
                  </div>
                )}

              {/* Collaborateurs */}
              {project.coauthor &&
                project.coauthor.length > 0 && (
                  <div className="border rounded-xl p-5">
                    <p className="text-sm text-gray-500 mb-2">
                      👥 {t("collaborators", language)}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.coauthor.map((author, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-[#1F3A5F] px-3 py-1 rounded-full text-sm"
                        >
                          {author}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
            
            <hr className="border-gray-200 mt-10" />
          </div>

          {/* ========================================= */}
          {/* 🔗 SECTION 3 : LIEN DU PROJET              */}
          {/* ========================================= */}
          {project.link && (
            <div>
              <h2 className="text-2xl font-semibold text-[#1F3A5F] mb-4 flex items-center gap-3">
                <span className="text-3xl">🔗</span>
                {t("link", language)}
              </h2>

              {/* ✅ 4. Bouton centré avec ombre dynamique */}
              <div className="flex justify-center mt-8">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#1F3A5F] hover:bg-[#29598e] text-white px-8 py-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {t("view_project", language)}
                  <FiExternalLink />
                </a>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}