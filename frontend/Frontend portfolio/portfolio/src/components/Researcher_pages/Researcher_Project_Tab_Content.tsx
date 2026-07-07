<<<<<<< HEAD

import React, { useState, useRef, ChangeEvent } from "react";
import Re_ProjectSlider from "@/components/Researcher_pages/Researcher_Project_Preview";
import { IoCameraOutline } from "react-icons/io5";


export default function Researcher_Project_Tab_Content() {


    ////////////////////////////////////////////
    //////  PROJECT STATE (TEMP BACKEND)  //////
    ////////////////////////////////////////////
      const [projects, setProjects] = useState<any[]>([
        {
          id: 1,
          image: "",
          title: "Sample Project",
          date: "01-12-2025",
          description: "Description details here A passionate software engineer specializing in building modern, responsive, and user-friendly web solutions. A passionate software engineer specializing in building modern, responsive, and user-friendly web solutions.",
          link: ""
        }
      ]);


    //////////////////////////
    //////  FORM STATE  //////
      const [form, setForm] = useState({
=======
import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import Re_ProjectSlider from "@/components/Researcher_pages/Researcher_Project_Preview";
import { IoCameraOutline } from "react-icons/io5";
import { API_ENDPOINTS, fetchWithAuth } from '@/lib/api';

export default function Researcher_Project_Tab_Content() {

    ////////////////////////////////////////////
    //////  PROJECT STATE (FROM API)  //////
    ////////////////////////////////////////////
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Charge les projets depuis l'API
    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setLoading(false);
                return;
            }
            
            try {
                const response = await fetchWithAuth(API_ENDPOINTS.projects);
                const data = await response.json();
                // Transforme les données pour correspondre au format attendu
                const formattedProjects = data.map((project: any) => ({
                    id: project.id,
                    image: "",
                    title: project.title,
                    date: project.year?.toString() || '',
                    description: project.description || '',
                    link: `/projects/${project.id}`
                }));
                setProjects(formattedProjects);
            } catch (error) {
                console.error('Erreur chargement projets:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProjects();
    }, []);

    //////////////////////////
    //////  FORM STATE  //////
    //////////////////////////
    const [form, setForm] = useState({
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
        id: null as number | null,
        image: "",
        title: "",
        date: "",
        description: "",
        link: ""
<<<<<<< HEAD
      })
      // when editing, the form id should not be null
      const isEditing = form.id !== null;
    
      // Handle image upload
      const [imagePreview, setImagePreview] = useState<string | null>(null);
      const fileInputRef = useRef<HTMLInputElement | null>(null);
    
    
    
      ///////////////////////////////////////
      //////  Field Validation States  //////
      ///////////////////////////////////////
      const [errors, setErrors] = useState({
=======
    })
    // when editing, the form id should not be null
    const isEditing = form.id !== null;
  
    // Handle image upload
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    ///////////////////////////////////////
    //////  Field Validation States  //////
    ///////////////////////////////////////
    const [errors, setErrors] = useState({
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
        title: "",
        date: "",
        description: "",
        link: ""
<<<<<<< HEAD
      });
    
    
    
      const handleImageClick = () => {
        fileInputRef.current?.click();
      };
    
      const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        if (!file.type.startsWith("image/")) {
          alert("Please upload an image file");
          return;
        }
    
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
          setForm((prev) => ({ ...prev, image: reader.result as string })); /// added this
        };
        reader.readAsDataURL(file);
      };
      
    
    
      //////////////////////////////////
      //////  FORM INPUT HANDLER  //////
      //////////////////////////////////
      const updateField = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    
        // Clear the error for the field being edited
        setErrors((prev) => ({ ...prev, [key]: "" }));
      }
    
    
    
      //////////////////////////////////
      //////  CREATE NEW PROJECT  //////
      //////////////////////////////////
      const handleCreate = () => {
        if (!validate()) return;     // <<--- stop if invalid
    
        const newProject = {
          ...form,        
          id: Date.now(),   
        };
    
        setProjects((prev) => [...prev, newProject]);
    
        resetForm();
      };
    
    
    
      ///////////////////////////////////
      //////  SAVE EDITED PROJECT  //////
      ///////////////////////////////////
      const handleSave = () => {
        if (!validate()) return;     // <<--- stop if invalid
    
        setProjects((prev) =>
          prev.map((p) => (p.id === form.id ? { ...p, ...form} : p))
        );
    
        resetForm();
      }
    
    
    
      ///////////////////////////////////
      //////  RESET FORM  ///////////////
      ///////////////////////////////////
      const resetForm = () => {
        setForm({
          id: null,
          image: "",
          title: "",
          date: "",
          description: "",
          link: ""
        });
    
        setErrors({
          title: "",
          date: "",
          description: "",
          link: ""
        })
      };
    
    
    
      ///////////////////////////////////////
      //////  ON EDIT CLICK FROM CARD  //////
      ///////////////////////////////////////
      const handleEditFromCard = (project: any) => {
        setForm(project);
      }
    
    
    
      //////////////////////////////
      //////  DELETE PROJECT  //////
      //////////////////////////////
      const handleDeleteFromCard = (id: number) => {
        setProjects((prev) => prev.filter((p) => p.id !== id));
    
        // if deleted one was on form
        if (form.id === id) resetForm();
      };
    
    
    
     
    
      ////////////////////////////////////
      ////////  Field Validator  /////////
      ////////////////////////////////////
      const validate = () => {
=======
    });

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
            setForm((prev) => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };
    
    //////////////////////////////////
    //////  FORM INPUT HANDLER  //////
    //////////////////////////////////
    const updateField = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: "" }));
    }

    // Fonction pour rafraîchir la liste des projets
    const refreshProjects = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        
        try {
            const response = await fetchWithAuth(API_ENDPOINTS.projects);
            const data = await response.json();
            const formattedProjects = data.map((project: any) => ({
                id: project.id,
                image: "",
                title: project.title,
                date: project.year?.toString() || '',
                description: project.description || '',
                link: `/projects/${project.id}`
            }));
            setProjects(formattedProjects);
        } catch (error) {
            console.error('Erreur rafraîchissement projets:', error);
        }
    };

    //////////////////////////////////
    //////  CREATE NEW PROJECT  //////
    //////////////////////////////////
    const handleCreate = async () => {
        if (!validate()) return;
        
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Veuillez vous reconnecter');
            return;
        }

        const body = {
            profile_id: 1, // À récupérer dynamiquement du profil utilisateur
            year: parseInt(form.date.split('-')[0]), // Extrait l'année de la date
            title: form.title,
            coauthor: [],
            description: form.description
        };

        try {
            const response = await fetch(API_ENDPOINTS.projects, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                await refreshProjects();
                resetForm();
                alert('Projet créé avec succès !');
            } else {
                const error = await response.json();
                alert(`Erreur: ${error.detail || 'Création échouée'}`);
            }
        } catch (error) {
            console.error('Erreur création projet:', error);
            alert('Erreur lors de la création du projet');
        }
    };

    ///////////////////////////////////
    //////  SAVE EDITED PROJECT  //////
    ///////////////////////////////////
    const handleSave = async () => {
        if (!validate()) return;
        
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Veuillez vous reconnecter');
            return;
        }

        const body = {
            year: parseInt(form.date.split('-')[0]),
            title: form.title,
            coauthor: [],
            description: form.description
        };

        try {
            const response = await fetch(`${API_ENDPOINTS.projects}${form.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                await refreshProjects();
                resetForm();
                alert('Projet modifié avec succès !');
            } else {
                const error = await response.json();
                alert(`Erreur: ${error.detail || 'Modification échouée'}`);
            }
        } catch (error) {
            console.error('Erreur modification projet:', error);
            alert('Erreur lors de la modification du projet');
        }
    }

    ///////////////////////////////////
    //////  RESET FORM  ///////////////
    ///////////////////////////////////
    const resetForm = () => {
        setForm({
            id: null,
            image: "",
            title: "",
            date: "",
            description: "",
            link: ""
        });
        setImagePreview(null);
        setErrors({
            title: "",
            date: "",
            description: "",
            link: ""
        });
    };

    ///////////////////////////////////////
    //////  ON EDIT CLICK FROM CARD  //////
    ///////////////////////////////////////
    const handleEditFromCard = (project: any) => {
        setForm(project);
    }

    //////////////////////////////
    //////  DELETE PROJECT  //////
    //////////////////////////////
    const handleDeleteFromCard = async (id: number) => {
        if (!confirm('Supprimer ce projet ?')) return;
        
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Veuillez vous reconnecter');
            return;
        }

        try {
            const response = await fetch(`${API_ENDPOINTS.projects}${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                await refreshProjects();
                if (form.id === id) resetForm();
                alert('Projet supprimé avec succès !');
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Erreur suppression projet:', error);
            alert('Erreur lors de la suppression');
        }
    };

    ////////////////////////////////////
    ////////  Field Validator  /////////
    ////////////////////////////////////
    const validate = () => {
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
        const newErrors: any = {};
      
        if (!form.title.trim()) newErrors.title = "Title is required";
        if (!form.date.trim()) newErrors.date = "Date is required";
        if (!form.description.trim()) newErrors.description = "Description is required";
        if (!form.link.trim()) newErrors.link = "Link is required";
      
        setErrors(newErrors);
<<<<<<< HEAD
      
        return Object.keys(newErrors).length === 0;  // true = valid
      };
    



  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
                    
        {/* LEFT FORM CARD */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      
          {/* IMAGE UPLOAD AREA */}
          <div
            onClick={handleImageClick}
            className="relative w-full h-60 bg-gray-300 flex items-center justify-center cursor-pointer"
          >
    
            {/* added this second condition */}
            {form.image ? (
              <img
                src={form.image}
                className="w-full h-full object-cover"
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
                {/** <label className="text-sm text-gray-400">Title</label> */}
                <input
                  type="text"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full pl-2 border-b border-gray-300 focus:border-blue-600 outline-none py-1"
                />
    
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>
              
              <div className="w-1/2">
                {/** <label className="text-sm text-gray-400">Date done</label> */}
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  className="w-full pl-2 border-b border-gray-300 focus:border-blue-600 outline-none py-1"
                />
    
                {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
              </div>
            </div>
              
            <div>
              {/** <label className="text-sm text-gray-400">Description</label> */}
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-600 outline-none resize-none scrollbar-hide"
                rows={4}
              />
    
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
              
            <div>
              {/** <label className="text-sm text-gray-400">Link</label> */}
              <input
                type="link"
                placeholder="Link"
                value={form.link}
                onChange={(e) => updateField("link", e.target.value)}
                className="w-full pl-2 border-b border-gray-300 focus:border-blue-600 outline-none py-1"
              />
    
              {errors.link && <p className="text-red-500 text-sm">{errors.link}</p>}
            </div>
              
            <div className="flex justify-center gap-4 pt-4">
              <button 
                onClick={resetForm}
                className="cursor-pointer px-4 py-2 border border-gray-400 rounded-full text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
    
              {!isEditing ? (
                <button 
                  onClick={handleCreate}
                  className="cursor-pointer px-4 py-2 bg-[#003F7F] text-white rounded-full hover:bg-[#004F9F]"
                >
                  CREATE
                </button>
    
              ) : (
                <button 
                  onClick={handleSave}
                  className="cursor-pointer px-4 py-2 bg-[#003F7F] text-white rounded-full hover:bg-[#004F9F]"
                >
                  SAVE
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
  )
}
=======
        return Object.keys(newErrors).length === 0;
    };

    if (loading) {
        return <div className="text-center py-20">Chargement des projets...</div>;
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
                        <img src={form.image} className="w-full h-full object-cover" />
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
                                placeholder="Title"
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
                      
                    <div>
                        <textarea
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-600 outline-none resize-none scrollbar-hide"
                            rows={4}
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>
                      
                    <div>
                        <input
                            type="link"
                            placeholder="Link"
                            value={form.link}
                            onChange={(e) => updateField("link", e.target.value)}
                            className="w-full pl-2 border-b border-gray-300 focus:border-blue-600 outline-none py-1"
                        />
                        {errors.link && <p className="text-red-500 text-sm">{errors.link}</p>}
                    </div>
                      
                    <div className="flex justify-center gap-4 pt-4">
                        <button 
                            onClick={resetForm}
                            className="cursor-pointer px-4 py-2 border border-gray-400 rounded-full text-gray-600 hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        {!isEditing ? (
                            <button 
                                onClick={handleCreate}
                                className="cursor-pointer px-4 py-2 bg-[#003F7F] text-white rounded-full hover:bg-[#004F9F]"
                            >
                                CREATE
                            </button>
                        ) : (
                            <button 
                                onClick={handleSave}
                                className="cursor-pointer px-4 py-2 bg-[#003F7F] text-white rounded-full hover:bg-[#004F9F]"
                            >
                                SAVE
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
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
