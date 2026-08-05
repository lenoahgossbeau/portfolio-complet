"use client";

import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { API_BASE_URL, fetchWithAuth } from "@/lib/api";

interface Props {
  publicationId: number;
  onFavoriteChanged?: () => void;
}

interface FavoriteResponse {
  publication_id: number;
  favorites_count: number;
  user_has_favorited: boolean;
}

export default function PublicationFavorite({
  publicationId,
  onFavoriteChanged,
}: Props) {
  const [favorite, setFavorite] = useState(false);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [loading, setLoading] = useState(false);

  async function loadFavorites() {
    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/publications/${publicationId}/favorites/stats`
      );

      if (!res.ok) {
        console.error("Erreur favoris :", res.status);
        return;
      }

      const data: FavoriteResponse = await res.json();

      setFavorite(data.user_has_favorited);
      setTotalFavorites(data.favorites_count);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadFavorites();
  }, [publicationId]);

  async function toggleFavorite() {
    if (loading) return;

    setLoading(true);

    try {
      const method = favorite ? "DELETE" : "POST";

      const res = await fetchWithAuth(
        `${API_BASE_URL}/publications/${publicationId}/favorite`,
        {
          method,
        }
      );

      if (!res.ok) {
        console.error("Erreur :", res.status);
        return;
      }

      const data: FavoriteResponse = await res.json();

      setFavorite(data.user_has_favorited);
      setTotalFavorites(data.favorites_count);

      onFavoriteChanged?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50 transition ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {favorite ? (
        <FaStar className="text-yellow-500 text-lg" />
      ) : (
        <FiStar className="text-lg" />
      )}

      <span className="font-medium">
        {totalFavorites}
      </span>
    </button>
  );
}