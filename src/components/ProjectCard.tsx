import React from 'react'
import Image from 'next/image'
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import placeholderImage from "@/assets/profile.png"
import { API_BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation"; // ✅ AJOUT IMPORT

interface ProjectCardProps {
  editable?: boolean; // THIS CONTROLS VISIBILITY
  data: {
    id: number;
    image?: string;
    date: string;
    title: string;
    description: string;
    link?: string;
  };
  onEdit?: (data: any) => void  //when edit button is pressed
  onDelete?: (id: number) => void
}

export default function ProjectCard({ editable = false, data, onEdit, onDelete }: ProjectCardProps) {
  const router = useRouter(); // ✅ AJOUT HOOK

  const openProject = () => { // ✅ AJOUT FONCTION
    router.push(`/projects/${data.id}`);
  };

  return (
    <div
      onClick={openProject} // ✅ AJOUT CLIC SUR LA CARTE
      className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 cursor-pointer hover:shadow-xl transition' // ✅ MODIFICATION CLASSE
    >
        <div className='relative h-[200px] bg-gray-300'>
            {/** Image */}
            <Image
              src={
                data.image && data.image.trim() !== ""
                  ? `${API_BASE_URL}${data.image}`
                  : "/favicon.ico"
              }
              alt="project image"
              fill
              className="object-cover"
              unoptimized
            />
            
            {/** Date tag */}
            <span className='absolute top-0 right-0 bg-[#1F3A5F] text-white text-sm px-3 py-[6px] rounded-bl-xl'>
              {data.date}
            </span>

            {/* EDIT / DELETE ICONS */}
            {editable && (
              <div className="absolute right-0 top-12 bg-white rounded-bl-xl rounded-tl-xl shadow-md flex flex-col items-center overflow-hidden">
                  
                  {/* EDIT */}
                <button
                  onClick={(e) => { // ✅ AJOUT stopPropagation
                    e.stopPropagation();
                    onEdit?.(data);
                  }}
                  className="cursor-pointer p-2 hover:bg-gray-100 transition"
                >
                  <FiEdit2 className="text-gray-600" />
                </button>

                  {/* DELETE */}
                <button
                  onClick={(e) => { // ✅ AJOUT stopPropagation
                    e.stopPropagation();
                    onDelete?.(data.id);
                  }}
                  className="cursor-pointer p-2 hover:bg-red-100 transition"
                >
                  <FiTrash2 className="text-red-600" />
                </button>
              </div>
            )}
        </div>

              
        <div className='p-5'>
          <h3 className='font-semibold text-lg mb-2'>{data.title}</h3>
          <p className='text-gray-600 text-sm leading-relaxed'>
            {data.description}
          </p>

          {data.link && (
            <a
              href={data.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} // ✅ AJOUT stopPropagation
              className="inline-block mt-4 text-blue-600 hover:underline"
            >
              Voir le projet
            </a>
          )}
        </div>
    </div>
  );
}