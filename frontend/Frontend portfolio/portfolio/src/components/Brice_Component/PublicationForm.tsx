"use client";

import { useState } from "react";

export default function PublicationForm() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [author] = useState("Ekwoge Junior");
  const [publishedOn, setPublishedOn] = useState("");
  const [link, setLink] = useState("");

  return (
    <div className="bg-white shadow-lg rounded-xl p-5 border border-gray-200  w-[500px]">

      <h2 className="text-base font-semibold text-gray-700 mb-4">
        Publication
      </h2>

      <input
        className="w-full border-b border-gray-300 py-1 mb-4 outline-none text-sm"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border border-gray-300 rounded-lg h-32 p-2 text-sm mb-4 outline-none"
        placeholder="Description..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Author</p>
          <div className="w-full border-b border-gray-300 py-1">
            <span className="bg-blue-100 px-2 py-0.5 text-xs rounded-full text-blue-700">
              {author}
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Published on</p>
          <input
            type="date"
            className="w-full border-b border-gray-300 py-1 outline-none text-xs"
            value={publishedOn}
            onChange={(e) => setPublishedOn(e.target.value)}
          />
        </div>
      </div>

      <input
        className="w-full border-b border-gray-300 py-1 mt-4 outline-none text-sm"
        placeholder="Link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      <div className="flex justify-center text-center gap-3 mt-6">
        <button className="px-4 py-1.5 border rounded-full text-gray-700 text-sm">
          Cancel
        </button>
        <button className="px-5 py-1.5 bg-[#003F7F] text-white rounded-full text-sm">
          CREATE
        </button>
      </div>
    </div>
  );
}
