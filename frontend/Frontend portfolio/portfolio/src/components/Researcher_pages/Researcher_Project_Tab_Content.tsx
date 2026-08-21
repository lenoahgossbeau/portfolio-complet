'use client';

import React, {
  useState,
  useRef,
  ChangeEvent,
  useEffect,
} from "react";

import Re_ProjectSlider from "@/components/Researcher_pages/Researcher_Project_Preview";
import { IoCameraOutline } from "react-icons/io5";
import {
  API_ENDPOINTS,
  API_BASE_URL,
  fetchWithAuth,
  getProfile,
} from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/locales/translations";

export default function Researcher_Project_Tab_Content() {
  const { language } = useLanguage();
  const langKey = language.toLowerCase();

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<number | null>(null);

  const [form, setForm] = useState({
    id: null as number | null,
    image: "",
    title: "",
    date: "",
    description: "",
    link: "",
  });

  const isEditing = form.id !== null;

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [errors, setErrors] = useState({
    title: "",
    date: "",
    description: "",
    link: "",
  });

  // Charger les projets au démarrage
  useEffect(() => {
    const init = async () => {
      await loadProfile();
      await fetchProjects();
    };

    init();
  }, []);

  const loadProfile = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    try {
      const profile = await getProfile(token);
      console.log("Profil connecté :", profile);
      setProfileId(profile.id);
    } catch (error) {
      console.error("Erreur chargement profil :", error);
    }
  };

  const formatProjects = (data: any[]) => {
    return data.map((project: any) => ({
      id: project.id,
      image: project.image || "",
      title: project.title || "",
      date: project.year?.toString() || "",
      description: project.description || "",
      link: project.link || "",
    }));
  };

  const fetchProjects = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetchWithAuth(
        API_ENDPOINTS.projects
      );

      if (!response.ok) {
        console.error(
          "Erreur chargement projets :",
          response.status
        );
        return;
      }

      const data = await response.json();

      console.log("Projects API:", data);

      const formattedProjects = formatProjects(data);

      setProjects(formattedProjects);
    } catch (error) {
      console.error(
        "Erreur chargement projets :",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // Rafraîchir la liste des projets
  const refreshProjects = async () => {
    try {
      const response = await fetchWithAuth(
        API_ENDPOINTS.projects
      );

      if (!response.ok) {
        console.error(
          "Erreur rafraîchissement projets :",
          response.status
        );
        return;
      }

      const data = await response.json();

      console.log("Projects API (refresh):", data);

      setProjects(formatProjects(data));
    } catch (error) {
      console.error(
        "Erreur rafraîchissement projets :",
        error
      );
    }
  };

  // Cliquer sur la zone image
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Sélection d'une image
  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    if (!file.type.startsWith("image/")) {
      alert(t("image_file_required", langKey));
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = reader.result as string;

      setImagePreview(imageData);

      setForm((prev) => ({
        ...prev,
        image: imageData,
      }));
    };

    reader.readAsDataURL(file);
  };

  // Mise à jour d'un champ
  const updateField = (
    key: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  // Validation
  const validate = () => {
    const newErrors: {
      title?: string;
      date?: string;
      description?: string;
      link?: string;
    } = {};

    if (!form.title.trim()) {
      newErrors.title = t("title_required", langKey);
    }

    if (!form.date.trim()) {
      newErrors.date = t("date_required", langKey);
    }

    if (!form.description.trim()) {
      newErrors.description = t("description_required", langKey);
    }

    if (!form.link.trim()) {
      newErrors.link = t("link_required", langKey);
    }

    setErrors({
      title: newErrors.title || "",
      date: newErrors.date || "",
      description: newErrors.description || "",
      link: newErrors.link || "",
    });

    return Object.keys(newErrors).length === 0;
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setForm({
      id: null,
      image: "",
      title: "",
      date: "",
      description: "",
      link: "",
    });

    setImagePreview(null);
    setSelectedFile(null);

    setErrors({
      title: "",
      date: "",
      description: "",
      link: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Créer un projet
  const handleCreate = async () => {
    if (!validate()) return;

    const token =
      localStorage.getItem("access_token");

    if (!token) {
      alert(t("please_login_again", langKey));
      return;
    }

    const year = parseInt(
      form.date.split("-")[0],
      10
    );

    let imageUrl = form.image;

    if (selectedFile) {
      const uploadData = new FormData();
      uploadData.append("file", selectedFile);

      const uploadResponse = await fetchWithAuth(
        `${API_ENDPOINTS.projects}upload-image`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      if (!uploadResponse.ok) {
        alert(t("image_upload_error", langKey));
        return;
      }

      const uploadResult = await uploadResponse.json();
      imageUrl = uploadResult.image_url;
    }

    const body = {
      year,
      title: form.title,
      coauthor: [],
      description: form.description,
      image: imageUrl,
      link: form.link,
    };

    try {
      const response = await fetch(
        API_ENDPOINTS.projects,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        await refreshProjects();
        resetForm();

        alert(t("project_created_success", langKey));
      } else {
        const error = await response.json();

        alert(
          `Erreur: ${
            error.detail || t("project_create_error", langKey)
          }`
        );
      }
    } catch (error) {
      console.error(
        "Erreur création projet :",
        error
      );

      alert(t("project_create_error", langKey));
    }
  };

  // Modifier un projet
  const handleSave = async () => {
    if (!validate()) return;

    if (form.id === null) return;

    const token =
      localStorage.getItem("access_token");

    if (!token) {
      alert(t("please_login_again", langKey));
      return;
    }

    const year = parseInt(
      form.date.split("-")[0],
      10
    );

    let imageUrl = form.image;

    if (selectedFile) {
      const uploadData = new FormData();
      uploadData.append("file", selectedFile);

      const uploadResponse = await fetchWithAuth(
        `${API_ENDPOINTS.projects}upload-image`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      if (!uploadResponse.ok) {
        alert(t("image_upload_error", langKey));
        return;
      }

      const uploadResult = await uploadResponse.json();
      imageUrl = uploadResult.image_url;
    }

    const body = {
      year,
      title: form.title,
      coauthor: [],
      description: form.description,
      image: imageUrl,
      link: form.link,
    };

    try {
      const response = await fetch(
        `${API_ENDPOINTS.projects}${form.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        await refreshProjects();
        resetForm();

        alert(t("project_updated_success", langKey));
      } else {
        const error = await response.json();

        alert(
          `Erreur: ${
            error.detail || t("project_update_error", langKey)
          }`
        );
      }
    } catch (error) {
      console.error(
        "Erreur modification projet :",
        error
      );

      alert(t("project_update_error", langKey));
    }
  };

  // Charger un projet dans le formulaire
  const handleEditFromCard = (
    project: any
  ) => {
    console.log("Projet reçu :", project);

    setForm({
      id: project.id,
      image: project.image || "",
      title: project.title || "",
      date: project.date || "",
      description: project.description || "",
      link: project.link || "",
    });

    setImagePreview(
      project.image ? `${API_BASE_URL}${project.image}` : null
    );
    setSelectedFile(null);
  };

  // Supprimer un projet
  const handleDeleteFromCard = async (
    id: number
  ) => {
    if (!confirm(t("project_delete_confirm", langKey))) {
      return;
    }

    const token =
      localStorage.getItem("access_token");

    if (!token) {
      alert(t("please_login_again", langKey));
      return;
    }

    try {
      const response = await fetch(
        `${API_ENDPOINTS.projects}${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        await refreshProjects();

        if (form.id === id) {
          resetForm();
        }

        alert(t("project_deleted_success", langKey));
      } else {
        alert(t("project_delete_error", langKey));
      }
    } catch (error) {
      console.error(
        "Erreur suppression projet :",
        error
      );

      alert(t("project_delete_error", langKey));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        {t("loading_projects", langKey)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
      {/* LEFT FORM CARD */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* IMAGE UPLOAD AREA */}
        <div
          onClick={handleImageClick}
          className="relative w-full h-60 bg-gray-300 flex items-center justify-center cursor-pointer"
        >
          {(imagePreview || form.image) ? (
            <img
              src={imagePreview || (form.image.startsWith("http")
                ? form.image
                : `${API_BASE_URL}${form.image}`)}
              alt="Project preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <IoCameraOutline
                size={45}
                className="text-gray-500"
              />
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {/* FORM SECTION */}
        <div className="p-6 space-y-5">
          <div className="flex gap-6">
            <div className="w-1/2">
              <input
                type="text"
                placeholder={t("title", langKey)}
                value={form.title}
                onChange={(e) =>
                  updateField(
                    "title",
                    e.target.value
                  )
                }
                className="w-full pl-2 border-b border-gray-300 focus:border-blue-600 outline-none py-1"
              />

              {errors.title && (
                <p className="text-red-500 text-sm">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="w-1/2">
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  updateField(
                    "date",
                    e.target.value
                  )
                }
                className="w-full pl-2 border-b border-gray-300 focus:border-blue-600 outline-none py-1"
              />

              {errors.date && (
                <p className="text-red-500 text-sm">
                  {errors.date}
                </p>
              )}
            </div>
          </div>

          <div>
            <textarea
              placeholder={t("description", langKey)}
              value={form.description}
              onChange={(e) =>
                updateField(
                  "description",
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-600 outline-none resize-none scrollbar-hide"
              rows={4}
            />

            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <input
              type="url"
              placeholder={t("link", langKey)}
              value={form.link}
              onChange={(e) =>
                updateField(
                  "link",
                  e.target.value
                )
              }
              className="w-full pl-2 border-b border-gray-300 focus:border-blue-600 outline-none py-1"
            />

            {errors.link && (
              <p className="text-red-500 text-sm">
                {errors.link}
              </p>
            )}
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="cursor-pointer px-4 py-2 border border-gray-400 rounded-full text-gray-600 hover:bg-gray-100"
            >
              {t("cancel", langKey)}
            </button>

            {!isEditing ? (
              <button
                type="button"
                onClick={handleCreate}
                className="cursor-pointer px-4 py-2 bg-[#003F7F] text-white rounded-full hover:bg-[#004F9F]"
              >
                {t("create", langKey)}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="cursor-pointer px-4 py-2 bg-[#003F7F] text-white rounded-full hover:bg-[#004F9F]"
              >
                {t("save", langKey)}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PREVIEW CARD */}
      <div className="bg-[#f5f6f8] max-h-screen rounded-2xl p-6 flex items-center justify-center h-[600px]">
        <Re_ProjectSlider
          editable={true}
          projects={projects}
          onEdit={handleEditFromCard}
          onDelete={handleDeleteFromCard}
        />
      </div>
    </div>
  );
}