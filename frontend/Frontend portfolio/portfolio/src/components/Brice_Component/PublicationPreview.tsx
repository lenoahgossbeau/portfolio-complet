"use client";

import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { ArrowRight } from "lucide-react";

export default function PublicationPreview() {
  return (
    <div className="bg-white w-[280px] h-[380px] shadow-xl rounded-xl border border-gray-200 p-4 relative">
      <div className="absolute top-2 right-2 flex gap-2">
        <button>
          <FaPencilAlt size={11} className="text-gray-700" />
        </button>
        <button>
          <FaTrash size={12} className="text-red-500" />
        </button>
      </div>

      <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6 justify-center flex text-center">
        Machine Learning Article
      </h3>

      <p className="text-xs text-gray-700 leading-relaxed mb-4">
        Maximize your tax returns and minimize common errors with our expert
        guidance. Our system streamlines the entire declaration process, helping
        you find every eligible deduction and optimize your financial outcomes
        effortlessly. Maximize your tax returns and minimize common errors with
        our expert guidance. Our system streamlines the entire declaration
        process, helping you find every eligible deduction and optimize your
        financial outcomes effortlessly.
      </p>

      <p className="text-xs">
        <span className="font-medium">Author:</span>{" "}
        <span className="text-gray-900">Ekwoge Junior, Brice</span>
      </p>

      <p className="text-xs mt-1">
        <span className="font-medium">Published:</span>{" "}
        <span className="text-gray-900">1st November 2025</span>
      </p>

      <button
        className="mt-12 px-3 py-1.5 text-[10px] text-white bg-[#003F7F] rounded-lg 
                   mx-auto block flex items-center gap-1 whitespace-nowrap">
        <span>VIEW ALL</span>
        <ArrowRight size={12} />
      </button>
    </div>
  );
}
