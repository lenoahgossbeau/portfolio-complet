import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import Re_PublicationSlider from "@/components/Researcher_pages/Researcher_Publication_Preview";
import { IoCameraOutline } from "react-icons/io5";
import { API_ENDPOINTS, fetchWithAuth } from '@/lib/api';
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/locales/translations";

export default function Researcher_Publication_Tab_Content() {
    const { language } = useLanguage();
    const langKey = language.toLowerCase();

    ////////////////////////////////////////////
    //////  PUBLICATION STATE (FROM API)  //////
    ////////////////////////////////////////////
    const [publications, setPublications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [authors, setAuthors] = useState<string[]>([]);
    const [authorInput, setAuthorInput] = useState('');

    // Charge les publications depuis l'API
    useEffect(() => {
        const fetchPublications = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setLoading(false);
                return;
            }
            
            try {
                const response = await fetchWithAuth(API_ENDPOINTS.publications);
                const data = await response.json();
                const formattedPublications = data.map((pub: any) => ({
                    id: pub.id,
                    image: pub.image || "",
                    title: pub.title,
                    date: pub.year?.toString() || '',
                    description: pub.description || '',
                    author: pub.coauthor || [],
                    journal: pub.journal || '',
                    doi: pub.doi || '',
                    link: `/publications/${pub.id}`
                }));
                setPublications(formattedPublications);
            } catch (error) {
                console.error('Erreur chargement publications:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchPublications();
    }, []);

    //////////////////////////
    //////  FORM STATE  //////
    //////////////////////////
    const [form, setForm] = useState({
        id: null as number | null,
        image: "",
        title: "",
        date: "",
        description: "",
        journal: "",
        doi: ""
    });
    const isEditing = form.id !== null;
  
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    ///////////////////////////////////////
    //////  Field Validation States  //////
    ///////////////////////////////////////
    const [errors, setErrors] = useState({
        title: "",
        date: "",
        description: ""
    });

    // Gestion des auteurs
    const addAuthor = () => {
        if (authorInput.trim()) {
            setAuthors([...authors, authorInput.trim()]);
            setAuthorInput('');
        }
    };

    const removeAuthor = (index: number) => {
        setAuthors(authors.filter((_, i) => i !== index));
    };

    const handleAuthorKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addAuthor();
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setSelectedFile(file);

        if (!file.type.startsWith("image/")) {
            alert(t("invalid_image_file", langKey));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const imageData = reader.result as string;

            setImagePreview(imageData);

            setForm((prev) => ({
                ...prev,
                image: imageData
            }));
        };

        reader.readAsDataURL(file);
    };
    
    const updateField = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: "" }));
    }

    // Rafraîchir la liste
    const refreshPublications = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        
        try {
            const response = await fetchWithAuth(API_ENDPOINTS.publications);
            const data = await response.json();
            const formattedPublications = data.map((pub: any) => ({
                id: pub.id,
                image: pub.image || "",
                title: pub.title,
                date: pub.year?.toString() || '',
                description: pub.description || '',
                author: pub.coauthor || [],
                journal: pub.journal || '',
                doi: pub.doi || '',
                link: `/publications/${pub.id}`
            }));
            setPublications(formattedPublications);
        } catch (error) {
            console.error('Erreur rafraîchissement publications:', error);
        }
    };

    // CREATE
    const handleCreate = async () => {
        if (!validate()) return;
        
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert(t("please_login_again", langKey));
            return;
        }

        if (authors.length === 0) {
            alert(t("author_required", langKey));
            return;
        }

        const year = parseInt(form.date.split('-')[0], 10);

        let imageUrl = form.image;

        if (selectedFile) {
            const uploadData = new FormData();
            uploadData.append("file", selectedFile);

            const uploadResponse = await fetchWithAuth(
                `${API_ENDPOINTS.publications}upload-image`,
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
            year: parseInt(form.date.split('-')[0]),
            title: form.title,
            coauthor: authors,
            journal: form.journal,
            doi: form.doi,
            description: form.description,
            image: imageUrl,
        };

        try {
            const response = await fetchWithAuth(API_ENDPOINTS.publications, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                await refreshPublications();
                resetForm();
                setAuthors([]);
                alert(t("publication_created_success", langKey));
            } else {
                const error = await response.json();
                alert(`Erreur: ${error.detail || t("creation_failed", langKey)}`);
            }
        } catch (error) {
            console.error('Erreur création publication:', error);
            alert(t("publication_create_error", langKey));
        }
    };

    // UPDATE
    const handleSave = async () => {
        if (!validate()) return;
        
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert(t("please_login_again", langKey));
            return;
        }

        const year = parseInt(form.date.split('-')[0], 10);

        let imageUrl = form.image;

        if (selectedFile) {
            const uploadData = new FormData();
            uploadData.append("file", selectedFile);

            const uploadResponse = await fetchWithAuth(
                `${API_ENDPOINTS.publications}upload-image`,
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
            year: parseInt(form.date.split('-')[0]),
            title: form.title,
            coauthor: authors,
            journal: form.journal,
            doi: form.doi,
            description: form.description,
            image: imageUrl,
        };

        try {
            const response = await fetchWithAuth(`${API_ENDPOINTS.publications}${form.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                await refreshPublications();
                resetForm();
                setAuthors([]);
                alert(t("publication_updated_success", langKey));
            } else {
                const error = await response.json();
                alert(`Erreur: ${error.detail || t("update_failed", langKey)}`);
            }
        } catch (error) {
            console.error('Erreur modification publication:', error);
            alert(t("publication_update_error", langKey));
        }
    };

    const resetForm = () => {
        setForm({
            id: null,
            image: "",
            title: "",
            date: "",
            description: "",
            journal: "",
            doi: ""
        });
        setImagePreview(null);
        setSelectedFile(null);
        setAuthors([]);
        setErrors({
            title: "",
            date: "",
            description: ""
        });
    };

    const handleEditFromCard = (pub: any) => {
        setForm({
            id: pub.id,
            image: pub.image || "",
            title: pub.title,
            date: pub.date,
            description: pub.description || '',
            journal: pub.journal || '',
            doi: pub.doi || ''
        });
        setAuthors(pub.author || []);
    };

    const handleDeleteFromCard = async (id: number) => {
        if (!confirm(t("publication_delete_confirm", langKey))) return;
        
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert(t("please_login_again", langKey));
            return;
        }

        try {
            const response = await fetchWithAuth(`${API_ENDPOINTS.publications}${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                await refreshPublications();
                if (form.id === id) resetForm();
                alert(t("publication_deleted_success", langKey));
            } else {
                alert(t("publication_delete_error", langKey));
            }
        } catch (error) {
            console.error('Erreur suppression:', error);
            alert(t("publication_delete_error", langKey));
        }
    };

    const validate = () => {
        const newErrors: any = {};
        if (!form.title.trim()) newErrors.title = t("title_required", langKey);
        if (!form.date.trim()) newErrors.date = t("date_required", langKey);
        if (!form.description.trim()) newErrors.description = t("description_required", langKey);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                {t("loading_publications", langKey)}
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
                    {form.image ? (
                        <img
                            src={
                                form.image.startsWith("data:")
                                    ? form.image
                                    : `${API_ENDPOINTS.profile.replace("/profiles", "")}${form.image}`
                            }
                            className="w-full h-full object-cover"
                            alt={t("publication_preview", langKey)}
                        />
                    ) : (
                        <div className="flex flex-col items-center text-gray-500">
                            <IoCameraOutline size={45} className="text-gray-500" />
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
                                onChange={(e) => updateField("title", e.target.value)}
                                className="w-full pl-2 border-b border-gray-300 focus:border-blue-600 outline-none py-1"
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                        </div>
                        
                        <div className="w-1/2">
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => updateField("date", e.target.value)}
                                className="w-full pl-2 border-b border-gray-300 focus:border-blue-600 outline-none py-1"
                            />
                            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                        </div>
                    </div>
                      
                    {/* AUTHORS SECTION */}
                    <div>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {authors.map((author, idx) => (
                                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                                    {author}
                                    <button
                                        type="button"
                                        onClick={() => removeAuthor(idx)}
                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder={t("add_author", langKey)}
                                value={authorInput}
                                onChange={(e) => setAuthorInput(e.target.value)}
                                onKeyDown={handleAuthorKeyDown}
                                className="flex-1 pl-2 border-b border-gray-300 focus:border-blue-600 outline-none py-1"
                            />
                            <button
                                type="button"
                                onClick={addAuthor}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                {t("add", langKey)}
                            </button>
                        </div>
                    </div>

                    {/* JOURNAL */}
                    <div>
                        <input
                            type="text"
                            placeholder={`${t("journal", langKey)} / ${t("conference", langKey)}`}
                            value={form.journal}
                            onChange={(e) => updateField("journal", e.target.value)}
                            className="w-full pl-2 border-b border-gray-300 focus:border-blue-600 outline-none py-1"
                        />
                    </div>

                    {/* DOI */}
                    <div>
                        <input
                            type="text"
                            placeholder={`${t("doi", langKey)} (e.g. 10.1234/test.2024.001)`}
                            value={form.doi}
                            onChange={(e) => updateField("doi", e.target.value)}
                            className="w-full pl-2 border-b border-gray-300 focus:border-blue-600 outline-none py-1"
                        />
                    </div>
                      
                    <div>
                        <textarea
                            placeholder={t("description", langKey)}
                            value={form.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-600 outline-none resize-none scrollbar-hide"
                            rows={4}
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>
                      
                    <div className="flex justify-center gap-4 pt-4">
                        <button 
                            onClick={resetForm}
                            className="cursor-pointer px-4 py-2 border border-gray-400 rounded-full text-gray-600 hover:bg-gray-100"
                        >
                            {t("cancel", langKey)}
                        </button>

                        {!isEditing ? (
                            <button 
                                onClick={handleCreate}
                                className="cursor-pointer px-4 py-2 bg-[#003F7F] text-white rounded-full hover:bg-[#004F9F]"
                            >
                                {t("create", langKey)}
                            </button>
                        ) : (
                            <button 
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
                <Re_PublicationSlider 
                    editable={true}
                    publications={publications}
                    onEdit={handleEditFromCard}
                    onDelete={handleDeleteFromCard}
                />
            </div>
        </div>
    );
}