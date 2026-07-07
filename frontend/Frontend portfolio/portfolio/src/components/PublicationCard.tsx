import React from 'react'
import Image from 'next/image'
import { FiEdit2, FiTrash2 } from "react-icons/fi";


interface PublicationCardProps {
  editable?: boolean; // THIS CONTROLS VISIBILITY
  data: {
    id: number;
    date: string;
    title: string;
    description: string;
    author: string[];
    link: string;
  };
  onEdit?: (data: any) => void  //when edit button is pressed
  onDelete?: (id: number) => void
}


export default function PublicationCard({ editable = false, data, onEdit, onDelete }: PublicationCardProps) {
  return (
  <div  className="relative bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 p-6 ">
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
        {data.title}
      </h3>


      {/* EDIT / DELETE ICONS */}
      {editable && (
        <div className="absolute right-0 top-12 bg-white rounded-bl-xl rounded-tl-xl shadow-md flex flex-col items-center overflow-hidden">
                      
            {/* EDIT */}
          <button onClick={() => onEdit?.(data)} className="cursor-pointer p-2 hover:bg-gray-100 transition">
            <FiEdit2 className="text-gray-600" />
          </button>
    
            {/* DELETE */}
          <button onClick={() => onDelete?.(data.id)} className="cursor-pointer p-2 hover:bg-red-100 transition">
            <FiTrash2 className="text-red-600" />
          </button>
        </div>
      )}


      <p className="text-sm text-gray-600 leading-relaxed italic">
        
        {data.description}
        
      </p>
    </div>

    

    <div className="mt-6 space-y-1 text-sm text-gray-700">
      <p>
        <span className="italic">Author:</span> <strong> {data.author.join(", ")} </strong>
      </p>
      <p>
        <span className="italic">Published:</span> <strong> {data.date} </strong>
      </p>
    </div>
  </div>
  );
} 


<div className='bg-white  rounded-xl shadow-md overflow-hidden max-w-sm'>
        <div className='relative h-[200px] bg-gray-300'>
            <span className='absolute top-0 right-0 bg-[#1F3A5F] text-white text-sm px-3 py-[6px] rounded-bl-xl'>
              Date
            </span>
        </div>

        <div className='p-5'>
          <h3 className='font-semibold text-lg mb-2'>Title</h3>
          <p className='text-gray-600 text-sm leading-relaxed'>
            Description details here A passionate software
            engineer specializing in building modern, 
            responsive, and user-friendly web solutions.
            A passionate software engineer specializing in 
            building modern, responsive, and user-friendly 
            web solutions.
          </p>
        </div>
    </div>
