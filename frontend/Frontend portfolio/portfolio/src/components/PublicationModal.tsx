// src/components/PublicationModal.tsx
"use client";

import { FiX } from "react-icons/fi";
import PublicationDetail from "@/components/PublicationDetail";

interface PublicationModalProps {
  open: boolean;
  onClose: () => void;
  publication: any;
}

export default function PublicationModal({
  open,
  onClose,
  publication,
}: PublicationModalProps) {
  if (!open || !publication) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full bg-gray-100 p-2 hover:bg-red-100 transition"
        >
          <FiX size={22} />
        </button>

        <PublicationDetail publication={publication} showComments={true} />

      </div>
    </div>
  );
}