'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import EditPersonalInfoModal from "./Researcher_editPersonalInfoModal";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/locales/translations";
import { fetchWithAuth, API_BASE_URL } from "@/lib/api";
import ContactCard from "./ContactCard";
import SecurityCard from "./SecurityCard";
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
  researcherId?: number;
  mode?: "create" | "edit";
};

export default function PersonalInfoCard({
  researcherId,
  mode = "create",
}: Props) {
  const { language } = useLanguage();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const getProfileEndpoint = () => {
    if (mode === "edit" && researcherId) {
      return `${API_BASE_URL}/profiles/user/${researcherId}`;
    }

    return `${API_BASE_URL}/profiles/me`;
  };

  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await fetchWithAuth(getProfileEndpoint());

      if (!response.ok) {
        throw new Error("Impossible de charger le profil");
      }

      const data = await response.json();

      setProfile({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        gender: data.gender || "",
        grade: data.grade || "",
        specialite: data.specialite || "",
        diplome: data.diplome || "",
        description: data.description || "",
        bio: data.bio || "",
        avatar: data.avatar || "",
        email: data.email || "",
        linkedin: data.linkedin || "",
        whatsapp: data.whatsapp || "",
        twitter: data.twitter || "",
        github: data.github || "",
      });
    } catch (error) {
      console.error("Erreur chargement profil :", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [researcherId, mode]);

  const refreshProfile = async () => {
    try {
      const response = await fetchWithAuth(getProfileEndpoint());

      if (!response.ok) {
        throw new Error("Impossible de rafraîchir le profil");
      }

      const data = await response.json();

      setProfile({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        gender: data.gender || "",
        grade: data.grade || "",
        specialite: data.specialite || "",
        diplome: data.diplome || "",
        description: data.description || "",
        bio: data.bio || "",
        avatar: data.avatar || "",
        email: data.email || "",
        linkedin: data.linkedin || "",
        whatsapp: data.whatsapp || "",
        twitter: data.twitter || "",
        github: data.github || "",
      });
    } catch (error) {
      console.error("Erreur rafraîchissement profil :", error);
    }
  };

  const handleSave = async (updatedProfile: Profile) => {
    try {
      const response = await fetchWithAuth(getProfileEndpoint(), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: updatedProfile.first_name,
          last_name: updatedProfile.last_name,
          gender: updatedProfile.gender,
          grade: updatedProfile.grade,
          specialite: updatedProfile.specialite,
          diplome: updatedProfile.diplome,
          description: updatedProfile.description,
          bio: updatedProfile.bio,
          avatar: updatedProfile.avatar,
          email: updatedProfile.email,
          linkedin: updatedProfile.linkedin,
          whatsapp: updatedProfile.whatsapp,
          twitter: updatedProfile.twitter,
          github: updatedProfile.github,
        }),
      });

      if (response.ok) {
        setProfile(updatedProfile);
        await refreshProfile();
        toast.success(t("profile_updated_success", language));
      } else {
        toast.error(t("profile_update_error", language));
      }
    } catch (error) {
      console.error("Erreur sauvegarde profil :", error);
      toast.error(t("network_error", language));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        {t("loading", language)}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        {t("no_profile_found", language)}
      </div>
    );
  }

  const fullName = `${profile.first_name} ${profile.last_name}`.trim() || t("no_name", language);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-10 py-6">
      <div className="flex flex-row gap-5 justify-center">
        <div className="col-span-2 bg-white rounded-xl shadow-lg p-5 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-base font-medium text-gray-700">
              {t("personal_info", language)}
            </h2>

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="cursor-pointer text-gray-500 hover:text-gray-700 text-sm"
            >
              ✏️
            </button>
          </div>

          <EditPersonalInfoModal
            open={isEditing}
            onClose={() => setIsEditing(false)}
            data={profile}
            onSave={handleSave}
          />

          <div className="flex flex-col items-center w-86 mt-6 overflow-y-auto scrollbar-hide">
            <div className="w-42 h-42 rounded-full overflow-hidden mb-4">
              {profile.avatar ? (
                <img
                  src={
                    profile.avatar.startsWith("http")
                      ? profile.avatar
                      : `${API_BASE_URL}${profile.avatar}`
                  }
                  alt="profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/favicon.ico";
                  }}
                />
              ) : (
                <Image
                  src="/favicon.ico"
                  alt="profile"
                  width={170}
                  height={170}
                  className="object-cover"
                />
              )}
            </div>

            <div className="text-left w-full max-w-sm">

              <p className="font-medium mb-1">
                {t("name", language)}:{" "}
                <span className="font-normal">
                  {fullName}
                </span>
              </p>

              <p className="font-medium mb-1">
                {t("gender", language)}:{" "}
                <span className="font-normal">
                  {profile.gender === "Female"
                    ? t("gender_female", language)
                    : profile.gender === "Male"
                      ? t("gender_male", language)
                      : t("not_specified", language)}
                </span>
              </p>

              <p className="font-medium mb-1">
                {t("profession", language)}:{" "}
                <span className="font-normal">
                  {profile.grade || t("no_profession", language)}
                </span>
              </p>

              <p className="font-medium mb-1">
                {t("specialite", language)}:{" "}
                <span className="font-normal">
                  {profile.specialite || t("not_specified_feminine", language)}
                </span>
              </p>

              <p className="font-medium mb-1">
                {t("diplome", language)}:{" "}
                <span className="font-normal">
                  {profile.diplome || "Non spécifié"}
                </span>
              </p>

              <p className="font-medium mt-3">
                {t("description", language)}:
              </p>

              <p className="text-sm text-gray-600 mb-3">
                {profile.description || t("no_description", language)}
              </p>

              <p className="font-medium">
                {t("bio", language)}:
              </p>

              <p className="text-sm text-gray-600 leading-relaxed max-h-28 overflow-y-auto scrollbar-hide">
                {profile.bio || t("no_about", language)}
              </p>

            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <ContactCard
            profile={profile}
            onSave={handleSave}
          />

          <SecurityCard />
        </div>
      </div>
    </div>
  );
}