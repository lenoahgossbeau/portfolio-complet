"use client";

import { useEffect, useState } from "react";
import { FiEye, FiMessageCircle } from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import { API_BASE_URL, fetchWithAuth } from "@/lib/api";

interface Props {
  publicationId: number;
  refreshKey?: number;
}

interface StatsResponse {
  publication_id: number;
  likes_count: number;
  favorites_count: number;
  comments_count: number;
  views_count: number;
}

export default function PublicationStats({
  publicationId,
  refreshKey = 0,
}: Props) {
  const [stats, setStats] = useState<StatsResponse>({
    publication_id: publicationId,
    likes_count: 0,
    favorites_count: 0,
    comments_count: 0,
    views_count: 0,
  });

  const [loading, setLoading] = useState(true);

  async function loadStats() {
    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/publications/${publicationId}/stats`
      );

      if (!res.ok) {
        console.error("Erreur stats :", res.status);
        return;
      }

      const data: StatsResponse = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, [publicationId, refreshKey]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-gray-400 text-sm">
        Chargement...
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-gray-500 text-sm">
      <span className="flex items-center gap-1">
        <FaHeart className="text-red-400" size={14} />
        {stats.likes_count}
      </span>

      <span className="flex items-center gap-1">
        <FaStar className="text-yellow-400" size={14} />
        {stats.favorites_count}
      </span>

      <span className="flex items-center gap-1">
        <FiMessageCircle className="text-blue-400" size={14} />
        {stats.comments_count}
      </span>

      <span className="flex items-center gap-1">
        <FiEye className="text-gray-400" size={14} />
        {stats.views_count}
      </span>
    </div>
  );
}