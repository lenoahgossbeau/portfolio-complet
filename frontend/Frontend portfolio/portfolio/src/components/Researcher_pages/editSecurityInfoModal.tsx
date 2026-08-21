'use client';

import Modal from "@/components/Modal_structure_Researcher_profile";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/locales/translations";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  currentPassword: string;
  setCurrentPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
};

export default function EditSecurityInfoModal({
  open,
  onClose,
  onSave,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
}: Props) {
  const { language } = useLanguage();

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {t("security", language)}
        </h3>

        <button
          type="button"
          onClick={onSave}
          className="text-blue-600 font-medium"
        >
          {t("save", language)}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="password"
            placeholder={
              language === "fr"
                ? "Mot de passe actuel"
                : "Current password"
            }
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
          />
        </div>

        <div>
          <input
            type="password"
            placeholder={t("new_password", language)}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
          />
        </div>

        <div>
          <input
            type="password"
            placeholder={t("confirm_password", language)}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
          />
        </div>
      </div>
    </Modal>
  );
}