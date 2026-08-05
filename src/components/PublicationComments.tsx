"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS, fetchWithAuth } from "@/lib/api";
import { FiSend, FiTrash2 } from "react-icons/fi";

interface PublicationCommentsProps {
  publicationId: number;
}

export default function PublicationComments({
  publicationId,
}: PublicationCommentsProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const loadComments = async () => {
    try {
      const response = await fetchWithAuth(
        `${API_ENDPOINTS.publications}${publicationId}/comments`
      );

      if (!response.ok) return;

      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadComments();
  }, [publicationId]);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setLoading(true);

    try {
      const response = await fetchWithAuth(
        `${API_ENDPOINTS.publications}${publicationId}/comments`,
        {
          method: "POST",
          body: JSON.stringify({
            content,
          }),
        }
      );

      if (response.ok) {
        setContent("");
        loadComments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce commentaire ?")) return;

    try {
      const response = await fetchWithAuth(
        `${API_ENDPOINTS.publications}comments/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        loadComments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-10">

      <h3 className="text-xl font-semibold mb-4">
        Commentaires ({comments.length})
      </h3>

      <div className="flex gap-3">

        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ajouter un commentaire..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#003F7F]"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-lg bg-[#003F7F] px-5 text-white hover:bg-[#0051a8]"
        >
          <FiSend />
        </button>

      </div>

      <div className="mt-6 space-y-4">

        {comments.map((comment) => (

          <div
            key={comment.id}
            className="rounded-xl border border-gray-200 p-4"
          >

            <div className="flex justify-between items-center">

              <strong>
                Utilisateur #{comment.user_id}
              </strong>

              <button
                onClick={() => handleDelete(comment.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash2 />
              </button>

            </div>

            <p className="mt-3 text-gray-700">
              {comment.content}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}