'use client'
import React, { useEffect, useState } from "react";
import Resume from "@/sections/Resume";
import { FiUpload } from "react-icons/fi";
import PersonalInfoCard from "./PersonalInfoCard";
import ContactCard from "./ContactCard";
import SecurityCard from "./SecurityCard";
import Researcher_Project_Tab_Content from "./Researcher_Project_Tab_Content";
import Researcher_Publication_Tab_Content from "./Researcher_Publication_Tab_Content";
<<<<<<< HEAD

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "resume", label: "Resume" },
  { id: "project", label: "Project" },
  { id: "publication", label: "Publication" },
];


///////////////
=======
import MessagesView from "./MessagesView";
import CVUpload from "./CVUpload"; // ✅ AJOUTÉ
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/lib/api';

const tabs = [
  { id: "profile", label: "profile" },
  { id: "resume", label: "resume_section" },
  { id: "project", label: "project_section" },
  { id: "publication", label: "publication_section" },
  { id: "messages", label: "messages" },
  { id: "payment", label: "payment" },
];

>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
type Props = {
  admin?: boolean;
  mode?: "create" | "edit";
  researcherId?: number;
};
<<<<<<< HEAD
///////////////

//////// type for the profile ///////
=======

>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
type Profile = {
  name: string;
  profession: string;
  about: string;
  avatar: string;
};

type Researcher = Profile & {
  id: number;
};
<<<<<<< HEAD
/////////////////////////////////////


=======
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066

const MOCK_ACCOUNTS = [
  {
    id: 1,
    name: "Ekwoge Junior",
    profession: "Data Engineer",
    about: "I'm a nonprofit organization...",
    avatar: "",
  },
  {
    id: 2,
    name: "Jane Smith",
    profession: "Data Engineer",
    about: "I'm a nonprofit organization...",
    avatar: "",
  },
];

<<<<<<< HEAD

/////////////////// Data for empty fields ( default values ) ////////////////

=======
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
const EMPTY_PROFILE: Profile = {
  name: "",
  profession: "",
  about: "",
  avatar: "",
};

<<<<<<< HEAD




