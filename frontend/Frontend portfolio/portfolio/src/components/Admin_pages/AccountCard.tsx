import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HiDotsVertical } from "react-icons/hi";
import { useRouter } from "next/navigation";
import ConfirmModal from "../Researcher_pages/ConfirmModal";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/locales/translations";
import { deleteUser } from "@/lib/adminApi";
import toast from "react-hot-toast";

type Props = {
  researcher: {
    id: number;
    userId?: number;
    name: string;
    profession: string;
    email: string;
    status?: string;
    avatar?: any;
  };
  onDeleted?: () => void;
};

export default function AccountCard({ researcher, onDeleted }: Props) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async () => {
    if (deleting) return;

    setDeleting(true);

    try {
      const userIdToDelete = researcher.userId ?? researcher.id;
      const success = await deleteUser(userIdToDelete);

      if (success) {
        toast.success(t("delete_user_success", language));
        setShowDeleteModal(false);

        if (onDeleted) {
          onDeleted();
        } else {
          window.location.reload();
        }
      } else {
        toast.error(t("delete_user_error", language));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast.error(t("delete_user_error", language));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 relative hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <span
          className={`px-3 py-1 rounded-full text-xs ${
            researcher.status === "active"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {researcher.status === "active"
            ? t("active", language)
            : t("inactive", language)}
        </span>

        <div ref={menuRef}>
          <HiDotsVertical
            onClick={() => setOpen(!open)}
            className="text-gray-500 cursor-pointer text-lg"
          />

          {open && (
            <div className="absolute right-0 mt-2 w-28 bg-white border rounded-lg shadow-md text-sm z-10">
              <button
                onClick={() => {
                  setOpen(false);
                  const userId = researcher.userId ?? researcher.id;
                  router.push(`/researcher/dashboard/${userId}`);
                }}
                className="w-full px-4 py-2 hover:bg-gray-100 text-left"
              >
                {t("edit", language)}
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  setShowDeleteModal(true);
                }}
                className="w-full px-4 py-2 hover:bg-gray-100 text-left text-red-500"
              >
                {t("delete", language)}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center text-center mt-6">
        <Image
          src={researcher.avatar || "/favicon.ico"}
          alt="avatar"
          width={80}
          height={80}
          className="rounded-full object-cover"
        />

        <h3 className="mt-3 font-medium text-sm">{researcher.name}</h3>

        <p className="text-xs text-gray-500">{researcher.profession}</p>

        <span className="mt-3 text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
          {researcher.email}
        </span>
      </div>

      <ConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
