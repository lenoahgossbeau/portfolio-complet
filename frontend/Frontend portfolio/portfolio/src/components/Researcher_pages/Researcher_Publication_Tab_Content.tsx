<<<<<<< HEAD

import React, { useState, useRef, ChangeEvent } from "react";
import Re_PublicationSlider from "./Researcher_Publication_Preview";



export default function Researcher_Publication_Tab_Content() {


    ////////////////////////////////////////////
    ////  PUBLICATION STATE (TEMP BACKEND)  ////
    ////////////////////////////////////////////
    const [publications, setPublications] = useState<any[]>([
      {
        id: 1,
        title: "Sample Publication",
        author: ["Ekwoge junior", "James"],
        date: "1st November 2025",
        description: "Maximize your tax returns and minimize common errors with our expert guidance. Our system streamlines the entire declaration process, helping you find every eligible deduction and optimize your financial outcomes effortlessly declaration process, helping you find every eligible deduction and optimize your financial outcomes effortlessly declaration process, helping you find every eligible deduction and optimize your financial outcomes effortlessly...",
        link: ""
      }
    ]);


    
    //////////////////////////////
    ////  AUTHOR INPUT STATE  ////
    //////////////////////////////
    const [authorInput, setAuthorInput] = useState("") // holds the text currently being typed



    //////////////////////////
    //////  FORM STATE  //////
    const [form, setForm] = useState({
        id: null as number | null,
        title: "",
        author: [] as string[], // can take multiple authors
=======
import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import Re_PublicationSlider from "@/components/Researcher_pages/Researcher_Publication_Preview";
import { IoCameraOutline } from "react-icons/io5";
import { API_ENDPOINTS, fetchWithAuth } from '@/lib/api';

export default function Researcher_Publication_Tab_Content() {

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
                    image: "",
                    title: pub.title,
                    date: pub.year?.toString() || '',
                    description: pub.description || '',
                    author: pub.coauthor || [],
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
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
        date: "",
        description: "",
        link: ""
    })
<<<<<<< HEAD
    // when editing, the form id should not be null
    const isEditing = form.id !== null;
    

     
=======
    const isEditing = form.id !== null;
  
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
    ///////////////////////////////////////
    //////  Field Validation States  //////
    ///////////////////////////////////////
    const [errors, setErrors] = useState({
        title: "",
<<<<<<< HEAD
        author: "",
=======
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
        date: "",
        description: "",
        link: ""
    });
<<<<<<< HEAD
      
    

    //////////////////////////////////
    //////  FORM INPUT HANDLER  //////
    //////////////////////////////////
    const updateField = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    
        // Clear the error for the field being edited
        setErrors((prev) => ({ ...prev, [key]: "" }));
    }
    


    ///////////////////////////////
    ////  ADD AUTHOR HANDLERS  ////
    ///////////////////////////////
    const addAuthor = () => {
      const value = authorInput.trim();
      if (!value) return;

      if (!form.author.includes(value)) {
        setForm(prev => ({
          ...prev,
          author: [...prev.author, value]
        }));
      }


      setAuthorInput("");
      setErrors(prev => ({ ...prev, author: "" }));
    }



    ////////////////////////////////////////////////
    ////  HANDLE ENTER/COMMA TO SAVE AN AUTHOR  ////
    ////////////////////////////////////////////////
    const handleAuthorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addAuthor();
      }


      // Optional UX: backspace removes last tag
      {/** if (e.key === "Backspace" && !authorInput && form.author.length) {
        setForm(prev => ({
          ...prev,
          author: prev.author.slice(0, -1)
        }));
      }*/}
    };



    //////////////////////////////////
    ////  REMOVE AUTHOR HANDLERS  ////
    //////////////////////////////////
    const removeAuthor = (index: number) => {
      setForm(prev => ({
        ...prev,
        author: prev.author.filter((_, i) => i !== index)
      }));
    };

    
    
    //////////////////////////////////////
    //////  CREATE NEW PUBLICATION  //////
    //////////////////////////////////////
    const handleCreate = () => {
        if (!validate()) return;     // <<--- stop if invalid
    
        const newPublication = {
          ...form,        
          id: Date.now(),   
        };
    
        setPublications((prev) => [...prev, newPublication]);
    
        resetForm();
    };
    
    
    
    ///////////////////////////////////////
    //////  SAVE EDITED PUBLICATION  //////
    ///////////////////////////////////////
    const handleSave = () => {
        if (!validate()) return;     // <<--- stop if invalid
    
        setPublications((prev) =>
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
          title: "",
          author: [],
          date: "",
          description: "",
          link: ""
        });
    
        setErrors({
          title: "",
          author: "",
          date: "",
          description: "",
          link: ""
        })
    };
    
    
    
    ///////////////////////////////////////
    //////  ON EDIT CLICK FROM CARD  //////
    ///////////////////////////////////////
    
    {/** 
      const handleEditFromCard = (publication: any) => {
        setForm(publication);
      }
    */}

    const handleEditFromCard = (publication: any) => {
      setForm({
        ...publication,
        author: publication.author ?? []
      });
    };
    
    
    
    //////////////////////////////////
    //////  DELETE PUBLICATION  //////
    //////////////////////////////////
    const handleDeleteFromCard = (id: number) => {
        setPublications((prev) => prev.filter((p) => p.id !== id));
    
        // if deleted one was on form
        if (form.id === id) resetForm();
    };
    
    
    
    ////////////////////////////////////
    ////////  Field Validator  /////////
    ////////////////////////////////////
    const validate = () => {
        const newErrors: any = {};
      
        if (!form.title.trim()) newErrors.title = "Title is required";
        if (!form.author.length) newErrors.author = "At least one Author is required";
        if (!form.date.trim()) newErrors.date = "Publication date is required";
        if (!form.description.trim()) newErrors.description = "Description is required";
        if (!form.link.trim()) newErrors.link = "Link is required";
      
        setErrors(newErrors);
      
        return Object.keys(newErrors).length === 0;  // true = valid
    };
    





  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
                    
        {/* LEFT FORM CARD */}
        <div className="self-start bg-white min-h-[390px] max-h-[450px] rounded-2xl shadow-lg border border-gray-300 overflow-y-auto scrollbar-hide">
     
  
              
            {/* FORM SECTION */}
            <div className="p-6 mt-2 space-y-5">
              
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
    

                <div className="flex gap-6">

                    <div className="w-1/2">
                      <div className="border-b border-gray-300 focus-within:border-blue-600 pb-2 flex flex-wrap gap-2">
                        
                        {form.author.map((author_name, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-2 bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm"
                          >
                            {author_name}
                            <button
                              type="button"
                              onClick={() => removeAuthor(i)}
                              className="hover:text-red-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}

                        <input
                          type="text"
                          value={authorInput}
                          onChange={(e) => setAuthorInput(e.target.value)}
                          onKeyDown={handleAuthorKeyDown}
                          placeholder="Add author & press Enter"
                          className="flex-1 min-w-[120px] outline-none"
                        />
                      </div>

                      {errors.author && ( <p className="text-red-500 text-sm">{errors.author}</p> )}
                    </div>


    
                    <div className="w-1/2">
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
      
              <Re_PublicationSlider 
                editable={true}
                publications={publications}
                onEdit={handleEditFromCard}
                onDelete={handleDeleteFromCard}
              />
    
            </div>
    </div>
  )
}
=======

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
                image: "",
                title: pub.title,
                date: pub.year?.toString() || '',
                description: pub.description || '',
                author: pub.coauthor || [],
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
            alert('Veuillez vous reconnecter');
            return;
        }

        if (authors.length === 0) {
            alert('Au moins un auteur est requis');
            return;
        }

        const body = {
            profile_id: 1,
            year: parseInt(form.date.split('-')[0]),
            title: form.title,
            coauthor: authors,
            journal: "Journal",
            doi: "10.1234/test.2024.001",
            description: form.description
        };

        try {
            const response = await fetch(API_ENDPOINTS.publications, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                await refreshPublications();
                resetForm();
                setAuthors([]);
                alert('Publication créée avec succès !');
            } else {
                const error = await response.json();
                alert(`Erreur: ${error.detail || 'Création échouée'}`);
            }
        } catch (error) {
            console.error('Erreur création publication:', error);
            alert('Erreur lors de la création');
        }
    };

    // UPDATE
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
            coauthor: authors,
            description: form.description
        };

        try {
            const response = await fetch(`${API_ENDPOINTS.publications}${form.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                await refreshPublications();
                resetForm();
                setAuthors([]);
                alert('Publication modifiée avec succès !');
            } else {
                alert('Erreur lors de la modification');
            }
        } catch (error) {
            console.error('Erreur modification publication:', error);
            alert('Erreur lors de la modification');
        }
    };

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
        setAuthors([]);
        setErrors({
            title: "",
            date: "",
            description: "",
            link: ""
        });
    };

    const handleEditFromCard = (pub: any) => {
        setForm({
            id: pub.id,
            image: pub.image || "",
            title: pub.title,
            date: pub.date,
            description: pub.description,
            link: pub.link
        });
        setAuthors(pub.author || []);
    };

    const handleDeleteFromCard = async (id: number) => {
        if (!confirm('Supprimer cette publication ?')) return;
        
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Veuillez vous reconnecter');
            return;
        }

        try {
            const response = await fetch(`${API_ENDPOINTS.publications}${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                await refreshPublications();
                if (form.id === id) resetForm();
                alert('Publication supprimée !');
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Erreur suppression:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const validate = () => {
        const newErrors: any = {};
        if (!form.title.trim()) newErrors.title = "Title is required";
        if (!form.date.trim()) newErrors.date = "Date is required";
        if (!form.description.trim()) newErrors.description = "Description is required";
        if (!form.link.trim()) newErrors.link = "Link is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    if (loading) {
        return <div className="text-center py-20">Chargement des publications...</div>;
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
                                placeholder="Add author & press Enter"
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
                                Add
                            </button>
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
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
