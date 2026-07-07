<<<<<<< HEAD
import { useEffect, useRef, useState } from "react";
import DonutChart from "@/components/Donut_Chat";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";


const hideScrollbar = "scrollbar-hide"; // keep your class

type Skill = { name: string; level: number };
type Language = { name: string; percent: number; label: string };
type Degree = { year: string; title: string; field: string; school: string; id: number };
type Experience = { year: string; title: string; company: string; description: string; id: number };

export default function Resume({ editable = true }: { editable?: boolean } ) {

=======
'use client';
import { useEffect, useRef, useState } from "react";
import DonutChart from "@/components/Donut_Chat";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import { fetchWithAuth } from '@/lib/api';
import { API_BASE_URL } from '@/lib/api';

const hideScrollbar = "scrollbar-hide";

type Skill = { id: number; name: string; level: number };
type Language = { id: number; name: string; percent: number; label: string; level: string };
type Degree = { id: number; year: string; title: string; field: string; school: string; description: string };
type Experience = { id: number; year: string; title: string; company: string; description: string; start_date: string; end_date: string | null };

export default function Resume({ editable = true }: { editable?: boolean }) {
  const { language } = useLanguage();
  
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
  const skillsRef = useRef<HTMLDivElement | null>(null);
  const langRef = useRef<HTMLDivElement | null>(null);
  const degreeRef = useRef<HTMLDivElement | null>(null);
  const expRef = useRef<HTMLDivElement | null>(null);

<<<<<<< HEAD
  // DATA STATE (can be replaced with API data)
  const [technicalSkills, setTechnicalSkills] = useState<Skill[]>([
    { name: "UI Design", level: 90 },
    { name: "C", level: 60 },
    { name: "Python", level: 80 },
    { name: "Java", level: 95 },
  ]);
  const [softSkills, setSoftSkills] = useState<Skill[]>([
    { name: "Communication", level: 85 },
    { name: "Team Work", level: 90 },
    { name: "Problem Solving", level: 80 },
  ]);

  const [languages, setLanguages] = useState<Language[]>([
    { name: "English", percent: 100, label: "Proficient" },
    { name: "French", percent: 50, label: "Fluent" },
    { name: "Spanish", percent: 43, label: "Intermediate" },
    { name: "Italian", percent: 18, label: "Basic" },
  ]);

  // THREE DOT MENU STATE
  const [showMenu, setShowMenu] = useState(false)

  // THREE DOT MENU STATE AND REF
  const [openLangMenu, setOpenLangMenu] = useState<number | null>(null);
  const langMenuRef = useRef<HTMLDivElement | null>(null);


  const [degrees, setDegrees] = useState<Degree[]>([
    { id: 1, year: "2018-2020", title: "Bachelors", field: "Software Engineering", school: "University of Buea" },
    { id: 2, year: "2020", title: "Cloud Computing", field: "Certificate", school: "Udemy" },
  ]);

  const [experience, setExperience] = useState<Experience[]>([
    { id: 1, year: "2018-2025", title: "Sr. UX Designer", company: "Intechs", description: "Maximize your tax returns and minimize common errors with our expert guidance." },
    { id: 2, year: "2018-2025", title: "Sr. UX Designer", company: "Intechs", description: "Maximize your tax returns and minimize common errors with our expert guidance." },
  ]);

  // FORM / MODAL STATE
  const [showForm, setShowForm] = useState(false);
  const [formKind, setFormKind] = useState<"degree" | "experience" | "language" | "skill">("skill");
  const [editingId, setEditingId] = useState<number | null>(null); // id for degree/exp/lang -> use index for skills
  
  // generic form data
  const [form, setForm] = useState<any>({
    // skill fields:
    isTechnical: true,
    name: "",
    level: 50,
    // language fields:
    percent: 50,
    label: "",
    // degree fields:
=======
  // État des données
  const [technicalSkills, setTechnicalSkills] = useState<Skill[]>([]);
  const [softSkills, setSoftSkills] = useState<Skill[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  // Menu state
  const [openLangMenu, setOpenLangMenu] = useState<number | null>(null);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  // FORM MODAL STATE
  const [showForm, setShowForm] = useState(false);
  const [formKind, setFormKind] = useState<"degree" | "experience" | "language" | "skill">("skill");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<any>({
    isTechnical: true,
    name: "",
    level: 50,
    percent: 50,
    label: "",
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
    year: "",
    title: "",
    field: "",
    school: "",
<<<<<<< HEAD
    // experience fields:
    company: "",
    description: "",
  });

  // validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Open add modal
  const openAddForm = (kind: typeof formKind) => {
    setFormKind(kind);
    setEditingId(null);
    // default values
    setForm({
      isTechnical: kind === "skill" ? true : undefined,
=======
    company: "",
    description: "",
    start_date: "",
    end_date: "",
    institution: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Chargement des données
  useEffect(() => {
    loadCV();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setOpenLangMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadCV = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${API_BASE_URL}/cv/me`);
      const data = await response.json();
      
      setTechnicalSkills(data.technical_skills || []);
      setSoftSkills(data.soft_skills || []);
      setLanguages((data.languages || []).map((l: any) => ({ ...l, percent: l.percent || 50, label: l.level })));
      setDegrees((data.degrees || []).map((d: any) => ({ ...d, field: d.description, school: d.institution, year: d.year, description: d.description })));
      setExperience((data.experiences || []).map((e: any) => ({ 
        ...e, 
        year: e.start_date?.split('-')[0] + (e.end_date ? `-${e.end_date.split('-')[0]}` : '-Présent'),
        start_date: e.start_date,
        end_date: e.end_date
      })));
    } catch (error) {
      console.error('Erreur chargement CV:', error);
    } finally {
      setLoading(false);
    }
  };

  // Appels API
  const apiCall = async (method: string, url: string, body?: any) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/cv/${url}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) throw new Error('Erreur API');
    return response.json();
  };

  // SKILLS
  const addSkill = async (isTechnical: boolean, name: string, level: number) => {
    const endpoint = isTechnical ? 'technical-skills' : 'soft-skills';
    await apiCall('POST', endpoint, { name, level: isTechnical ? level : undefined });
    await loadCV();
  };

  const updateSkill = async (isTechnical: boolean, id: number, name: string, level: number) => {
    const endpoint = isTechnical ? `technical-skills/${id}` : `soft-skills/${id}`;
    await apiCall('PUT', endpoint, { name, level: isTechnical ? level : undefined });
    await loadCV();
  };

  const deleteSkill = async (isTechnical: boolean, id: number) => {
    const endpoint = isTechnical ? `technical-skills/${id}` : `soft-skills/${id}`;
    await apiCall('DELETE', endpoint);
    await loadCV();
  };

  // LANGUAGES
  const addLanguage = async (name: string, level: string) => {
    await apiCall('POST', 'languages', { name, level });
    await loadCV();
  };

  const updateLanguage = async (id: number, name: string, level: string) => {
    await apiCall('PUT', `languages/${id}`, { name, level });
    await loadCV();
  };

  const deleteLanguage = async (id: number) => {
    await apiCall('DELETE', `languages/${id}`);
    await loadCV();
  };

  // DEGREES
  const addDegree = async (title: string, institution: string, year: string, description: string) => {
    await apiCall('POST', 'degrees', { title, institution, year, description });
    await loadCV();
  };

  const updateDegree = async (id: number, title: string, institution: string, year: string, description: string) => {
    await apiCall('PUT', `degrees/${id}`, { title, institution, year, description });
    await loadCV();
  };

  const deleteDegree = async (id: number) => {
    await apiCall('DELETE', `degrees/${id}`);
    await loadCV();
  };

  // EXPERIENCES
  const addExperience = async (title: string, company: string, start_date: string, end_date: string | null, description: string) => {
    await apiCall('POST', 'experiences', { title, company, start_date, end_date, description });
    await loadCV();
  };

  const updateExperience = async (id: number, title: string, company: string, start_date: string, end_date: string | null, description: string) => {
    await apiCall('PUT', `experiences/${id}`, { title, company, start_date, end_date, description });
    await loadCV();
  };

  const deleteExperience = async (id: number) => {
    await apiCall('DELETE', `experiences/${id}`);
    await loadCV();
  };

  // FORM HANDLERS
  const openAddForm = (kind: typeof formKind) => {
    setFormKind(kind);
    setEditingId(null);
    
    let defaultForm: any = {
      isTechnical: true,
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
      name: "",
      level: 50,
      percent: 50,
      label: "",
      year: "",
      title: "",
      field: "",
      school: "",
      company: "",
      description: "",
<<<<<<< HEAD
    });
    setErrors({});
    setShowForm(true);
  };

  // Open edit modal with prefill
  const openEditForm = (kind: typeof formKind, idxOrId: number) => {
    setFormKind(kind);
    setEditingId(idxOrId);
    setErrors({});

    if (kind === "skill") {
      // idxOrId is index: first look through both arrays - we encode negative idx for soft skills
      const idx = idxOrId;
      if (idx >= 0) {
        const s = technicalSkills[idx];
        setForm({ isTechnical: true, name: s.name, level: s.level });
      } else {
        const s = softSkills[-idx - 1];
        setForm({ isTechnical: false, name: s.name, level: s.level });
      }
    } else if (kind === "language") {
      const idx = idxOrId;
      const l = languages[idx];
      setForm({ name: l.name, percent: l.percent, label: l.label });
    } else if (kind === "degree") {
      const d = degrees.find((x) => x.id === idxOrId);
      setForm({ year: d?.year ?? "", title: d?.title ?? "", field: d?.field ?? "", school: d?.school ?? "" });
    } else if (kind === "experience") {
      const e = experience.find((x) => x.id === idxOrId);
      setForm({ year: e?.year ?? "", title: e?.title ?? "", company: e?.company ?? "", description: e?.description ?? "" });
    }

    setShowForm(true);
  };

  // Delete handlers
  const deleteSkill = (isTechnical: boolean, idx: number) => {
    if (isTechnical) setTechnicalSkills((s) => s.filter((_, i) => i !== idx));
    else setSoftSkills((s) => s.filter((_, i) => i !== idx));
  };
  const deleteLanguage = (idx: number) => setLanguages((l) => l.filter((_, i) => i !== idx));
  const deleteDegree = (id: number) => setDegrees((d) => d.filter((x) => x.id !== id));
  const deleteExperience = (id: number) => setExperience((e) => e.filter((x) => x.id !== id));

  // Validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (formKind === "skill") {
      if (!form.name || form.name.trim() === "") errs.name = "Name required";
      if (!form.level && form.level !== 0) errs.level = "Level required";
    } else if (formKind === "language") {
      if (!form.name || form.name.trim() === "") errs.name = "Name required";
      if (form.percent === undefined || form.percent === null) errs.percent = "Percent required";
      if (!form.label || form.label.trim() === "") errs.label = "Label required";
    } else if (formKind === "degree") {
      if (!form.title || form.title.trim() === "") errs.title = "Title required";
      if (!form.field || form.field.trim() === "") errs.field = "Field required";
      if (!form.school || form.school.trim() === "") errs.school = "School required";
      if (!form.year || form.year.trim() === "") errs.year = "Year required";
    } else if (formKind === "experience") {
      if (!form.title || form.title.trim() === "") errs.title = "Title required";
      if (!form.company || form.company.trim() === "") errs.company = "Company required";
      if (!form.description || form.description.trim() === "") errs.description = "Description required";
      if (!form.year || form.year.trim() === "") errs.year = "Year required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit (create or save)
  const submitForm = () => {
    if (!validateForm()) return;

    // SKILL
    if (formKind === "skill") {
      if (editingId === null) {
        // add
        const entry = { name: form.name.trim(), level: Number(form.level) || 0 };
        if (form.isTechnical) setTechnicalSkills((s) => [...s, entry]);
        else setSoftSkills((s) => [...s, entry]);
      } else {
        // editing: editingId encoding: >=0 technical index, <0 soft index -> -idx-1
        const idx = editingId;
        if (idx >= 0) {
          setTechnicalSkills((s) => s.map((it, i) => (i === idx ? { ...it, name: form.name, level: Number(form.level) } : it)));
        } else {
          const softIdx = -idx - 1;
          setSoftSkills((s) => s.map((it, i) => (i === softIdx ? { ...it, name: form.name, level: Number(form.level) } : it)));
        }
      }
      setShowForm(false);
      return;
    }

    // LANGUAGE
    if (formKind === "language") {
      if (editingId === null) {
        setLanguages((l) => [...l, { name: form.name.trim(), percent: Number(form.percent) || 0, label: form.label.trim() }]);
      } else {
        const idx = editingId;
        setLanguages((l) => l.map((it, i) => (i === idx ? { ...it, name: form.name, percent: Number(form.percent), label: form.label } : it)));
      }
      setShowForm(false);
      return;
    }

    // DEGREE
    if (formKind === "degree") {
      if (editingId === null) {
        setDegrees((d) => [...d, { id: Date.now(), title: form.title.trim(), field: form.field.trim(), school: form.school.trim(), year: form.year.trim() }]);
      } else {
        setDegrees((d) => d.map((it) => (it.id === editingId ? { ...it, title: form.title, field: form.field, school: form.school, year: form.year } : it)));
      }
      setShowForm(false);
      return;
    }

    // EXPERIENCE
    if (formKind === "experience") {
      if (editingId === null) {
        setExperience((e) => [...e, { id: Date.now(), title: form.title.trim(), company: form.company.trim(), description: form.description.trim(), year: form.year.trim() }]);
      } else {
        setExperience((e) => e.map((it) => (it.id === editingId ? { ...it, title: form.title, company: form.company, description: form.description, year: form.year } : it)));
      }
      setShowForm(false);
      return;
    }
  };

  // helpers: open edit skill with special index encoding
  const onEditSkill = (isTechnical: boolean, idx: number) => {
    const encoded = isTechnical ? idx : -idx - 1;
    openEditForm("skill", encoded);
  };


  // close three dot menu when user clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(e.target as Node)
      ) {
        setOpenLangMenu(null);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
















  return (

    <section 
      id="resume" 
      className={`py-10 relative ${!editable ? "min-h-screen" : "" }`}
    >

      {!editable && (
        <h2 className="text-center text-3xl text-gray-700 tracking-[5px] mb-8">Resume</h2>
      )}
=======
      start_date: "",
      end_date: "",
      institution: "",
    };

    if (kind === "language") {
      defaultForm = {
        name: "",
        level: "",
        percent: 50,
        label: "",
        isTechnical: false,
      };
    } else if (kind === "degree") {
      defaultForm = {
        title: "",
        institution: "",
        year: "",
        description: "",
        name: "",
        level: 50,
        isTechnical: false,
      };
    } else if (kind === "experience") {
      defaultForm = {
        title: "",
        company: "",
        start_date: "",
        end_date: "",
        description: "",
        name: "",
        level: 50,
        isTechnical: false,
      };
    }

    setForm(defaultForm);
    setErrors({});
    setShowForm(true);
  };

  const openEditForm = (kind: typeof formKind, item: any) => {
    setFormKind(kind);
    setEditingId(item.id);
    if (kind === "skill") {
      setForm({ 
        isTechnical: true, 
        name: item.name || "", 
        level: item.level || 50,
        institution: "",
        description: "",
        company: "",
        start_date: "",
        end_date: "",
        year: "",
        title: "",
        field: "",
      });
    } else if (kind === "language") {
      setForm({ 
        name: item.name || "", 
        level: item.level || "", 
        percent: item.percent || 50,
        institution: "",
        description: "",
        company: "",
        start_date: "",
        end_date: "",
        year: "",
        title: "",
        field: "",
        isTechnical: false,
      });
    } else if (kind === "degree") {
      setForm({ 
        title: item.title || "", 
        institution: item.school || "", 
        year: item.year || "", 
        description: item.description || "",
        name: "",
        level: 50,
        company: "",
        start_date: "",
        end_date: "",
        field: "",
        isTechnical: false,
      });
    } else if (kind === "experience") {
      setForm({ 
        title: item.title || "", 
        company: item.company || "", 
        start_date: item.start_date || "", 
        end_date: item.end_date || "", 
        description: item.description || "",
        name: "",
        level: 50,
        institution: "",
        year: "",
        field: "",
        isTechnical: false,
      });
    }
    setErrors({});
    setShowForm(true);
  };

  const submitForm = async () => {
    if (formKind === "skill") {
      if (editingId === null) {
        await addSkill(form.isTechnical, form.name, form.level);
      } else {
        await updateSkill(form.isTechnical, editingId, form.name, form.level);
      }
    } else if (formKind === "language") {
      if (editingId === null) {
        await addLanguage(form.name, form.level);
      } else {
        await updateLanguage(editingId, form.name, form.level);
      }
    } else if (formKind === "degree") {
      if (editingId === null) {
        await addDegree(form.title, form.institution, form.year, form.description);
      } else {
        await updateDegree(editingId, form.title, form.institution, form.year, form.description);
      }
    } else if (formKind === "experience") {
      if (editingId === null) {
        await addExperience(form.title, form.company, form.start_date, form.end_date || null, form.description);
      } else {
        await updateExperience(editingId, form.title, form.company, form.start_date, form.end_date || null, form.description);
      }
    }
    setShowForm(false);
  };

  const getTranslatedLanguage = (langName: string) => {
    const map: Record<string, string> = { 
      'English': t('english', language), 
      'French': t('french', language), 
      'Spanish': t('spanish', language), 
      'Italian': t('italian', language),
      'German': language === 'fr' ? 'Allemand' : 'German',
      'Portuguese': language === 'fr' ? 'Portugais' : 'Portuguese',
      'Dutch': language === 'fr' ? 'Néerlandais' : 'Dutch',
      'Russian': language === 'fr' ? 'Russe' : 'Russian',
      'Chinese': language === 'fr' ? 'Chinois' : 'Chinese',
      'Japanese': language === 'fr' ? 'Japonais' : 'Japanese',
      'Korean': language === 'fr' ? 'Coréen' : 'Korean',
      'Arabic': language === 'fr' ? 'Arabe' : 'Arabic',
      'Hindi': 'Hindi',
      'Turkish': language === 'fr' ? 'Turc' : 'Turkish',
      'Greek': language === 'fr' ? 'Grec' : 'Greek',
      'Latin': 'Latin',
      'Swedish': language === 'fr' ? 'Suédois' : 'Swedish',
      'Norwegian': language === 'fr' ? 'Norvégien' : 'Norwegian',
      'Danish': language === 'fr' ? 'Danois' : 'Danish',
      'Polish': language === 'fr' ? 'Polonais' : 'Polish',
      'Ukrainian': language === 'fr' ? 'Ukrainien' : 'Ukrainian',
      'Vietnamese': language === 'fr' ? 'Vietnamien' : 'Vietnamese',
      'Thai': language === 'fr' ? 'Thaï' : 'Thai',
      'Indonesian': language === 'fr' ? 'Indonésien' : 'Indonesian',
      'Malay': language === 'fr' ? 'Malais' : 'Malay',
      'Persian': language === 'fr' ? 'Perse' : 'Persian',
      'Urdu': 'Ourdou',
      'Bengali': 'Bengali',
      'Punjabi': language === 'fr' ? 'Pendjabi' : 'Punjabi',
      'Swahili': 'Swahili',
      'Zulu': language === 'fr' ? 'Zoulou' : 'Zulu',
      'Afrikaans': 'Afrikaans',
      'Irish': language === 'fr' ? 'Irlandais' : 'Irish',
      'Welsh': language === 'fr' ? 'Gallois' : 'Welsh',
      'Basque': 'Basque',
      'Catalan': 'Catalan',
      'Czech': language === 'fr' ? 'Tchèque' : 'Czech',
      'Slovak': language === 'fr' ? 'Slovaque' : 'Slovak',
      'Hungarian': language === 'fr' ? 'Hongrois' : 'Hungarian',
      'Romanian': language === 'fr' ? 'Roumain' : 'Romanian',
      'Bulgarian': language === 'fr' ? 'Bulgare' : 'Bulgarian',
      'Serbian': language === 'fr' ? 'Serbe' : 'Serbian',
      'Croatian': language === 'fr' ? 'Croate' : 'Croatian',
      'Slovenian': language === 'fr' ? 'Slovène' : 'Slovenian',
      'Estonian': language === 'fr' ? 'Estonien' : 'Estonian',
      'Latvian': language === 'fr' ? 'Letton' : 'Latvian',
      'Lithuanian': language === 'fr' ? 'Lituanien' : 'Lithuanian',
      'Finnish': language === 'fr' ? 'Finnois' : 'Finnish',
      'Icelandic': language === 'fr' ? 'Islandais' : 'Icelandic',
      'Maltese': language === 'fr' ? 'Maltais' : 'Maltese',
      'Albanian': language === 'fr' ? 'Albanais' : 'Albanian',
      'Macedonian': language === 'fr' ? 'Macédonien' : 'Macedonian',
      'Bosnian': language === 'fr' ? 'Bosniaque' : 'Bosnian',
      'Montenegrin': language === 'fr' ? 'Monténégrin' : 'Montenegrin'
    };
    return map[langName] || langName;
  };

  const getTranslatedLevelLabel = (level: string) => {
    const levelLower = level?.toLowerCase() || '';
    
    if (levelLower === 'natif' || levelLower === 'native') {
      return t('level_native', language);
    } else if (levelLower === 'courant' || levelLower === 'fluent' || levelLower === 'avancé' || levelLower === 'advanced') {
      return t('level_fluent', language);
    } else if (levelLower === 'intermédiaire' || levelLower === 'intermediaire' || levelLower === 'intermediate' || levelLower === 'moyen') {
      return t('level_intermediate', language);
    } else if (levelLower === 'débutant' || levelLower === 'debutant' || levelLower === 'beginner' || levelLower === 'basic') {
      return t('level_beginner', language);
    }
    
    return level || 'Non spécifié';
  };

  const getLevelInfo = (level: string) => {
    const levelLower = level?.toLowerCase() || '';
    
    if (levelLower === 'natif' || levelLower === 'native') {
      return { letter: 'N', bgColor: 'bg-emerald-100 text-emerald-700', circleColor: 'bg-emerald-500', label: t('level_native', language) };
    } else if (levelLower === 'courant' || levelLower === 'fluent' || levelLower === 'avancé' || levelLower === 'advanced') {
      return { letter: 'C', bgColor: 'bg-blue-100 text-blue-700', circleColor: 'bg-blue-500', label: t('level_fluent', language) };
    } else if (levelLower === 'intermédiaire' || levelLower === 'intermediaire' || levelLower === 'intermediate' || levelLower === 'moyen') {
      return { letter: 'I', bgColor: 'bg-amber-100 text-amber-700', circleColor: 'bg-amber-500', label: t('level_intermediate', language) };
    } else if (levelLower === 'débutant' || levelLower === 'debutant' || levelLower === 'beginner' || levelLower === 'basic') {
      return { letter: 'D', bgColor: 'bg-gray-100 text-gray-700', circleColor: 'bg-gray-500', label: t('level_beginner', language) };
    }
    
    return { letter: '?', bgColor: 'bg-gray-100 text-gray-700', circleColor: 'bg-gray-400', label: 'Non spécifié' };
  };

  if (loading) return <div className="text-center py-20">{t('loading', language)}</div>;

  return (
    <section id="resume" className="py-10 relative">
      {!editable && <h2 className="text-center text-3xl text-gray-700 tracking-[5px] mb-8">{t('resume_section', language)}</h2>}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT SIDE */}
        <div className="space-y-10">
          {/* Skills */}
          <div>
            <div className="flex items-center justify-between mb-4">
<<<<<<< HEAD
              <h3 className="text-sm tracking-widest text-gray-500">MY SKILLS</h3>
              {editable && (
                <button onClick={() => openAddForm("skill")} className="cursor-pointer rounded-full bg-gray-100 p-2">
                  <FiPlus />
                </button>
              )}
            </div>

            <div ref={skillsRef} className={`bg-white p-6 rounded-xl shadow-md border border-gray-200 max-h-[245px] overflow-y-auto ${hideScrollbar}`}>
              
                  {/** TECHNICAL SKILLS */}
              <h4 className="text-[#33557D] mb-3">Technical Skills</h4>

              {/** for when there are no technical skills */}
              {technicalSkills.length === 0 && (
                <p className="text-gray-500 italic text-center py-4">
                  No skills added yet
                </p>
              )}

              {technicalSkills.map((skill, i) => (
                <div key={i} className="ml-4 mb-4 flex items-center">
                  {editable && (
                    <button onClick={() => deleteSkill(true, i)} className="cursor-pointer mr-3 text-red-400">
                      <FiX />
                    </button>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span className="whitespace-nowrap">{skill.name}</span>

                      <div className="mx-4 w-full h-1 bg-gray-200 rounded">
                        <div className="h-1 bg-blue-900 rounded" style={{ width: `${skill.level}%` }} />
                      </div>

                      <span>{skill.level}%</span>
                    </div>
                  </div>

                  {editable && (
                    <div className="ml-3 flex gap-2">
                      <button onClick={() => onEditSkill(true, i)} className="cursor-pointer text-[#33557D] p-1 rounded-full bg-white shadow-sm"><FiEdit2 /></button>
                    </div>
                  )}
                </div>
              ))}

                    {/** SOFT SKILLS */}
              <h4 className="text-[#33557D] mt-6 mb-3">Soft Skills</h4>

              {/** for when there are no soft skills */}
              {softSkills.length === 0 && (
                <p className="text-gray-500 italic text-center py-4">
                  No skills added yet
                </p>
              )}

              {softSkills.map((skill, i) => (
                <div key={i} className="ml-4 mb-4 flex items-center">
                  {editable && (
                    <button onClick={() => deleteSkill(false, i)} className="cursor-pointer mr-3 text-red-400">
                      <FiX />
                    </button>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span className="whitespace-nowrap">{skill.name}</span>

                      <div className="mx-4 w-full h-1 bg-gray-200 rounded">
                        <div className="h-1 bg-blue-900 rounded" style={{ width: `${skill.level}%`, color: "#33557D"}} />
                      </div>

                      <span>{skill.level}%</span>
                    </div>
                  </div>

                  {editable && (
                    <div className="ml-3 flex gap-2">
                      <button onClick={() => onEditSkill(false, i)} className="cursor-pointer text-[#33557D] p-1 rounded-full bg-white shadow-sm"><FiEdit2 /></button>
                    </div>
                  )}
=======
              <h3 className="text-sm tracking-widest text-gray-500">{t('my_skills', language)}</h3>
              {editable && <button onClick={() => openAddForm("skill")} className="cursor-pointer rounded-full bg-gray-100 p-2"><FiPlus /></button>}
            </div>
            <div ref={skillsRef} className={`bg-white p-6 rounded-xl shadow-md border border-gray-200 max-h-[245px] overflow-y-auto ${hideScrollbar}`}>
              <h4 className="text-[#33557D] mb-3">{t('technical_skills', language)}</h4>
              {technicalSkills.map((skill) => (
                <div key={skill.id} className="ml-4 mb-4 flex items-center">
                  {editable && <button onClick={() => deleteSkill(true, skill.id)} className="cursor-pointer mr-3 text-red-400"><FiX /></button>}
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>{skill.name}</span>
                      <div className="mx-4 w-full h-1 bg-gray-200 rounded"><div className="h-1 bg-blue-900 rounded" style={{ width: `${skill.level}%` }} /></div>
                      <span>{skill.level}%</span>
                    </div>
                  </div>
                  {editable && <button onClick={() => openEditForm("skill", skill)} className="ml-3 text-[#33557D]"><FiEdit2 /></button>}
                </div>
              ))}
              <h4 className="text-[#33557D] mt-6 mb-3">{t('soft_skills', language)}</h4>
              {softSkills.map((skill) => (
                <div key={skill.id} className="ml-4 mb-4 flex items-center">
                  {editable && <button onClick={() => deleteSkill(false, skill.id)} className="cursor-pointer mr-3 text-red-400"><FiX /></button>}
                  <div className="flex-1"><div className="flex justify-between items-center text-sm text-gray-600"><span>{skill.name}</span><div className="mx-4 w-full h-1 bg-gray-200 rounded"><div className="h-1 bg-blue-900 rounded" style={{ width: `${skill.level}%` }} /></div><span>{skill.level}%</span></div></div>
                  {editable && <button onClick={() => openEditForm("skill", skill)} className="ml-3 text-[#33557D]"><FiEdit2 /></button>}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
                </div>
              ))}
            </div>
          </div>

<<<<<<< HEAD
              {/* Languages */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm tracking-widest text-gray-500">LANGUAGES I SPEAK</h3>
              {editable && <button onClick={() => openAddForm("language")} className="cursor-pointer rounded-full bg-gray-100 p-2"><FiPlus /></button>}
            </div>

            <div className="flex justify-center">
              <div ref={langRef} className={`flex gap-0 overflow-x-auto ${hideScrollbar} pb-2`}>
                {languages.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-6">
                      No languages added yet
                   </p>
                ) : (
                  languages.map((lang, i) => (
                  <div key={i} className="flex flex-col items-center min-w-[140px] relative">
                    
                    {/* Three dot menu */}
                    {editable && (
                      <div className="absolute -top-3 right-4 z-20">
                        <button onClick={() =>
                            setOpenLangMenu(openLangMenu === i ? null : i)
                          }
                          className="cursor-pointer p-1 font-semibold text-[#33557D] rounded-full"
                        >
                          ⋮
                        </button>
                      </div>
                    )}

                    {/* edit/delete overlay */}
                    {openLangMenu === i && (
                      <div ref={langMenuRef} className="absolute shadow-lg  right-6 bg-white rounded-bl-xl rounded-tl-xl shadow-md flex flex-col items-center overflow-hidden z-10">
                        <button onClick={() => {openEditForm("language", i); setOpenLangMenu(null); }} className="bg-white p-2 hover:bg-gray-100"><FiEdit2 /></button>
                        <button onClick={() => {deleteLanguage(i); setOpenLangMenu(null); }} className="bg-white p-2 hover:bg-red-100 text-red-600"><FiTrash2 /></button>
                      </div>
                    )}

                    <DonutChart percentage={lang.percent} />

                    <p className="mt-3 text-[#5F5F5F]">{lang.name}</p>
                    <span className="text-xs bg-[#003F7F]/10 text-[#33557D] px-3 py-1 rounded-full mt-1">{lang.label}</span>
                  </div>
                ))
                )}
=======
          {/* Languages */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm tracking-widest text-gray-500">{t('languages_i_speak', language)}</h3>
              {editable && <button onClick={() => openAddForm("language")} className="cursor-pointer rounded-full bg-gray-100 p-2"><FiPlus /></button>}
            </div>
            <div className="flex justify-center">
              <div ref={langRef} className={`flex flex-wrap gap-4 justify-center ${hideScrollbar} pb-2`}>
                {languages.map((lang) => {
                  const levelInfo = getLevelInfo(lang.level);
                  
                  return (
                    <div key={lang.id} className="flex flex-col items-center min-w-[120px] p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative">
                      {editable && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <button 
                            onClick={() => setOpenLangMenu(openLangMenu === lang.id ? null : lang.id)} 
                            className="p-1 font-semibold text-[#33557D] bg-white rounded-full px-2 shadow-sm border border-gray-200 hover:bg-gray-50 text-sm"
                          >
                            ⋮
                          </button>
                        </div>
                      )}
                      {openLangMenu === lang.id && (
                        <div ref={langMenuRef} className="absolute shadow-lg right-0 top-6 bg-white rounded-xl flex flex-col z-50 border border-gray-200">
                          <button 
                            onClick={() => { openEditForm("language", lang); setOpenLangMenu(null); }} 
                            className="p-2 px-4 hover:bg-gray-100 rounded-t-xl flex items-center gap-2 text-sm"
                          >
                            <FiEdit2 className="text-blue-600" /> {t('edit', language)}
                          </button>
                          <button 
                            onClick={() => { deleteLanguage(lang.id); setOpenLangMenu(null); }} 
                            className="p-2 px-4 hover:bg-red-100 text-red-600 rounded-b-xl flex items-center gap-2 text-sm"
                          >
                            <FiTrash2 /> {t('delete', language)}
                          </button>
                        </div>
                      )}
                      
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white ${levelInfo.circleColor} shadow-md`}>
                        {levelInfo.letter}
                      </div>
                      
                      <p className="mt-3 text-[#5F5F5F] font-medium text-sm">{getTranslatedLanguage(lang.name)}</p>
                      <span className={`text-xs px-3 py-1 rounded-full mt-1 font-medium ${levelInfo.bgColor}`}>
                        {levelInfo.label}
                      </span>
                    </div>
                  );
                })}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-10">
          {/* Degrees */}
          <div>
            <div className="flex items-center justify-between mb-4">
<<<<<<< HEAD
              <h3 className="text-sm tracking-widest text-gray-500">DEGREES / CERTIFICATIONS</h3>
              {editable && <button onClick={() => openAddForm("degree")} className="cursor-pointer rounded-full bg-gray-100 p-2"><FiPlus /></button>}
            </div>

                 {/** for when there are no degree */}
            {degrees.length === 0 && (
              <p className="text-gray-500 italic text-center py-4">
                  No degrees / certifications added yet
              </p>
            )}

=======
              <h3 className="text-sm tracking-widest text-gray-500">{t('degrees_certifications', language)}</h3>
              {editable && <button onClick={() => openAddForm("degree")} className="cursor-pointer rounded-full bg-gray-100 p-2"><FiPlus /></button>}
            </div>
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
            <div className="flex justify-center">
              <div ref={degreeRef} className={`flex gap-6 overflow-x-auto ${hideScrollbar} pb-4`}>
                {degrees.map((d) => (
                  <div key={d.id} className="min-w-[260px] bg-[#2f557f] text-white p-4 rounded-xl shadow-md relative">
<<<<<<< HEAD
                    {/* small overlay icons */}
                    {editable && (
                      <div className="absolute right-3 top-4 flex gap-2">
                        <button onClick={() => openEditForm("degree", d.id)} className="cursor-pointer bg-white/20 p-1 rounded text-white"><FiEdit2 /></button>
                        <button onClick={() => deleteDegree(d.id)} className="cursor-pointer bg-white/20 p-1 rounded text-red-300 "><FiTrash2 /></button>
                      </div>
                    )}

                    <span className={`text-xs bg-white/20 px-3 py-1 rounded-full  ${editable ? "float-left" : "float-right"}`}>{d.year}</span>
=======
                    {editable && (
                      <div className="absolute right-3 top-4 flex gap-2">
                        <button onClick={() => openEditForm("degree", d)} className="hover:text-gray-300"><FiEdit2 /></button>
                        <button onClick={() => deleteDegree(d.id)} className="hover:text-red-300"><FiTrash2 /></button>
                      </div>
                    )}
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full float-left">{d.year}</span>
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
                    <h4 className="text-2xl font-bold mt-6">{d.title}</h4>
                    <p>{d.field}</p>
                    <p className="text-sm mt-2">{d.school}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

<<<<<<< HEAD
              {/* Experience */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm tracking-widest text-gray-500">EXPERIENCE</h3>
              {editable && <button onClick={() => openAddForm("experience")} className="cursor-pointer rounded-full bg-gray-100 p-2"><FiPlus /></button>}
            </div>

            {/** for when there are no experiences */}
            {experience.length === 0 && (
              <p className="text-gray-500 italic mt-25 text-center py-4">
                No experiences added yet
              </p>
            )}

=======
          {/* Experience */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm tracking-widest text-gray-500">{t('experience', language)}</h3>
              {editable && <button onClick={() => openAddForm("experience")} className="cursor-pointer rounded-full bg-gray-100 p-2"><FiPlus /></button>}
            </div>
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
            <div ref={expRef} className={`flex gap-6 overflow-x-auto ${hideScrollbar} pb-4`}>
              {experience.map((e) => (
                <div key={e.id} className="min-w-[270px] min-h-[240px] bg-white shadow-md border border-gray-200 p-5 pt-9 pb-9 rounded-xl relative">
                  {editable && (
                    <div className="absolute right-5 top-9 flex gap-2">
<<<<<<< HEAD
                      <button onClick={() => openEditForm("experience", e.id)} className="cursor-pointer bg-white p-1 text-[#33557D] rounded"><FiEdit2 /></button>
                      <button onClick={() => deleteExperience(e.id)} className="cursor-pointer bg-white p-1 rounded text-red-500"><FiTrash2 /></button>
                    </div>
                  )}

                  <span className={`text-xs bg-[#E8EEF3] text-[#33557D] px-3 py-1 rounded-full  ${editable ? "float-left" : "float-right"}`}>{e.year}</span>
=======
                      <button onClick={() => openEditForm("experience", e)} className="hover:text-blue-600"><FiEdit2 /></button>
                      <button onClick={() => deleteExperience(e.id)} className="hover:text-red-600"><FiTrash2 /></button>
                    </div>
                  )}
                  <span className="text-xs bg-[#E8EEF3] text-[#33557D] px-3 py-1 rounded-full float-left">{e.year}</span>
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
                  <h4 className="text-[#33557D] text-2xl font-semibold mt-8">{e.title}</h4>
                  <p className="text-gray-600">{e.company}</p>
                  <p className="text-sm text-gray-500 mt-2">{e.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD





      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowForm(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold tracking-widest">
                {editingId === null ? "Add" : "Edit"}{" "}
                {formKind === "skill" ? "Skill" : formKind.charAt(0).toUpperCase() + formKind.slice(1)}
              </h3>
              <button onClick={() => setShowForm(false)} className="cursor-pointer hover:text-red-500  text-gray-500 text-lg"><FiX /></button>
            </div>

            <div className="space-y-4 ">
              {formKind === "skill" && (
                <>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" checked={form.isTechnical} onChange={() => setForm((f:any)=>({...f, isTechnical:true}))} />
                      Technical
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" checked={!form.isTechnical} onChange={() => setForm((f:any)=>({...f, isTechnical:false}))} />
                      Soft
                    </label>
                  </div>

                  <div>
                    <input
                      placeholder="Skill name"
                      className="w-full  border-b border-gray-300 px-3 py-2 rounded focus:border-blue-600 outline-none"
                      value={form.name}
                      onChange={(e) => { setForm((f:any)=>({...f, name: e.target.value})); if (errors.name) setErrors((s)=>{ const copy = {...s}; delete copy.name; return copy; }); }}
                    />
                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Level (%)</label>
=======
      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowForm(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? t('edit', language) : t('add', language)} {" "}
                {formKind === "skill" && t('skill', language)}
                {formKind === "language" && t('language', language)}
                {formKind === "degree" && t('degree', language)}
                {formKind === "experience" && t('experience', language)}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-red-500"><FiX size={20} /></button>
            </div>

            <div className="space-y-4">
              {/* SKILL MODAL */}
              {formKind === "skill" && (
                <>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" checked={form.isTechnical === true} onChange={() => setForm({...form, isTechnical: true})} />
                      {t('technical', language)}
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" checked={form.isTechnical === false} onChange={() => setForm({...form, isTechnical: false})} />
                      {t('soft', language)}
                    </label>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder={t('skill_name', language)}
                      className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                      value={form.name || ""}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{t('level', language)}</span>
                      <span>{form.level}%</span>
                    </div>
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={form.level}
<<<<<<< HEAD
                      onChange={(e) => { setForm((f:any)=>({...f, level: Number(e.target.value)})); if (errors.level) setErrors((s)=>{ const c={...s}; delete c.level; return c; }); }}
                      className="w-full "
                    />
                    <div className="text-sm text-gray-600">{form.level}%</div>
                    {errors.level && <div className="text-red-500 text-sm mt-1">{errors.level}</div>}
=======
                      onChange={(e) => setForm({...form, level: parseInt(e.target.value)})}
                      className="w-full"
                    />
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
                  </div>
                </>
              )}

<<<<<<< HEAD
              {formKind === "language" && (
                <>
                  <div>
                    <input placeholder="Language" className="w-full border-b border-gray-300 px-3 py-2 rounded focus:border-blue-600 outline-none" value={form.name} onChange={(e)=>{ setForm((f:any)=>({...f, name:e.target.value})); if(errors.name) setErrors((s)=>{ const c={...s}; delete c.name; return c; }); }} />
                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                  </div>
                  <div>
                    <input type="number" min={0} max={100} placeholder="Percent" className="w-full border-b border-gray-300 px-3 py-2 rounded focus:border-blue-600 outline-none" value={form.percent} onChange={(e)=>{ setForm((f:any)=>({...f, percent:Number(e.target.value)})); if(errors.percent) setErrors((s)=>{ const c={...s}; delete c.percent; return c; }); }} />
                    {errors.percent && <div className="text-red-500 text-sm mt-1">{errors.percent}</div>}
                  </div>
                  <div>
                    <input placeholder="Label (e.g. Fluent)" className="w-full border-b border-gray-300 px-3 py-2 rounded focus:border-blue-600 outline-none" value={form.label} onChange={(e)=>{ setForm((f:any)=>({...f, label:e.target.value})); if(errors.label) setErrors((s)=>{ const c={...s}; delete c.label; return c; }); }} />
                    {errors.label && <div className="text-red-500 text-sm mt-1">{errors.label}</div>}
=======
              {/* LANGUAGE MODAL */}
              {formKind === "language" && (
                <>
                  <div>
                    <input
                      type="text"
                      list="languages-list"
                      placeholder={t('language_name', language)}
                      className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                      value={form.name || ""}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      autoComplete="off"
                    />
                    <datalist id="languages-list">
                      <option value="Français" />
                      <option value="Anglais" />
                      <option value="Espagnol" />
                      <option value="Allemand" />
                      <option value="Italien" />
                      <option value="Portugais" />
                      <option value="Néerlandais" />
                      <option value="Russe" />
                      <option value="Chinois" />
                      <option value="Japonais" />
                      <option value="Coréen" />
                      <option value="Arabe" />
                      <option value="Hindi" />
                      <option value="Turc" />
                      <option value="Grec" />
                      <option value="Latin" />
                      <option value="Suédois" />
                      <option value="Norvégien" />
                      <option value="Danois" />
                      <option value="Polonais" />
                      <option value="Ukrainien" />
                      <option value="Vietnamien" />
                      <option value="Thaï" />
                      <option value="Indonésien" />
                      <option value="Malais" />
                      <option value="Perse" />
                      <option value="Ourdou" />
                      <option value="Bengali" />
                      <option value="Pendjabi" />
                      <option value="Swahili" />
                      <option value="Zoulou" />
                      <option value="Afrikaans" />
                      <option value="Irlandais" />
                      <option value="Gallois" />
                      <option value="Basque" />
                      <option value="Catalan" />
                      <option value="Tchèque" />
                      <option value="Slovaque" />
                      <option value="Hongrois" />
                      <option value="Roumain" />
                      <option value="Bulgare" />
                      <option value="Serbe" />
                      <option value="Croate" />
                      <option value="Slovène" />
                      <option value="Estonien" />
                      <option value="Letton" />
                      <option value="Lituanien" />
                      <option value="Finnois" />
                      <option value="Islandais" />
                      <option value="Maltais" />
                      <option value="Albanais" />
                      <option value="Macédonien" />
                      <option value="Bosniaque" />
                      <option value="Monténégrin" />
                    </datalist>
                    <p className="text-xs text-gray-400 mt-1">
                      {t('type_to_search', language)}
                    </p>
                  </div>
                  <div>
                    <select
                      value={form.level || ""}
                      onChange={(e) => setForm({...form, level: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">{t('select_level', language)}</option>
                      <option value="débutant">{t('level_beginner', language)}</option>
                      <option value="intermédiaire">{t('level_intermediate', language)}</option>
                      <option value="courant">{t('level_fluent', language)}</option>
                      <option value="natif">{t('level_native', language)}</option>
                    </select>
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
                  </div>
                </>
              )}

<<<<<<< HEAD
              {formKind === "degree" && (
                <>
                  <div><input placeholder="Year (e.g. 2018-2020)" className="focus:border-blue-600 outline-none w-full border-b border-gray-300 px-3 py-2 rounded" value={form.year} onChange={(e)=>{ setForm((f:any)=>({...f, year:e.target.value})); if(errors.year) setErrors((s)=>{ const c={...s}; delete c.year; return c; }); }} />{errors.year && <div className="text-red-500 text-sm mt-1">{errors.year}</div>}</div>
                  <div><input placeholder="Title (e.g. Bachelors)" className="focus:border-blue-600 outline-none w-full border-b border-gray-300 px-3 py-2 rounded" value={form.title} onChange={(e)=>{ setForm((f:any)=>({...f, title:e.target.value})); if(errors.title) setErrors((s)=>{ const c={...s}; delete c.title; return c; }); }} />{errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}</div>
                  <div><input placeholder="Field (e.g. Software Engineering)" className="focus:border-blue-600 outline-none w-full border-b border-gray-300 px-3 py-2 rounded" value={form.field} onChange={(e)=>{ setForm((f:any)=>({...f, field:e.target.value})); if(errors.field) setErrors((s)=>{ const c={...s}; delete c.field; return c; }); }} />{errors.field && <div className="text-red-500 text-sm mt-1">{errors.field}</div>}</div>
                  <div><input placeholder="School" className="focus:border-blue-600 outline-none w-full border-b border-gray-300 focus:border-blue-600 px-3 py-2 rounded" value={form.school} onChange={(e)=>{ setForm((f:any)=>({...f, school:e.target.value})); if(errors.school) setErrors((s)=>{ const c={...s}; delete c.school; return c; }); }} />{errors.school && <div className="text-red-500 text-sm mt-1">{errors.school}</div>}</div>
                </>
              )}

              {formKind === "experience" && (
                <>
                  <div><input placeholder="Year (e.g. 2018-2025)" className="focus:border-blue-600 outline-none w-full border-b border-gray-300 px-3 py-2 rounded" value={form.year} onChange={(e)=>{ setForm((f:any)=>({...f, year:e.target.value})); if(errors.year) setErrors((s)=>{ const c={...s}; delete c.year; return c; }); }} />{errors.year && <div className="text-red-500 text-sm mt-1">{errors.year}</div>}</div>
                  <div><input placeholder="Title" className="focus:border-blue-600 outline-none w-full border-b border-gray-300 px-3 py-2 rounded" value={form.title} onChange={(e)=>{ setForm((f:any)=>({...f, title:e.target.value})); if(errors.title) setErrors((s)=>{ const c={...s}; delete c.title; return c; }); }} />{errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}</div>
                  <div><input placeholder="Company" className="focus:border-blue-600 outline-none w-full border-b border-gray-300 px-3 py-2 rounded" value={form.company} onChange={(e)=>{ setForm((f:any)=>({...f, company:e.target.value})); if(errors.company) setErrors((s)=>{ const c={...s}; delete c.company; return c; }); }} />{errors.company && <div className="text-red-500 text-sm mt-1">{errors.company}</div>}</div>
                  <div><textarea placeholder="Description" rows={4} className="focus:border-blue-600 outline-none w-full border border-gray-300 px-3 py-2 rounded" value={form.description} onChange={(e)=>{ setForm((f:any)=>({...f, description:e.target.value})); if(errors.description) setErrors((s)=>{ const c={...s}; delete c.description; return c; }); }} />{errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}</div>
                </>
              )}

              <div className="flex justify-center gap-4 pt-2">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 cursor-pointer rounded-3xl border border-gray-400 text-gray-600 hover:bg-gray-100">Cancel</button>
                <button onClick={submitForm} className="px-4 py-2 cursor-pointer rounded-3xl bg-[#003F7F] hover:bg-[#004F9F] text-white">{editingId === null ? "Create" : "Save"}</button>
=======
              {/* DEGREE MODAL */}
              {formKind === "degree" && (
                <>
                  <div>
                    <input
                      type="text"
                      placeholder={t('degree_title', language)}
                      className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                      value={form.title || ""}
                      onChange={(e) => setForm({...form, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder={t('institution', language)}
                      className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                      value={form.institution || ""}
                      onChange={(e) => setForm({...form, institution: e.target.value})}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder={t('year', language)}
                      className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                      value={form.year || ""}
                      onChange={(e) => setForm({...form, year: e.target.value})}
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder={t('description', language)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                      value={form.description || ""}
                      onChange={(e) => setForm({...form, description: e.target.value})}
                    />
                  </div>
                </>
              )}

              {/* EXPERIENCE MODAL */}
              {formKind === "experience" && (
                <>
                  <div>
                    <input
                      type="text"
                      placeholder={t('exp_title', language)}
                      className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                      value={form.title || ""}
                      onChange={(e) => setForm({...form, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder={t('company', language)}
                      className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                      value={form.company || ""}
                      onChange={(e) => setForm({...form, company: e.target.value})}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder={t('start_date', language)}
                      className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                      value={form.start_date || ""}
                      onChange={(e) => setForm({...form, start_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder={t('end_date', language)}
                      className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                      value={form.end_date || ""}
                      onChange={(e) => setForm({...form, end_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder={t('description', language)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                      value={form.description || ""}
                      onChange={(e) => setForm({...form, description: e.target.value})}
                    />
                  </div>
                </>
              )}

              {/* BOUTONS */}
              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 transition"
                >
                  {t('cancel', language)}
                </button>
                <button
                  onClick={submitForm}
                  className="px-6 py-2 rounded-full bg-[#003F7F] hover:bg-[#004F9F] text-white transition"
                >
                  {editingId ? t('save', language) : t('create', language)}
                </button>
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
