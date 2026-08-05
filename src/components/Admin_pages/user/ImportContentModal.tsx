'use client';
import { useState, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/lib/api';
import FilePicker from './FilePicker';

type Props = {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
};

export default function ImportContentModal({ userId, isOpen, onClose, onImportComplete }: Props) {
  const { language } = useLanguage();
  const langKey = language.toLowerCase(); // 👈 TRÈS IMPORTANT

  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [publicationsFile, setPublicationsFile] = useState<File | null>(null);
  const [projectsFile, setProjectsFile] = useState<File | null>(null);
  const [technicalSkillsFile, setTechnicalSkillsFile] = useState<File | null>(null);
  const [softSkillsFile, setSoftSkillsFile] = useState<File | null>(null);
  const [languagesFile, setLanguagesFile] = useState<File | null>(null);
  const [degreesFile, setDegreesFile] = useState<File | null>(null);
  const [experiencesFile, setExperiencesFile] = useState<File | null>(null);

  // =========================
  // Informations personnelles
  // =========================
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');

  const [grade, setGrade] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [diplome, setDiplome] = useState('');

  const [description, setDescription] = useState('');

  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const cvInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const publicationsInputRef = useRef<HTMLInputElement>(null);
  const projectsInputRef = useRef<HTMLInputElement>(null);
  const technicalSkillsInputRef = useRef<HTMLInputElement>(null);
  const softSkillsInputRef = useRef<HTMLInputElement>(null);
  const languagesInputRef = useRef<HTMLInputElement>(null);
  const degreesInputRef = useRef<HTMLInputElement>(null);
  const experiencesInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    const formData = new FormData();

    formData.append('bio', bio);

    // Informations personnelles
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('gender', gender);

    formData.append('grade', grade);
    formData.append('specialite', specialite);
    formData.append('diplome', diplome);

    formData.append('description', description);

    formData.append('email', email);
    formData.append('linkedin', linkedin);
    formData.append('github', github);
    formData.append('twitter', twitter);
    formData.append('whatsapp', whatsapp);

    if (cvFile) formData.append('cv', cvFile);
    if (photoFile) formData.append('photo', photoFile);
    if (publicationsFile) formData.append('publications', publicationsFile);
    if (projectsFile) formData.append('projects', projectsFile);
    if (technicalSkillsFile) formData.append('technical_skills', technicalSkillsFile);
    if (softSkillsFile) formData.append('soft_skills', softSkillsFile);
    if (languagesFile) formData.append('languages', languagesFile);
    if (degreesFile) formData.append('degrees', degreesFile);
    if (experiencesFile) formData.append('experiences', experiencesFile);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/import-content`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        toast.success(t('import_success', langKey));
        onImportComplete();
        onClose();
        setFirstName('');
        setLastName('');
        setGender('');

        setGrade('');
        setSpecialite('');
        setDiplome('');

        setDescription('');

        setEmail('');
        setLinkedin('');
        setGithub('');
        setTwitter('');
        setWhatsapp('');

        setBio('');
        setCvFile(null);
        setPhotoFile(null);
        setPublicationsFile(null);
        setProjectsFile(null);
        setTechnicalSkillsFile(null);
        setSoftSkillsFile(null);
        setLanguagesFile(null);
        setDegreesFile(null);
        setExperiencesFile(null);
      } else {
        const error = await response.json();
        toast.error(error.detail || t('import_error', langKey));
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(t('network_error', langKey));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('import_title', langKey)}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* =========================
              Informations personnelles
          ========================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('first_name', langKey)}
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('last_name', langKey)}
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('gender', langKey)}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">{t('select_option', langKey)}</option>
                <option value="Homme">{t('male', langKey)}</option>
                <option value="Femme">{t('female', langKey)}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('grade', langKey)}
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('specialite', langKey)}
              </label>
              <input
                type="text"
                value={specialite}
                onChange={(e) => setSpecialite(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('diplome', langKey)}
              </label>
              <input
                type="text"
                value={diplome}
                onChange={(e) => setDiplome(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('email', langKey)}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('linkedin', langKey)}
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('github', langKey)}
              </label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('twitter', langKey)}
              </label>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('whatsapp', langKey)}
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('description', langKey)}
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('description_placeholder', langKey)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('bio', langKey)}</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('bio_placeholder', langKey)}
            />
          </div>

          <FilePicker
            label={t('cv', langKey)}
            inputRef={cvInputRef}
            file={cvFile}
            accept=".pdf"
            chooseLabel={t('choose_file', langKey)}
            onChange={setCvFile}
          />

          <FilePicker
            label={t('photo', langKey)}
            inputRef={photoInputRef}
            file={photoFile}
            accept="image/*"
            chooseLabel={t('choose_file', langKey)}
            onChange={setPhotoFile}
          />

          <FilePicker
            label={t('publications', langKey)}
            inputRef={publicationsInputRef}
            file={publicationsFile}
            accept=".json"
            chooseLabel={t('choose_file', langKey)}
            helperText={t('publications_format', langKey)}
            onChange={setPublicationsFile}
          />

          <FilePicker
            label={t('projects', langKey)}
            inputRef={projectsInputRef}
            file={projectsFile}
            accept=".json"
            chooseLabel={t('choose_file', langKey)}
            helperText={t('projects_format', langKey)}
            onChange={setProjectsFile}
          />

          <FilePicker
            label={t('technical_skills', langKey)}
            inputRef={technicalSkillsInputRef}
            file={technicalSkillsFile}
            accept=".json"
            chooseLabel={t('choose_file', langKey)}
            helperText={t('technical_skills_format', langKey)}
            onChange={setTechnicalSkillsFile}
          />

          <FilePicker
            label={t('soft_skills', langKey)}
            inputRef={softSkillsInputRef}
            file={softSkillsFile}
            accept=".json"
            chooseLabel={t('choose_file', langKey)}
            helperText={t('soft_skills_format', langKey)}
            onChange={setSoftSkillsFile}
          />

          <FilePicker
            label={t('languages', langKey)}
            inputRef={languagesInputRef}
            file={languagesFile}
            accept=".json"
            chooseLabel={t('choose_file', langKey)}
            helperText={t('languages_format', langKey)}
            onChange={setLanguagesFile}
          />

          <FilePicker
            label={t('degrees', langKey)}
            inputRef={degreesInputRef}
            file={degreesFile}
            accept=".json"
            chooseLabel={t('choose_file', langKey)}
            helperText={t('degrees_format', langKey)}
            onChange={setDegreesFile}
          />

          <FilePicker
            label={t('experiences', langKey)}
            inputRef={experiencesInputRef}
            file={experiencesFile}
            accept=".json"
            chooseLabel={t('choose_file', langKey)}
            helperText={t('experiences_format', langKey)}
            onChange={setExperiencesFile}
          />

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              {t('cancel', langKey)}
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50">
              {loading ? t('importing', langKey) : t('import', langKey)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}