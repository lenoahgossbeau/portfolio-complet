<<<<<<< HEAD
import Modal from "@/components/Modal_structure_Researcher_profile";
import { useState } from "react";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export default function EditPersonalInfoModal({ open, onClose, data, onSave }: any) {
  const [form, setForm] = useState(data);


  
  ////////////// Validation state /////////////
  const [errors, setErrors] = useState({
    new_password: "",
    confirm_password: "",
  });




  ///////////// Validation Function /////////////
  const validate = () => {
    const newErrors: any = {};


    if (!form.new_password) {
        newErrors.new_password = "Password is required";
    } else if (form.new_password.length < 8) {
        newErrors.new_password = "Password must be at least 8 characters";
    }

    if (!form.confirm_password) {
        newErrors.confirm_password = "Please confirm your password";
    } else if (form.confirm_password !== form.new_password) {
        newErrors.confirm_password = "Passwords do not match";
    }



    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const update = (key: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));

    // Clear error as user types
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };



  ////////////////////////////////
  ///////////  Save  /////////////
  ////////////////////////////////
  const handleSave = () => {
    if (!validate()) return;

    //onSave({
   // ...form,
    //});



    // TEMP: simulate saving password
    console.log("Password ready to be sent to backend:", form.new_password);

    // Reset form after save
    setForm({
        new_password: "",
        confirm_password: "",
    });

    alert("Password updated successfully");



    onClose();
  };





  return (
    <Modal open={open} onClose={onClose}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Security</h3>
        <button
          onClick={handleSave}
          className="text-blue-600 font-medium"
        >
          Save
        </button>
      </div>


      {/* Inputs */}
      <div className="space-y-4">
        <div>
            <input
            type="password"
            placeholder="New password"
            value={form.new_password}
            onChange={(e) => update("new_password", e.target.value)}
            className={`w-full border-b focus:border-blue-600 outline-none
            ${
              errors.new_password
                ? "border-red-600 outline-none"
                : ""
            }`}
            />

            {errors.new_password && <p className="text-red-500 text-sm">{errors.new_password}</p>}
        </div>


        <div>
            <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirm_password}
            onChange={(e) => update("confirm_password", e.target.value)}
            className={`w-full border-b focus:border-blue-600 outline-none
            ${
              errors.confirm_password
                ? "border-red-600 outline-none"
                : ""
            }`}
            />

            
            {errors.confirm_password && <p className="text-red-500 text-sm">{errors.confirm_password}</p>}
        </div>


      </div>
    </Modal>
  );
}
=======
'use client';
import Modal from "@/components/Modal_structure_Researcher_profile";
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

export default function EditSecurityInfoModal({ 
  open, 
  onClose, 
  onSave,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword
}: any) {
  const { language } = useLanguage();

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{t('security', language)}</h3>
        <button onClick={onSave} className="text-blue-600 font-medium">
          {t('save', language)}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="password"
            placeholder="Mot de passe actuel"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder={t('new_password', language)}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder={t('confirm_password', language)}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
          />
        </div>
      </div>
    </Modal>
  );
}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
