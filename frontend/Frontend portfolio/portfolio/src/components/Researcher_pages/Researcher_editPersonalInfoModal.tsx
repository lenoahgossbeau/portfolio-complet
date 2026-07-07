<<<<<<< HEAD
import Modal from "@/components/Modal_structure_Researcher_profile";
import { useEffect, useState } from "react";

export default function EditPersonalInfoModal({ open, onClose, data, onSave }: any) {
  
  const [form, setForm] = useState(data);
  
  
  
  ////////////// Validation state /////////////
=======
'use client';
import Modal from "@/components/Modal_structure_Researcher_profile";
import { useEffect, useState } from "react";
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import { API_BASE_URL } from '@/lib/api';
import toast from 'react-hot-toast';

export default function EditPersonalInfoModal({ open, onClose, data, onSave }: any) {
  const { language } = useLanguage();
  const [form, setForm] = useState(data);
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
  const [errors, setErrors] = useState({
    name: "",
    profession: "",
    about: "",
  });
  
<<<<<<< HEAD
  
  ////////////// image /////////////////
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(data.avatar);


///////////////////// reinitialise state
=======
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(data.avatar);
  const [uploading, setUploading] = useState(false);

>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
  useEffect(() => {
    setForm(data);
    setImagePreview(data.avatar);
  }, [data]);
<<<<<<< HEAD
////////////////////


  ///////////// Validation Function ///////////
  const validate = () => {
    const newErrors: any = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.profession.trim()) newErrors.profession = "Profession is required";
    if (!form.about.trim()) newErrors.about = "About section is required";
=======

  const validate = () => {
    const newErrors: any = {};

    if (!form.name.trim()) newErrors.name = t('name_required', language);
    if (!form.profession.trim()) newErrors.profession = t('profession_required', language);
    if (!form.about.trim()) newErrors.about = t('about_required', language);
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

  ///////////////////// image change handler ////////////
=======
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

<<<<<<< HEAD
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };


  const handleSave = () => {
    if (!validate()) return;

    onSave({
      ...form,
      avatar: imagePreview, // backend will replace this later
    });

    onClose();
  };


  return (
    <Modal open={open} onClose={onClose}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Personal info</h3>
        <button
          onClick={handleSave}
          className="text-blue-600 font-medium"
        >
          Save
        </button>
      </div>


      {/* Image Upload */}
      <div className="flex justify-center mb-6">
        <label className="cursor-pointer">
          <img
            src={imagePreview || "/favicon.ico"} ///////////////////////// default image is the favicon for now //////////////////////
            className="w-48 h-48 rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>


      {/* Avatar 
      <div className="flex justify-center mb-6">
        <img
          src={form.avatar}
          className="w-28 h-28 rounded-full object-cover"
        />
      </div>*/}


      {/* Inputs */}
      <div className="space-y-4">
        <div>
            <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={`w-full border-b focus:border-blue-600 outline-none
            ${
              errors.name
                ? "border-red-600 outline-none"
                : ""
            }`}
            />

            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>


        <div>
            <input
            placeholder="Profession"
            value={form.profession}
            onChange={(e) => update("profession", e.target.value)}
            className={`w-full border-b focus:border-blue-600 outline-none
            ${
              errors.profession
                ? "border-red-600 outline-none"
                : ""
            }`}
            />
            
            {errors.profession && <p className="text-red-500 text-sm">{errors.profession}</p>}
        </div>


        <div>
            <textarea
            placeholder="About you"
            value={form.about}
            onChange={(e) => update("about", e.target.value)}
            className={`w-full border rounded-lg p-2 resize-none focus:border-blue-600 outline-none
            ${
              errors.about
                ? "border-red-600 outline-none"
                : ""
            }`}

            rows={4}
            />

            {errors.about && <p className="text-red-500 text-sm">{errors.about}</p>}
=======
    // Vérifier que c'est une image
    if (!file.type.startsWith('image/')) {
      toast.error('Seuls les fichiers image sont acceptés');
      return;
    }

    // Vérifier la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 2MB');
      return;
    }

    setImageFile(file);
    // Créer un nouvel URL pour l'aperçu
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Vous devez être connecté');
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/profiles/upload-photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok && data.success) {
        return data.photo_url;
      } else {
        toast.error(data.detail || 'Erreur lors du téléchargement de la photo');
        return null;
      }
    } catch (error) {
      toast.error('Erreur réseau');
      return null;
    }
  };

  const handleSave = async () => {
    if (!validate()) return;

    setUploading(true);
    let avatarUrl = form.avatar;

    // Si une nouvelle image a été sélectionnée, l'uploader
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) {
        avatarUrl = uploadedUrl;
        // Mettre à jour l'aperçu avec l'URL finale
        setImagePreview(uploadedUrl);
      } else {
        setUploading(false);
        return;
      }
    }

    // Sauvegarder le profil avec la nouvelle URL de l'avatar
    const updatedProfile = { ...form, avatar: avatarUrl };
    await onSave(updatedProfile);
    onClose();
    setUploading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{t('personal_info', language)}</h3>
        <button 
          onClick={handleSave} 
          disabled={uploading}
          className={`text-blue-600 font-medium ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? 'Upload...' : t('save', language)}
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <label className="cursor-pointer">
          <img 
            key={imagePreview || "default"}
            src={imagePreview || "/favicon.ico"} 
            className="w-48 h-48 rounded-full object-cover border-2 border-gray-200" 
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
          <p className="text-center text-xs text-gray-500 mt-1">
            {language === 'fr' ? 'Cliquez pour changer la photo' : 'Click to change photo'}
          </p>
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <input
            placeholder={t('name', language)}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={`w-full border-b focus:border-blue-600 outline-none ${errors.name ? "border-red-600" : ""}`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <input
            placeholder={t('profession', language)}
            value={form.profession}
            onChange={(e) => update("profession", e.target.value)}
            className={`w-full border-b focus:border-blue-600 outline-none ${errors.profession ? "border-red-600" : ""}`}
          />
          {errors.profession && <p className="text-red-500 text-sm">{errors.profession}</p>}
        </div>

        <div>
          <textarea
            placeholder={t('about_you', language)}
            value={form.about}
            onChange={(e) => update("about", e.target.value)}
            className={`w-full border rounded-lg p-2 resize-none focus:border-blue-600 outline-none ${errors.about ? "border-red-600" : ""}`}
            rows={4}
          />
          {errors.about && <p className="text-red-500 text-sm">{errors.about}</p>}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
        </div>
      </div>
    </Modal>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
