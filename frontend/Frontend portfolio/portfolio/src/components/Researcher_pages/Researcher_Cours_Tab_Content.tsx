'use client';

import React, { useEffect, useState } from "react";
import {
  FiBookOpen,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import { API_BASE_URL, getProfile } from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/locales/translations";

type Cours = {
  id: number;
  profile_id: number;
  title: string;
  description?: string | null;
  curricula?: string | null;
};

type Props = {
  researcherId?: number;
};

export default function Researcher_Cours_Tab_Content({
  researcherId,
}: Props) {
  const { language } = useLanguage();
  const langKey = language.toLowerCase();

  const [courses, setCourses] = useState<Cours[]>([]);
  const [profileId, setProfileId] = useState<number | null>(
    researcherId ?? null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    curricula: "",
  });

  const [titleError, setTitleError] = useState("");

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
  // CHARGER LES COURS
  // ============================================================

  const fetchCourses = async (currentProfileId?: number | null) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setCourses([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cours/`, {
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

      const researcherCourses = Array.isArray(data)
        ? data.filter(
            (course: Cours) =>
              !profileToUse || course.profile_id === profileToUse
          )
        : [];

      setCourses(researcherCourses);
    } catch (error) {
      console.error("Erreur chargement cours :", error);
      setCourses([]);
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
      await fetchCourses(currentProfileId);
    };

    init();
  }, [researcherId]);

  // ============================================================
  // MODIFIER UN CHAMP
  // ============================================================

  const updateField = (
    field: "title" | "description" | "curricula",
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (field === "title") {
      setTitleError("");
    }
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validate = () => {
    if (!form.title.trim()) {
      setTitleError(t("title_required", langKey));
      return false;
    }

    setTitleError("");
    return true;
  };

  // ============================================================
  // RÉINITIALISER
  // ============================================================

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      curricula: "",
    });

    setTitleError("");
    setEditingId(null);
  };

  // ============================================================
  // CRÉER
  // ============================================================

  const handleCreate = async () => {
    if (!validate()) return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert(t("please_login_again", langKey));
      return;
    }

    if (!profileId) {
      alert(t("no_profile_found", langKey));
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/cours/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profile_id: profileId,
          title: form.title.trim(),
          description: form.description.trim() || null,
          curricula: form.curricula.trim() || null,
        }),
      });

      if (!response.ok) {
        let message = t("course_create_error", langKey);

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
      await fetchCourses(profileId);

      alert(t("course_created_success", langKey));
    } catch (error) {
      console.error("Erreur création cours :", error);

      alert(
        error instanceof Error
          ? error.message
          : t("course_create_error", langKey)
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // PRÉPARER LA MODIFICATION
  // ============================================================

  const handleEdit = (course: Cours) => {
    setEditingId(course.id);

    setForm({
      title: course.title || "",
      description: course.description || "",
      curricula: course.curricula || "",
    });

    setTitleError("");

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
      alert(t("please_login_again", langKey));
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/cours/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            profile_id: profileId,
            title: form.title.trim(),
            description: form.description.trim() || null,
            curricula: form.curricula.trim() || null,
          }),
        }
      );

      if (!response.ok) {
        let message = t("course_update_error", langKey);

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
      await fetchCourses(profileId);

      alert(t("course_updated_success", langKey));
    } catch (error) {
      console.error("Erreur modification cours :", error);

      alert(
        error instanceof Error
          ? error.message
          : t("course_update_error", langKey)
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // SUPPRIMER
  // ============================================================

  const handleDelete = async (id: number) => {
    if (!confirm(t("course_delete_confirm", langKey))) {
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert(t("please_login_again", langKey));
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/cours/${id}`,
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

      await fetchCourses(profileId);

      alert(t("course_deleted_success", langKey));
    } catch (error) {
      console.error("Erreur suppression cours :", error);

      alert(t("course_delete_error", langKey));
    }
  };

  // ============================================================
  // CHARGEMENT
  // ============================================================

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        {t("loading_courses", langKey)}
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
            <FiBookOpen size={28} />

            <div>
              <h2 className="text-xl font-bold">
                {t("courses", langKey)}
              </h2>

              <p className="text-blue-100 text-sm mt-1">
                {editingId !== null
                  ? t("edit", langKey)
                  : t("add", langKey)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">

          {/* TITRE */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("title", langKey)} *
            </label>

            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                updateField("title", e.target.value)
              }
              placeholder={t("title", langKey)}
              className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
                titleError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-600"
              }`}
            />

            {titleError && (
              <p className="text-red-500 text-xs mt-1">
                {titleError}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("description", langKey)}
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                updateField("description", e.target.value)
              }
              placeholder={t("description", langKey)}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:border-blue-600"
            />
          </div>

          {/* PROGRAMME */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("curricula", langKey)}
            </label>

            <textarea
              value={form.curricula}
              onChange={(e) =>
                updateField("curricula", e.target.value)
              }
              placeholder={t("curricula", langKey)}
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:border-blue-600"
            />

            <p className="text-xs text-gray-400 mt-1">
              {t("curricula_help", langKey)}
            </p>
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

                {t("cancel", langKey)}
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
                ? t("saving", langKey)
                : editingId !== null
                ? t("save", langKey)
                : t("create", langKey)}
            </button>
          </div>
        </div>
      </div>

      {/* LISTE */}

      <div className="space-y-5">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {t("courses", langKey)}
            </h2>

            <p className="text-sm text-gray-500">
              {courses.length} {t("courses", langKey).toLowerCase()}
            </p>
          </div>

          <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center">
            <FiBookOpen />
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">

            <FiBookOpen
              size={45}
              className="mx-auto text-gray-300 mb-4"
            />

            <p className="text-gray-500">
              {t("no_courses", langKey)}
            </p>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-4 min-w-0">

                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <FiBookOpen size={23} />
                  </div>

                  <div className="min-w-0">

                    <h3 className="font-bold text-gray-800 text-lg break-words">
                      {course.title}
                    </h3>

                    {course.description && (
                      <p className="text-sm text-gray-600 mt-2 whitespace-pre-line break-words">
                        {course.description}
                      </p>
                    )}

                  </div>
                </div>

                <div className="flex gap-2 shrink-0">

                  <button
                    type="button"
                    onClick={() => handleEdit(course)}
                    title={t("edit", langKey)}
                    className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-100 transition"
                  >
                    <FiEdit2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(course.id)}
                    title={t("delete", langKey)}
                    className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition"
                  >
                    <FiTrash2 size={16} />
                  </button>

                </div>
              </div>

              {course.curricula && (
                <div className="mt-5 pt-5 border-t border-gray-100">

                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    {t("curricula", langKey)}
                  </h4>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 whitespace-pre-line break-words">
                      {course.curricula}
                    </p>
                  </div>

                </div>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
}