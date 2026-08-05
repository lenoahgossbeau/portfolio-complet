import React from "react";
import Image from "next/image";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { API_BASE_URL } from "@/lib/api";

interface PublicationCardProps {
  editable?: boolean;
  data: {
    id: number;
    image?: string;
    date: string;
    title: string;
    description: string;
    author: string[];
    journal?: string;
    doi?: string;
    link: string;
  };
  onEdit?: (data: any) => void;
  onDelete?: (id: number) => void;
}

export default function PublicationCard({
  editable = false,
  data,
  onEdit,
  onDelete,
}: PublicationCardProps) {
  const imageSrc =
    data.image && data.image.trim() !== ""
      ? `${API_BASE_URL}${data.image}`
      : "/favicon.ico";

  return (
    <div
      onClick={() => onEdit ? onEdit(data) : null}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 transition hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    >

      {/* IMAGE */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={data.title}
          fill
          className="object-cover object-center transition-transform duration-300 hover:scale-105"
          unoptimized
        />

        {/* YEAR */}
        <span className="absolute top-0 right-0 bg-[#003F7F] text-white px-4 py-2 rounded-bl-xl font-semibold">
          {data.date}
        </span>

        {/* ACTIONS */}
        {editable && (
          <div className="absolute top-14 right-0 bg-white rounded-l-xl shadow-md flex flex-col overflow-hidden">

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(data);
              }}
              className="p-3 hover:bg-gray-100 transition"
            >
              <FiEdit2 />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(data.id);
              }}
              className="p-3 hover:bg-red-100 text-red-600 transition"
            >
              <FiTrash2 />
            </button>

          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5">

        <h3 className="font-bold text-lg text-gray-900 leading-6 line-clamp-2 min-h-[3rem]">
          {data.title}
        </h3>

        <p className="mt-3 text-sm text-gray-500 italic leading-6 line-clamp-3 min-h-[4.5rem]">
          {data.description}
        </p>

        <div className="mt-5 border-t pt-4 text-sm text-gray-700 space-y-2">

          <p>
            <span className="text-gray-500 font-medium">Author</span>{" "}
            {data.author.join(", ")}
          </p>

          {data.journal && (
            <p>
              <span className="text-gray-500 font-medium">Journal</span>{" "}
              {data.journal}
            </p>
          )}

          {data.doi && (
            <div>
              <span className="text-gray-500 font-medium">DOI</span>

              <a
                href={data.doi}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-blue-600 hover:underline"
                title={data.doi}
              >
                {data.doi}
              </a>
            </div>
          )}

          {data.link && (
            <a
              href={data.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center mt-4 px-4 py-2 rounded-lg bg-[#003F7F] text-white text-sm font-medium hover:bg-[#0051a8] transition"
            >
              Voir la publication
            </a>
          )}

        </div>

      </div>

    </div>
  );
}