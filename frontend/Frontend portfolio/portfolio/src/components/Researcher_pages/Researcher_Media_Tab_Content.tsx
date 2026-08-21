'use client';

import React, { useEffect, useState } from "react";
import {
  FiImage,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiX,
  FiExternalLink,
} from "react-icons/fi";

import { API_BASE_URL, getProfile } from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";

type MediaArtefact = {
  id: number;
  profile_id: number;
  name: string;
  url: string;
  description?: string | null;
};

type Props = {
  researcherId?: number;
};

export default function Researcher_Media_Tab_Content({
  researcherId,
}: Props) {
  const { language } = useLanguage();
  const langKey = language.toLowerCase();

  const isFrench = langKey === "fr";

  const [media, setMedia] = useState<MediaArtefact[]>([]);
  const [profileId, setProfileId] = useState<number | null>(
    researcherId ?? null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    url: "",
    description: "",
  });

  const [nameError, setNameError] = useState("");
  const [urlError, setUrlError] = useState("");

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
  // CHARGER LES MÉDIAS
  // ============================================================

  const fetchMedia = async (currentProfileId?: number | null) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setMedia([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/media/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      const profileToUse = currentProfileId ?? profileId;

      const researcherMedia = Array.isArray(data)
        ? data.filter(
            (item: MediaArtefact) =>
              !profileToUse || item.profile_id === profileToUse
          )
        : [];

      setMedia(researcherMedia);
    } catch (error) {
      console.error("Erreur chargement médias :", error);
      setMedia([]);
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
      await fetchMedia(currentProfileId);
    };

    init();
  }, [researcherId]);

  // ============================================================
  // MODIFIER UN CHAMP
  // ============================================================

  const updateField = (
    field: "name" | "url" | "description",
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (field === "name") {
      setNameError("");
    }

    if (field === "url") {
      setUrlError("");
    }
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validate = () => {
    let valid = true;

    if (!form.name.trim()) {
      setNameError(
        isFrench
          ? "Le nom du média est obligatoire."
          : "Media name is required."
      );
      valid = false;
    }

    if (!form.url.trim()) {
      setUrlError(
        isFrench
          ? "L'URL du média est obligatoire."
          : "Media URL is required."
      );
      valid = false;
    } else {
      try {
        new URL(form.url.trim());
      } catch {
        setUrlError(
          isFrench
            ? "Veuillez saisir une URL valide."
            : "Please enter a valid URL."
        );
        valid = false;
      }
    }

    return valid;
  };

  // ============================================================
  // RÉINITIALISER
  // ============================================================

  const resetForm = () => {
    setForm({
      name: "",
      url: "",
      description: "",
    });

    setNameError("");
    setUrlError("");
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
        isFrench
          ? "Veuillez vous reconnecter."
          : "Please log in again."
      );
      return;
    }

    if (!profileId) {
      alert(
        isFrench
          ? "Profil introuvable."
          : "Profile not found."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/media/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profile_id: profileId,
          name: form.name.trim(),
          url: form.url.trim(),
          description: form.description.trim() || null,
        }),
      });

      if (!response.ok) {
        let message = isFrench
          ? "Erreur lors de la création du média."
          : "Error creating media.";

        try {
          const error = await response.json();

          if (error?.detail) {
            message =
              typeof error.detail === "string"
                ? error.detail
                : message;
          }
        } catch {
          // Réponse non JSON
        }

        throw new Error(message);
      }

      resetForm();
      await fetchMedia(profileId);

      alert(
        isFrench
          ? "Média ajouté avec succès."
          : "Media added successfully."
      );
    } catch (error) {
      console.error("Erreur création média :", error);

      alert(
        error instanceof Error
          ? error.message
          : isFrench
          ? "Erreur lors de la création du média."
          : "Error creating media."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // PRÉPARER LA MODIFICATION
  // ============================================================

  const handleEdit = (item: MediaArtefact) => {
    setEditingId(item.id);

    setForm({
      name: item.name || "",
      url: item.url || "",
      description: item.description || "",
    });

    setNameError("");
    setUrlError("");

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
        isFrench
          ? "Veuillez vous reconnecter."
          : "Please log in again."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/media/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            profile_id: profileId,
            name: form.name.trim(),
            url: form.url.trim(),
            description: form.description.trim() || null,
          }),
        }
      );

      if (!response.ok) {
        let message = isFrench
          ? "Erreur lors de la modification du média."
          : "Error updating media.";

        try {
          const error = await response.json();

          if (error?.detail) {
            message =
              typeof error.detail === "string"
                ? error.detail
                : message;
          }
        } catch {
          // Réponse non JSON
        }

        throw new Error(message);
      }

      resetForm();
      await fetchMedia(profileId);

      alert(
        isFrench
          ? "Média modifié avec succès."
          : "Media updated successfully."
      );
    } catch (error) {
      console.error("Erreur modification média :", error);

      alert(
        error instanceof Error
          ? error.message
          : isFrench
          ? "Erreur lors de la modification du média."
          : "Error updating media."
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
      isFrench
        ? "Voulez-vous vraiment supprimer ce média ?"
        : "Do you really want to delete this media?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert(
        isFrench
          ? "Veuillez vous reconnecter."
          : "Please log in again."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/media/${id}`,
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

      await fetchMedia(profileId);

      alert(
        isFrench
          ? "Média supprimé avec succès."
          : "Media deleted successfully."
      );
    } catch (error) {
      console.error("Erreur suppression média :", error);

      alert(
        isFrench
          ? "Erreur lors de la suppression du média."
          : "Error deleting media."
      );
    }
  };

  // ============================================================
  // CHARGEMENT
  // ============================================================

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        {isFrench ? "Chargement des médias..." : "Loading media..."}
      </div>
    );
  }

  // ============================================================
  // INTERFACE
  // ============================================================

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

      {/* ========================================================
          FORMULAIRE
      ======================================================== */}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-white">
          <div className="flex items-center gap-3">
            <FiImage size={28} />

            <div>
              <h2 className="text-xl font-bold">
                {isFrench ? "Médias" : "Media"}
              </h2>

              <p className="text-blue-100 text-sm mt-1">
                {editingId !== null
                  ? isFrench
                    ? "Modifier le média"
                    : "Edit media"
                  : isFrench
                  ? "Ajouter un média"
                  : "Add media"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">

          {/* NOM */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isFrench ? "Nom du média" : "Media name"} *
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                updateField("name", e.target.value)
              }
              placeholder={
                isFrench
                  ? "Ex. Présentation du laboratoire"
                  : "e.g. Laboratory presentation"
              }
              className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
                nameError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-600"
              }`}
            />

            {nameError && (
              <p className="text-red-500 text-xs mt-1">
                {nameError}
              </p>
            )}
          </div>

          {/* URL */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL *
            </label>

            <input
              type="url"
              value={form.url}
              onChange={(e) =>
                updateField("url", e.target.value)
              }
              placeholder="https://example.com/media"
              className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
                urlError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-600"
              }`}
            />

            {urlError && (
              <p className="text-red-500 text-xs mt-1">
                {urlError}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isFrench ? "Description" : "Description"}
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                updateField("description", e.target.value)
              }
              placeholder={
                isFrench
                  ? "Décrivez brièvement ce média..."
                  : "Briefly describe this media..."
              }
              rows={5}
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

                {isFrench ? "Annuler" : "Cancel"}
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
                ? isFrench
                  ? "Enregistrement..."
                  : "Saving..."
                : editingId !== null
                ? isFrench
                  ? "Enregistrer"
                  : "Save"
                : isFrench
                ? "Ajouter"
                : "Add"}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          LISTE
      ======================================================== */}

      <div className="space-y-5">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {isFrench ? "Mes médias" : "My media"}
            </h2>

            <p className="text-sm text-gray-500">
              {media.length}{" "}
              {isFrench
                ? media.length > 1
                  ? "médias"
                  : "média"
                : media.length > 1
                ? "media items"
                : "media item"}
            </p>
          </div>

          <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center">
            <FiImage />
          </div>
        </div>

        {media.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">

            <FiImage
              size={45}
              className="mx-auto text-gray-300 mb-4"
            />

            <p className="text-gray-500">
              {isFrench
                ? "Aucun média enregistré."
                : "No media registered."}
            </p>
          </div>
        ) : (
          media.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-4 min-w-0">

                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <FiImage size={23} />
                  </div>

                  <div className="min-w-0">

                    <h3 className="font-bold text-gray-800 text-lg break-words">
                      {item.name}
                    </h3>

                    {item.description && (
                      <p className="text-sm text-gray-600 mt-2 whitespace-pre-line break-words">
                        {item.description}
                      </p>
                    )}

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline mt-3 break-all"
                    >
                      <FiExternalLink size={15} />
                      {isFrench ? "Voir le média" : "View media"}
                    </a>

                  </div>
                </div>

                <div className="flex gap-2 shrink-0">

                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    title={isFrench ? "Modifier" : "Edit"}
                    className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-100 transition"
                  >
                    <FiEdit2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    title={isFrench ? "Supprimer" : "Delete"}
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