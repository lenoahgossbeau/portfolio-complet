<<<<<<< HEAD
=======
'use client';
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
import Modal from "@/components/Modal_structure_Researcher_profile";
import { useState } from "react";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
<<<<<<< HEAD

export default function EditPersonalInfoModal({ open, onClose, data, onSave }: any) {
  const [form, setForm] = useState(data);


  
  ////////////// Validation state /////////////
  const [errors, setErrors] = useState({
    gmail: "",
  });




  ///////////// Validation Function ///////////
  const validate = () => {
    const newErrors: any = {};

    if (!form.gmail.trim()) newErrors.gmail = "Gmail is required";
    
=======
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

export default function EditContactInfoModal({ open, onClose, data, onSave }: any) {
  const { language } = useLanguage();
  const [form, setForm] = useState(data);
  const [errors, setErrors] = useState({ gmail: "" });

  const validate = () => {
    const newErrors: any = {};
    if (!form.gmail.trim()) newErrors.gmail = t('email_required', language);
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

<<<<<<< HEAD


=======
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
  const update = (key: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

<<<<<<< HEAD


  ////////////////////////////////
  ///////////  Save  /////////////
  ////////////////////////////////
  const handleSave = () => {
    if (!validate()) return;

    onSave({
      ...form,
    });

    onClose();
  };





  return (
    <Modal open={open} onClose={onClose}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Contact</h3>
        <button
          onClick={handleSave}
          className="text-blue-600 font-medium"
        >
          Save
        </button>
      </div>


      {/* Inputs */}


      {/** for when there are no experiences 
            {experience.length === 0 && (
              <p className="text-gray-500 italic mt-25 text-center py-4">
                No experiences added yet
              </p>
            )}*/}


      <div className="space-y-5">
        <div className="flex items-center gap-2">

            <MdEmail size={20}/>
            
            <input
            placeholder="Gmail"
            value={form.gmail}
            onChange={(e) => update("gmail", e.target.value)}
            className={`w-full border-b focus:border-blue-600 outline-none
            ${
              errors.gmail
                ? "border-red-600 outline-none"
                : ""
            }`}
            />

            {errors.gmail && <p className="text-red-500 text-sm">{errors.gmail}</p>}
        </div>


        <div className="flex items-center gap-2">

            <FaLinkedin size={20}/>

            <input
            placeholder="LinkedIn"
            value={form.linkedIn}
            onChange={(e) => update("linkedIn", e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
            />
        </div>



        <div className="flex items-center gap-2">
            
            <FaWhatsapp size={20}/>
            
            <input
            placeholder="Whatsapp"
            value={form.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
            />
        </div>



        <div className="flex items-center gap-2">
            
            <FaXTwitter size={20}/>
            
            <input
            placeholder="X"
            value={form.x}
            onChange={(e) => update("x", e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
            />
        </div>



        <div className="flex items-center gap-2">
            
            <FaGithub size={20}/>

            <input
            placeholder="GitHub"
            value={form.github}
            onChange={(e) => update("github", e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
            />
        </div>


      
      </div>
    </Modal>
  );
}
=======
  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...form });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{t('contact', language)}</h3>
        <button onClick={handleSave} className="text-blue-600 font-medium">
          {t('save', language)}
        </button>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <MdEmail size={20}/>
          <input
            placeholder={t('email', language)}
            value={form.gmail}
            onChange={(e) => update("gmail", e.target.value)}
            className={`w-full border-b focus:border-blue-600 outline-none ${errors.gmail ? "border-red-600" : ""}`}
          />
          {errors.gmail && <p className="text-red-500 text-sm">{errors.gmail}</p>}
        </div>

        <div className="flex items-center gap-2">
          <FaLinkedin size={20}/>
          <input
            placeholder={t('linkedin', language) || "LinkedIn"}
            value={form.linkedIn}
            onChange={(e) => update("linkedIn", e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <FaWhatsapp size={20}/>
          <input
            placeholder={t('whatsapp', language) || "WhatsApp"}
            value={form.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <FaXTwitter size={20}/>
          <input
            placeholder={t('twitter', language) || "X (Twitter)"}
            value={form.x}
            onChange={(e) => update("x", e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <FaGithub size={20}/>
          <input
            placeholder={t('github', language) || "GitHub"}
            value={form.github}
            onChange={(e) => update("github", e.target.value)}
            className="w-full border-b focus:border-blue-600 outline-none"
          />
        </div>
      </div>
    </Modal>
  );
}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
