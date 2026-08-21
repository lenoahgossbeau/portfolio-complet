'use client';

import Modal from "@/components/Modal_structure_Researcher_profile";
import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/locales/translations";
import { API_BASE_URL } from "@/lib/api";
import toast from "react-hot-toast";

type Profile = {
  first_name: string;
  last_name: string;

  gender: string;
  grade: string;
  specialite: string;
  diplome: string;

  description: string;
  bio: string;

  avatar: string;

  email: string;
  linkedin: string;
  whatsapp: string;
  twitter: string;
  github: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  data: Profile;
  onSave: (profile: Profile) => Promise<void>;
};

export default function EditPersonalInfoModal({
  open,
  onClose,
  data,
  onSave,
}: Props) {
  const { language } = useLanguage();

  const [form, setForm] = useState<Profile>(data);

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    grade: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(data?.avatar || "");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm(data);
    setImagePreview(data?.avatar || "");
    setImageFile(null);
  }, [data]);

  const validate = () => {
    const newErrors = {
      first_name: "",
      last_name: "",
      grade: "",
    };

    if (!form.first_name.trim()) {
      newErrors.first_name = t("first_name_required", language);
    }

    if (!form.last_name.trim()) {
      newErrors.last_name = t("last_name_required", language);
    }

    if (!form.grade.trim()) {
      newErrors.grade = t("grade_required", language);
    }

    setErrors(newErrors);

    return (
      !newErrors.first_name &&
      !newErrors.last_name &&
      !newErrors.grade
    );
  };

  const update = (key: keyof Profile, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (
      key === "first_name" ||
      key === "last_name" ||
      key === "grade"
    ) {
      setErrors((prev) => ({
        ...prev,
        [key]: "",
      }));
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Seuls les fichiers image sont acceptés");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2MB");
      return;
    }

    setImageFile(file);

    const preview = URL.createObjectURL(file);

    setImagePreview(preview);
  };

  const uploadImage = async (
    file: File
  ): Promise<string | null> => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      toast.error("Vous devez être connecté");
      return null;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await fetch(
        `${API_BASE_URL}/profiles/upload-photo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        return result.photo_url;
      }

      toast.error(
        result.detail ??
          t("download_error", language)
      );

      return null;
    } catch {
      toast.error(t("network_error", language));
      return null;
    }
  };

  const handleSave = async () => {
    if (!validate()) return;

    setUploading(true);

    try {
      let avatarUrl = form.avatar;

      if (imageFile) {
        const uploaded = await uploadImage(imageFile);

        if (!uploaded) {
          setUploading(false);
          return;
        }

        avatarUrl = uploaded;
      }

      await onSave({
        ...form,
        avatar: avatarUrl,
      });

      onClose();
    } catch (error) {
      console.error(error);
      toast.error(t("save_error", language));
    } finally {
      setUploading(false);
    }
  };

  if (!form) {
    return null;
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {t("personal_info", language)}
        </h3>

        <button
          type="button"
          onClick={handleSave}
          disabled={uploading}
          className={`text-blue-600 font-medium ${
            uploading
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {uploading
            ? t("downloading", language)
            : t("save", language)}
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <label className="cursor-pointer">
          <img
            src={imagePreview || "/favicon.ico"}
            className="w-44 h-44 rounded-full object-cover border-2 border-gray-200"
            alt="Profile"
            onError={(e) => {
              e.currentTarget.src = "/favicon.ico";
            }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <p className="text-center text-xs text-gray-500 mt-2">
            {language === "fr"
              ? "Cliquez pour changer la photo"
              : "Click to change photo"}
          </p>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="text-sm font-medium">
            {t("first_name", language)}
          </label>

          <input
            className="w-full border rounded-lg p-2"
            value={form.first_name}
            onChange={(e) =>
              update("first_name", e.target.value)
            }
          />

          {errors.first_name && (
            <p className="text-red-500 text-sm">
              {errors.first_name}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            {t("last_name", language)}
          </label>

          <input
            className="w-full border rounded-lg p-2"
            value={form.last_name}
            onChange={(e) =>
              update("last_name", e.target.value)
            }
          />

          {errors.last_name && (
            <p className="text-red-500 text-sm">
              {errors.last_name}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            {t("gender", language)}
          </label>

          <select
            className="w-full border rounded-lg p-2"
            value={form.gender}
            onChange={(e) =>
              update("gender", e.target.value)
            }
          >
            <option value="">
              {language === "fr"
                ? "Sélectionner"
                : "Select"}
            </option>

            <option value="Male">
              {language === "fr"
                ? "Homme"
                : "Male"}
            </option>

            <option value="Female">
              {language === "fr"
                ? "Femme"
                : "Female"}
            </option>

            <option value="Other">
              {language === "fr"
                ? "Autre"
                : "Other"}
            </option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">
            {t("grade", language)}
          </label>

          <input
            className="w-full border rounded-lg p-2"
            value={form.grade}
            onChange={(e) =>
              update("grade", e.target.value)
            }
          />

          {errors.grade && (
            <p className="text-red-500 text-sm">
              {errors.grade}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            {t("specialite", language)}
          </label>

          <input
            className="w-full border rounded-lg p-2"
            value={form.specialite}
            onChange={(e) =>
              update("specialite", e.target.value)
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            {t("diplome", language)}
          </label>

          <input
            className="w-full border rounded-lg p-2"
            value={form.diplome}
            onChange={(e) =>
              update("diplome", e.target.value)
            }
          />
        </div>

      </div>

      <div className="mt-5">

        <label className="text-sm font-medium">
          {t("description", language)}
        </label>

        <textarea
          rows={3}
          className="w-full border rounded-lg p-2"
          value={form.description}
          onChange={(e) =>
            update("description", e.target.value)
          }
        />

      </div>

      <div className="mt-5">

        <label className="text-sm font-medium">
          {t("bio", language)}
        </label>

        <textarea
          rows={6}
          className="w-full border rounded-lg p-2"
          value={form.bio}
          onChange={(e) =>
            update("bio", e.target.value)
          }
        />

      </div>

    </Modal>
  );
}