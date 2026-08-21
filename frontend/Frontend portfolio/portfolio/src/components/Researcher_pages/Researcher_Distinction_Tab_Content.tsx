'use client';

import React, { useEffect, useState } from "react";
import {
  FiAward,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import { API_BASE_URL, getProfile } from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/locales/translations";

type Distinction = {
  id: number;
  profile_id: number;
  year: number;
  title: string;
  description?: string | null;
};

type Props = {
  researcherId?: number;
};

export default function Researcher_Distinction_Tab_Content({
  researcherId,
}: Props) {
  const { language } = useLanguage();
  const langKey = language.toLowerCase();

  const [distinctions, setDistinctions] = useState<Distinction[]>([]);
  const [profileId, setProfileId] = useState<number | null>(
    researcherId ?? null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    year: "",
    title: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    year: "",
    title: "",
  });

  // ============================================================
  // RÉCUPÉRER LE PROFIL
  // ============================================================

  const loadProfile = async () => {
    if (researcherId) {
      setProfileId(researcherId);
      return researcherId;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      return null;
    }

    try {
      const profile = await getProfile(token);

      if (profile?.id) {
        setProfileId(profile.id);
        return profile.id;
      }
    } catch (error) {
      console.error("Erreur chargement profil :", error);
    }

    return null;
  };

  // ============================================================
  // CHARGER LES DISTINCTIONS
  // ============================================================

  const fetchDistinctions = async (
    currentProfileId?: number | null
  ) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setDistinctions([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/distinctions/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      const profileToUse = currentProfileId ?? profileId;

      const researcherDistinctions = Array.isArray(data)
        ? data.filter(
            (distinction: Distinction) =>
              !profileToUse ||
              distinction.profile_id === profileToUse
          )
        : [];

      setDistinctions(researcherDistinctions);
    } catch (error) {
      console.error(
        "Erreur chargement distinctions :",
        error
      );

      setDistinctions([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIALISATION
  // ============================================================

  useEffect(() => {
    const init = async () => {
      const currentProfileId = await loadProfile();
      await fetchDistinctions(currentProfileId);
    };

    init();
  }, [researcherId]);

  // ============================================================
  // MODIFIER UN CHAMP
  // ============================================================

  const updateField = (
    field: "year" | "title" | "description",
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (field === "year") {
      setErrors((previous) => ({
        ...previous,
        year: "",
      }));
    }

    if (field === "title") {
      setErrors((previous) => ({
        ...previous,
        title: "",
      }));
    }
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validate = () => {
    const newErrors = {
      year: "",
      title: "",
    };

    if (!form.year.trim()) {
      newErrors.year =
        language.toLowerCase() === "fr"
          ? "L'année est obligatoire."
          : "Year is required.";
    } else if (
      !/^\d{4}$/.test(form.year.trim())
    ) {
      newErrors.year =
        language.toLowerCase() === "fr"
          ? "L'année doit contenir 4 chiffres."
          : "Year must contain 4 digits.";
    }

    if (!form.title.trim()) {
      newErrors.title =
        language.toLowerCase() === "fr"
          ? "Le titre est obligatoire."
          : "Title is required.";
    }

    setErrors(newErrors);

    return !newErrors.year && !newErrors.title;
  };

  // ============================================================
  // RÉINITIALISER LE FORMULAIRE
  // ============================================================

  const resetForm = () => {
    setForm({
      year: "",
      title: "",
      description: "",
    });

    setErrors({
      year: "",
      title: "",
    });

    setEditingId(null);
  };

  // ============================================================
  // CRÉER
  // ============================================================

  const handleCreate = async () => {
    if (!validate()) return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert(
        t("please_login_again", langKey)
      );
      return;
    }

    if (!profileId) {
      alert(
        t("no_profile_found", langKey)
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/distinctions/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            profile_id: profileId,
            year: Number(form.year),
            title: form.title.trim(),
            description:
              form.description.trim() || null,
          }),
        }
      );

      if (!response.ok) {
        let message =
          language.toLowerCase() === "fr"
            ? "Erreur lors de la création de la distinction."
            : "Error creating distinction.";

        try {
          const error = await response.json();

          if (error?.detail) {
            message = error.detail;
          }
        } catch {
          // Réponse non JSON
        }

        throw new Error(message);
      }

      resetForm();

      await fetchDistinctions(profileId);

      alert(
        language.toLowerCase() === "fr"
          ? "Distinction créée avec succès."
          : "Distinction created successfully."
      );
    } catch (error) {
      console.error(
        "Erreur création distinction :",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : language.toLowerCase() === "fr"
          ? "Erreur lors de la création."
          : "Error creating distinction."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // PRÉPARER LA MODIFICATION
  // ============================================================

  const handleEdit = (
    distinction: Distinction
  ) => {
    setEditingId(distinction.id);

    setForm({
      year: String(distinction.year || ""),
      title: distinction.title || "",
      description:
        distinction.description || "",
    });

    setErrors({
      year: "",
      title: "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================
  // ENREGISTRER LA MODIFICATION
  // ============================================================

  const handleSave = async () => {
    if (!validate()) return;

    if (editingId === null) return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert(
        t("please_login_again", langKey)
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/distinctions/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            profile_id: profileId,
            year: Number(form.year),
            title: form.title.trim(),
            description:
              form.description.trim() || null,
          }),
        }
      );

      if (!response.ok) {
        let message =
          language.toLowerCase() === "fr"
            ? "Erreur lors de la modification."
            : "Error updating distinction.";

        try {
          const error = await response.json();

          if (error?.detail) {
            message = error.detail;
          }
        } catch {
          // Réponse non JSON
        }

        throw new Error(message);
      }

      resetForm();

      await fetchDistinctions(profileId);

      alert(
        language.toLowerCase() === "fr"
          ? "Distinction modifiée avec succès."
          : "Distinction updated successfully."
      );
    } catch (error) {
      console.error(
        "Erreur modification distinction :",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : language.toLowerCase() === "fr"
          ? "Erreur lors de la modification."
          : "Error updating distinction."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // SUPPRIMER
  // ============================================================

  const handleDelete = async (id: number) => {
    const confirmed = confirm(
      language.toLowerCase() === "fr"
        ? "Voulez-vous vraiment supprimer cette distinction ?"
        : "Do you really want to delete this distinction?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert(
        t("please_login_again", langKey)
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/distinctions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      if (editingId === id) {
        resetForm();
      }

      await fetchDistinctions(profileId);

      alert(
        language.toLowerCase() === "fr"
          ? "Distinction supprimée avec succès."
          : "Distinction deleted successfully."
      );
    } catch (error) {
      console.error(
        "Erreur suppression distinction :",
        error
      );

      alert(
        language.toLowerCase() === "fr"
          ? "Erreur lors de la suppression."
          : "Error deleting distinction."
      );
    }
  };

  // ============================================================
  // CHARGEMENT
  // ============================================================

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        {language.toLowerCase() === "fr"
          ? "Chargement des distinctions..."
          : "Loading distinctions..."}
      </div>
    );
  }

  // ============================================================
  // INTERFACE
  // ============================================================

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

      {/* FORMULAIRE */}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-white">

          <div className="flex items-center gap-3">

            <FiAward size={28} />

            <div>

              <h2 className="text-xl font-bold">
                {language.toLowerCase() === "fr"
                  ? "Distinctions"
                  : "Awards"}
              </h2>

              <p className="text-blue-100 text-sm mt-1">
                {editingId !== null
                  ? language.toLowerCase() === "fr"
                    ? "Modifier"
                    : "Edit"
                  : language.toLowerCase() === "fr"
                  ? "Ajouter"
                  : "Add"}
              </p>

            </div>

          </div>

        </div>

        <div className="p-6 space-y-5">

          {/* ANNÉE */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language.toLowerCase() === "fr"
                ? "Année"
                : "Year"} *
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={form.year}
              onChange={(e) =>
                updateField(
                  "year",
                  e.target.value.replace(/\D/g, "")
                )
              }
              placeholder={
                language.toLowerCase() === "fr"
                  ? "2026"
                  : "2026"
              }
              className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
                errors.year
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-600"
              }`}
            />

            {errors.year && (
              <p className="text-red-500 text-xs mt-1">
                {errors.year}
              </p>
            )}

          </div>

          {/* TITRE */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language.toLowerCase() === "fr"
                ? "Titre"
                : "Title"} *
            </label>

            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                updateField(
                  "title",
                  e.target.value
                )
              }
              placeholder={
                language.toLowerCase() === "fr"
                  ? "Titre de la distinction"
                  : "Award title"
              }
              className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
                errors.title
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-600"
              }`}
            />

            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title}
              </p>
            )}

          </div>

          {/* DESCRIPTION */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language.toLowerCase() === "fr"
                ? "Description"
                : "Description"}
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                updateField(
                  "description",
                  e.target.value
                )
              }
              placeholder={
                language.toLowerCase() === "fr"
                  ? "Description de la distinction"
                  : "Award description"
              }
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:border-blue-600"
            />

          </div>

          {/* BOUTONS */}

          <div className="flex gap-3 pt-2">

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-600 rounded-lg py-3 hover:bg-gray-50 transition"
              >
                <FiX />

                {language.toLowerCase() === "fr"
                  ? "Annuler"
                  : "Cancel"}
              </button>
            )}

            <button
              type="button"
              onClick={
                editingId !== null
                  ? handleSave
                  : handleCreate
              }
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white rounded-lg py-3 transition"
            >

              {editingId !== null ? (
                <FiEdit2 />
              ) : (
                <FiPlus />
              )}

              {saving
                ? language.toLowerCase() === "fr"
                  ? "Enregistrement..."
                  : "Saving..."
                : editingId !== null
                ? language.toLowerCase() === "fr"
                  ? "Enregistrer"
                  : "Save"
                : language.toLowerCase() === "fr"
                ? "Créer"
                : "Create"}

            </button>

          </div>

        </div>

      </div>

      {/* LISTE */}

      <div className="space-y-5">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold text-gray-800">
              {language.toLowerCase() === "fr"
                ? "Mes distinctions"
                : "My awards"}
            </h2>

            <p className="text-sm text-gray-500">
              {distinctions.length}{" "}
              {language.toLowerCase() === "fr"
                ? distinctions.length > 1
                  ? "distinctions"
                  : "distinction"
                : distinctions.length > 1
                ? "awards"
                : "award"}
            </p>

          </div>

          <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center">
            <FiAward />
          </div>

        </div>

        {distinctions.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">

            <FiAward
              size={45}
              className="mx-auto text-gray-300 mb-4"
            />

            <p className="text-gray-500">
              {language.toLowerCase() === "fr"
                ? "Aucune distinction enregistrée."
                : "No awards registered."}
            </p>

          </div>

        ) : (

          distinctions.map((distinction) => (

            <div
              key={distinction.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-4 min-w-0">

                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <FiAward size={23} />
                  </div>

                  <div className="min-w-0">

                    <div className="text-sm font-medium text-blue-700 mb-1">
                      {distinction.year}
                    </div>

                    <h3 className="font-bold text-gray-800 text-lg break-words">
                      {distinction.title}
                    </h3>

                    {distinction.description && (
                      <p className="text-sm text-gray-600 mt-2 whitespace-pre-line break-words">
                        {distinction.description}
                      </p>
                    )}

                  </div>

                </div>

                <div className="flex gap-2 shrink-0">

                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(distinction)
                    }
                    title={
                      language.toLowerCase() === "fr"
                        ? "Modifier"
                        : "Edit"
                    }
                    className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-100 transition"
                  >
                    <FiEdit2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(distinction.id)
                    }
                    title={
                      language.toLowerCase() === "fr"
                        ? "Supprimer"
                        : "Delete"
                    }
                    className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition"
                  >
                    <FiTrash2 size={16} />
                  </button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}