=======
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
const ResearcherDashboard: React.FC<Props> = ({ 
  admin = false,
  mode = "create",
  researcherId,
}) => {
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState<string>("profile");

///////////////////////////////
  const [profile, setProfile] = useState<Researcher | null>(null);


  //////////////// when creating //////////////
=======
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [profile, setProfile] = useState<Researcher | null>(null);
  
  // États pour le paiement
  const [operator, setOperator] = useState('orange');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState(1000);
  const [processing, setProcessing] = useState(false);

>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
  useEffect(() => {
    if (mode === "create") {
      setProfile({ id: Date.now(), ...EMPTY_PROFILE });
    }
  }, [mode]);

<<<<<<< HEAD


  /////////////// when editing //////////
  useEffect(() => {
    if (mode === "edit" && researcherId) {
      // TEMP: fake fetch (later replace with API)
      const found = MOCK_ACCOUNTS.find(
        (r) => r.id === Number(researcherId)
      );

=======
  useEffect(() => {
    if (mode === "edit" && researcherId) {
      const found = MOCK_ACCOUNTS.find(
        (r) => r.id === Number(researcherId)
      );
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
      if (found) setProfile(found);
    }
  }, [mode, researcherId]);

<<<<<<< HEAD
///////////////////////////////





  //////// Tab content /////////
  const renderContent = () => {
    switch (activeTab) {
      case "project":
        return (
          <Researcher_Project_Tab_Content />
        );
          
      case "publication":
        return (
          <Researcher_Publication_Tab_Content />
        );

=======
  // ✅ FONCTION PUBLIER
  const handlePublish = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Vous devez être connecté');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/researcher/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(t('publish_success', language) || '✅ Profil publié avec succès !');
      } else {
        toast.error(data.message || 'Erreur lors de la publication');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur réseau');
    }
  };

  const handlePayment = async () => {
    if (!phone || phone.length !== 9 || !phone.startsWith('6')) {
      toast.error('Numéro invalide (ex: 612345678)');
      return;
    }
    if (amount <= 0) {
      toast.error('Montant invalide');
      return;
    }

    setProcessing(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`${API_BASE_URL}/payment/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ operator, phone, amount })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setPhone('');
        setAmount(1000);
      } else {
        toast.error(data.detail || 'Erreur paiement');
      }
    } catch (error) {
      console.error('Erreur paiement:', error);
      toast.error('Erreur réseau');
    } finally {
      setProcessing(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "project":
        return <Researcher_Project_Tab_Content />;
      case "publication":
        return <Researcher_Publication_Tab_Content />;
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
      case "resume":
        return (
          <div className="mt-[-20px]">
            <Resume editable={true} />
<<<<<<< HEAD
          </div>
        );

      case "profile":
        return (
          <div className="mt-10 text-center text-gray-600 text-lg">

            <div className="flex flex-row gap-5 justify-center">
              
              {profile && (
                <PersonalInfoCard 
                  profile={profile ?? EMPTY_PROFILE } 
                  //onSave={(updated) =>
                    //setProfile((prev) =>
                      //prev ? { ...prev, ...updated } : prev
                    //)
                  //}
                  onSave={(updated) =>
                    setProfile((prev) =>
                      prev
                        ? { ...prev, ...updated } // edit existing
                        : { id: Date.now(), ...updated } // create new
                    )
                  }
                />
              )}
             

              <div className="flex flex-col gap-5">
                <ContactCard />
                <SecurityCard />
              </div>
            </div>

          </div>
        );

=======
            {/* ✅ AJOUT DU COMPOSANT UPLOAD CV */}
            <div className="mt-6">
              <CVUpload />
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="mt-10 text-center text-gray-600 text-lg">
            <PersonalInfoCard />
          </div>
        );
      case "messages":
        return <MessagesView />;
      case "payment":
        return (
          <div className="mt-10 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">{t('payment_title', language) || 'Paiement Mobile Money'}</h2>
            <div className="space-y-4">
              <select 
                value={operator} 
                onChange={(e) => setOperator(e.target.value)} 
                className="w-full border p-2 rounded"
              >
                <option value="orange">Orange Money</option>
                <option value="mtn">MTN Mobile Money</option>
              </select>
              <input
                type="tel"
                placeholder={t('phone_placeholder', language) || 'Numéro (ex: 612345678)'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                placeholder={t('amount_placeholder', language) || 'Montant (XAF)'}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full border p-2 rounded"
              />
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {processing ? (t('processing', language) || 'Paiement en cours...') : (t('pay', language) || 'Payer')}
              </button>
            </div>
          </div>
        );
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-10 py-6">
<<<<<<< HEAD

      <div className="flex justify-between items-center w-full  h-13">
          {/* Tabs */}
          <div className="flex gap-0 p-2 rounded-full h-13 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center text-sm gap-2 px-6 py-2 rounded-full transition-all ${
                  activeTab === tab.id
                    ? "bg-[#E6EEF7] text-[#474747]"
                    : "text-[#A8A8A8] hover:bg-gray-200/30"
                }`}
              >
                {tab.label}
              </button>
            ))}

          </div>
            {/** Admin publish Button */}
            {admin && mode === "create" && (
                <button 
                  onClick={()=> alert("Published")}
                  className="cursor-pointer flex p-2 text-sm px-3 rounded-lg  gap-2 items-center bg-[#003F7F] text-white"
                >
                  <FiUpload size={17}/> 
                  Publish
                  
                </button>
            )}
      </div>
      

      {/* Content */}
=======
      <div className="flex justify-between items-center w-full h-13">
        <div className="flex gap-0 p-2 rounded-full h-13 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center text-sm gap-2 px-6 py-2 rounded-full transition-all ${
                activeTab === tab.id
                  ? "bg-[#E6EEF7] text-[#474747]"
                  : "text-[#A8A8A8] hover:bg-gray-200/30"
              }`}
            >
              {t(tab.label, language)}
            </button>
          ))}
        </div>
        
        {admin && mode === "create" && (
          <button 
            onClick={handlePublish}
            className="cursor-pointer flex p-2 text-sm px-3 rounded-lg gap-2 items-center bg-[#003F7F] text-white"
          >
            <FiUpload size={17}/> 
            {t('publish', language)}
          </button>
        )}
      </div>

>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
      {renderContent()}
    </div>
  );
};

export default ResearcherDashboard;