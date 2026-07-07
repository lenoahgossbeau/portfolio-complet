import { useState } from "react";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import EditContactInfoModal from "./editContactInfoModal";
<<<<<<< HEAD



export default function ContactCard() {



  ///////////////// Temporal Backend //////////////////
  const [contact, setContact] = useState({
    gmail: "ekwogejunior@gmail.com",
    linkedIn: "https://www.linkedin.com/in/ekwoge",
    whatsapp: "https://wa.me/627151221212",
    x: "https://x.com/username",
    github: "https://github.com/username",
  });




  //////////// State to control modal open/close ////////
  const [isEditing, setIsEditing] = useState(false);



=======
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

type Profile = {
  name: string;
  profession: string;
  about: string;
  avatar: string;
  email: string;
  linkedin: string;
  whatsapp: string;
  twitter: string;
  github: string;
};

type Props = {
  profile: Profile;
  onSave: (updatedProfile: Profile) => void;
};

export default function ContactCard({ profile, onSave }: Props) {
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  const contact = {
    gmail: profile.email || "",
    linkedIn: profile.linkedin || "",
    whatsapp: profile.whatsapp || "",
    x: profile.twitter || "",
    github: profile.github || "",
  };

  const handleSave = (updatedContact: any) => {
    const updatedProfile = {
      ...profile,
      email: updatedContact.gmail,
      linkedin: updatedContact.linkedIn,
      whatsapp: updatedContact.whatsapp,
      twitter: updatedContact.x,
      github: updatedContact.github,
    };
    onSave(updatedProfile);
  };
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 h-78">
      <div className="flex justify-between items-start mb-4">
<<<<<<< HEAD
        <h2 className="text-base font-medium text-gray-700">Contact</h2>
        <button  onClick={() => setIsEditing(true) }  className="cursor-pointer text-gray-500 hover:text-gray-700 text-sm">✏️</button>
      </div>



      {/** Incase of editing */}
=======
        <h2 className="text-base font-medium text-gray-700">{t('contact', language)}</h2>
        <button onClick={() => setIsEditing(true)} className="cursor-pointer text-gray-500 hover:text-gray-700 text-sm">✏️</button>
      </div>

>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
      <EditContactInfoModal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        data={contact}
<<<<<<< HEAD
        onSave={setContact}
      />




      <div className="space-y-4 mt-8 text-sm flex flex-col gap-2">
        <div className="flex items-center gap-2">
    
          <MdEmail size={20}/>
          <a className="text-blue-600 hover:underline" href="#">
            {contact.gmail}
          </a>

        </div>

        <div className="flex items-center gap-2">
          
          <FaLinkedin size={20}/>
          <a className="text-blue-600 hover:underline" href="#">
           {contact.linkedIn}
          </a>

        </div>

        <div className="flex items-center gap-2">
        
          <FaWhatsapp size={20}/>
          <a className="text-blue-600 hover:underline" href="#">
           {contact.whatsapp}
          </a>

        </div>

        <div className="flex items-center gap-2">
    
          <FaXTwitter size={20}/>
          <a className="text-blue-600 hover:underline" href="#">
           {contact.x}
          </a>

        </div>

        <div className="flex items-center gap-2">

          <FaGithub size={20}/>
          <a className="text-blue-600 hover:underline" href="#">
           {contact.github}
          </a>

=======
        onSave={handleSave}
      />

      <div className="space-y-4 mt-8 text-sm flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <MdEmail size={20}/>
          {contact.gmail ? (
            <a href={`mailto:${contact.gmail}`} className="text-blue-600 hover:underline break-all">
              {contact.gmail}
            </a>
          ) : (
            <span className="text-gray-400">Email non renseigné</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <FaLinkedin size={20}/>
          {contact.linkedIn ? (
            <a href={contact.linkedIn.startsWith('http') ? contact.linkedIn : `https://${contact.linkedIn}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
              {contact.linkedIn}
            </a>
          ) : (
            <span className="text-gray-400">LinkedIn non renseigné</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <FaWhatsapp size={20}/>
          {contact.whatsapp ? (
            <a href={contact.whatsapp.startsWith('http') ? contact.whatsapp : `https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
              {contact.whatsapp}
            </a>
          ) : (
            <span className="text-gray-400">WhatsApp non renseigné</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <FaXTwitter size={20}/>
          {contact.x ? (
            <a href={contact.x.startsWith('http') ? contact.x : `https://twitter.com/${contact.x}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
              {contact.x}
            </a>
          ) : (
            <span className="text-gray-400">X non renseigné</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <FaGithub size={20}/>
          {contact.github ? (
            <a href={contact.github.startsWith('http') ? contact.github : `https://github.com/${contact.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
              {contact.github}
            </a>
          ) : (
            <span className="text-gray-400">GitHub non renseigné</span>
          )}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
