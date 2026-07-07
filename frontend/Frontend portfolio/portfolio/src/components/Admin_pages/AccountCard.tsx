import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HiDotsVertical } from "react-icons/hi";
import favicon from "@/app/favicon.ico"
import { useRouter } from "next/navigation";
import ConfirmModal from "../Researcher_pages/ConfirmModal";
<<<<<<< HEAD



=======
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066

type Props = {
  researcher: {
    id: number;
    name: string;
    profession: string;
    email: string;
<<<<<<< HEAD
=======
    status?: string;
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
    avatar?: any;
  };
};

<<<<<<< HEAD


export default function AccountCard({ researcher }: Props) {

  const [open, setOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  



  useEffect(() => {
  function handleClickOutside(e: MouseEvent) {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);




=======
export default function AccountCard({ researcher }: Props) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 relative hover:shadow-md transition">
      
      {/* Status + menu */}
      <div className="flex justify-between items-center">
<<<<<<< HEAD
        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
          Active
=======
        <span className={`px-3 py-1 rounded-full text-xs ${
          researcher.status === 'active' 
            ? 'bg-green-100 text-green-600' 
            : 'bg-red-100 text-red-600'
        }`}>
          {researcher.status === 'active' ? t('active', language) : t('inactive', language)}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
        </span>

        <div ref={menuRef}>
          <HiDotsVertical onClick={() => setOpen(!open)} className="text-gray-500 cursor-pointer text-lg" />

          {open && (
            <div className="absolute right-0 mt-2 w-28 bg-white border rounded-lg shadow-md text-sm z-10">
<<<<<<< HEAD

              {/** Edit reroutes the admin to the reseacher page */}
              <button onClick={() => router.push(`/researcher/dashboard/${researcher.id}`)} 
                className="w-full px-4 py-2 hover:bg-gray-100 text-left">
                Edit
              </button>

              <button  onClick={() => setShowDeleteModal(true)}  
                className="w-full px-4 py-2 hover:bg-gray-100 text-left text-red-500"
              >
                Delete
=======
              <button onClick={() => router.push(`/researcher/dashboard/${researcher.id}`)} 
                className="w-full px-4 py-2 hover:bg-gray-100 text-left">
                {t('edit', language)}
              </button>

              <button onClick={() => setShowDeleteModal(true)}  
                className="w-full px-4 py-2 hover:bg-gray-100 text-left text-red-500"
              >
                {t('delete', language)}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
              </button>

              <ConfirmModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => {
                  setShowDeleteModal(false);
                  console.log("Delete researcher", researcher.id);
<<<<<<< HEAD
                  // call delete API here
                }}
              />


            </div>
          )}

        </div>
      </div>





=======
                }}
              />
            </div>
          )}
        </div>
      </div>

>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
      {/* Profile */}
      <div className="flex flex-col items-center text-center mt-6">
        <Image
          src={researcher.avatar || "/favicon.ico"}
          alt="avatar"
          width={80}
          height={80}
          className="rounded-full object-cover"
        />

        <h3 className="mt-3 font-medium text-sm">
          {researcher.name}
        </h3>

        <p className="text-xs text-gray-500">
          {researcher.profession}
        </p>

        <span className="mt-3 text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
          {researcher.email}
        </span>
      </div>
    </div>
  );
<<<<<<< HEAD
}

=======
}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
