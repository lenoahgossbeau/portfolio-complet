'use client';

import Modal from "@/components/Modal_structure_Researcher_profile";
import { useState, useEffect } from "react";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/locales/translations";

type ContactData = {
  gmail: string;
  linkedIn: string;
  whatsapp: string;
  x: string;
  github: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  data: ContactData;
  onSave: (data: ContactData) => void;
};

export default function EditContactInfoModal({
  open,
  onClose,
  data,
  onSave,
}: Props) {
  const { language } = useLanguage();

  const [form, setForm] = useState<ContactData>(data);

  const [errors, setErrors] = useState({
    gmail: "",
  });

  // Met à jour le formulaire lorsque les données du profil changent
  useEffect(() => {
    setForm(data);
  }, [data]);

  const validate = () => {
    const newErrors = {
      gmail: "",
    };

    if (!form.gmail.trim()) {
      newErrors.gmail = t("email_required", language);
    }

    setErrors(newErrors);

    return !newErrors.gmail;
  };

  const update = (key: keyof ContactData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "gmail") {
      setErrors((prev) => ({
        ...prev,
        gmail: "",
      }));
    }
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      ...form,
    });

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {t("contact", language)}
        </h3>

        <button
          type="button"
          onClick={handleSave}
          className="text-blue-600 font-medium"
        >
          {t("save", language)}
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <MdEmail size={20} />

            <input
              type="email"
              placeholder={t("email", language)}
              value={form.gmail}
              onChange={(e) => update("gmail", e.target.value)}
              className={`w-full border-b focus:border-blue-600 outline-none ${
                errors.gmail ? "border-red-600" : ""
              }`}
            />
          </div>

          {errors.gmail && (
            <p className="text-red-500 text-sm mt-1 ml-7">
              {errors.gmail}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <FaLinkedin size={20} />

          <input
            type="text"
            placeholder={t("linkedin", language) || "LinkedIn"}
            value={form.linkedIn}
            onChange={(e) => update("linkedIn", e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <FaWhatsapp size={20} />

          <input
            type="text"
            placeholder={t("whatsapp", language) || "WhatsApp"}
            value={form.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <FaXTwitter size={20} />

          <input
            type="text"
            placeholder={t("twitter", language) || "X (Twitter)"}
            value={form.x}
            onChange={(e) => update("x", e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <FaGithub size={20} />

          <input
            type="text"
            placeholder={t("github", language) || "GitHub"}
            value={form.github}
            onChange={(e) => update("github", e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
          />
        </div>
      </div>
    </Modal>
  );
}