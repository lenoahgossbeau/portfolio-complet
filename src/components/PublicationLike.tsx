"use client";

import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { API_BASE_URL, fetchWithAuth } from "@/lib/api";

interface Props {
  publicationId: number;
  onLikeChanged?: () => void;
}

interface LikeResponse {
  publication_id: number;
  likes_count: number;
  user_has_liked: boolean;
}

export default function PublicationLike({
  publicationId,
  onLikeChanged,
}: Props) {
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [loading, setLoading] = useState(false);

  async function loadLikes() {
    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/publications/${publicationId}/likes/stats`
      );

      if (!res.ok) {
        console.error("Erreur :", res.status);
        return;
      }

      const data: LikeResponse = await res.json();

      setLiked(data.user_has_liked);
      setTotalLikes(data.likes_count);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadLikes();
  }, [publicationId]);

  async function toggleLike() {
    if (loading) return;

    setLoading(true);

    try {
      const method = liked ? "DELETE" : "POST";

      const res = await fetchWithAuth(
        `${API_BASE_URL}/publications/${publicationId}/like`,
        {
          method,
        }
      );

      if (!res.ok) {
        console.error("Erreur :", res.status);
        return;
      }

      const data: LikeResponse = await res.json();

      setLiked(data.user_has_liked);
      setTotalLikes(data.likes_count);

      // ✅ Informe PublicationActions que les statistiques doivent être rechargées
      onLikeChanged?.();

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50 transition ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {liked ? (
        <FaHeart className="text-red-500 text-lg" />
      ) : (
        <FiHeart className="text-lg" />
      )}

      <span className="font-medium">{totalLikes}</span>
    </button>
  );
}