// src/components/PublicationDetail.tsx
"use client";

import Image from "next/image";
import { API_BASE_URL, fetchWithAuth } from "@/lib/api"; // ✅ MODIFIÉ
import { FiUser, FiBookOpen, FiExternalLink } from "react-icons/fi";
import PublicationComments from "@/components/PublicationComments";
import PublicationActions from "@/components/PublicationActions";
import { useEffect } from "react"; // ✅ AJOUTÉ

interface PublicationDetailProps {
  publication: {
    id: number;
    title: string;
    description: string;
    date: string;
    image?: string;
    author: string[];
    journal?: string;
    doi?: string;
    link?: string;
  };
  showComments?: boolean;
}

export default function PublicationDetail({
  publication,
  showComments = true,
}: PublicationDetailProps) {
  
  // ✅ AJOUT DU USE EFFECT POUR ENREGISTRER LA VUE
  useEffect(() => {
    async function addView() {
      try {
        await fetchWithAuth(
          `${API_BASE_URL}/publications/${publication.id}/view`,
          {
            method: "POST",
          }
        );
      } catch (err) {
        console.error("Erreur vue :", err);
      }
    }

    addView();
  }, [publication.id]);

  const imageSrc =
    publication.image && publication.image.trim() !== ""
      ? `${API_BASE_URL}${publication.image}`
      : "/favicon.ico";

  return (
    <div className="grid md:grid-cols-2">

      {/* IMAGE */}
      <div className="relative h-[500px]">
        <Image
          src={imageSrc}
          alt={publication.title}
          fill
          className="object-contain"
          unoptimized
        />
      </div>

      {/* CONTENU */}
      <div className="p-8 overflow-y-auto max-h-[80vh]">

        {/* DATE */}
        <span className="inline-block rounded-full bg-[#003F7F] px-4 py-2 text-white font-semibold">
          {publication.date}
        </span>

        {/* TITRE */}
        <h2 className="mt-5 text-3xl font-bold text-gray-900">
          {publication.title}
        </h2>

        {/* DESCRIPTION */}
        <p className="mt-5 italic text-gray-600 leading-7">
          {publication.description}
        </p>

        {/* INFORMATIONS */}
        <div className="mt-8 space-y-6">

          {/* AUTEURS */}
          <div>
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <FiUser />
              Authors
            </div>
            <p className="mt-2 text-gray-600">
              {publication.author?.join(", ")}
            </p>
          </div>

          {/* JOURNAL */}
          {publication.journal && (
            <div>
              <div className="flex items-center gap-2 font-semibold text-gray-800">
                <FiBookOpen />
                Journal
              </div>
              <p className="mt-2 text-gray-600">
                {publication.journal}
              </p>
            </div>
          )}

          {/* DOI */}
          {publication.doi && (
            <div>
              <div className="font-semibold text-gray-800">DOI</div>
              <a
                href={publication.doi}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-blue-600 hover:underline break-all"
              >
                {publication.doi}
              </a>
            </div>
          )}

        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-gray-200 pt-6">

          {publication.link && (
            <a
              href={publication.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#003F7F] px-5 py-3 text-white hover:bg-[#0051a8] transition"
            >
              <FiExternalLink />
              Voir la publication
            </a>
          )}

          {/* LIKES, FAVORIS, STATISTIQUES */}
          <div className="ml-auto">
            <PublicationActions publicationId={publication.id} />
          </div>

        </div>

        {/* COMMENTAIRES */}
        {showComments && (
          <>
            <hr className="my-8" />
            <PublicationComments publicationId={publication.id} />
          </>
        )}

      </div>
    </div>
  );
}