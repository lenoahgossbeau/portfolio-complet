"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdEmail, MdPublish } from "react-icons/md";
export default function ResearcherTabs() {
  const pathname = usePathname();

  return (
    <div className="w-full flex items-center justify-between mt-6 mb-10">

      {/* LEFT SECTION → TABS */}
      <div className="flex items-center gap-4">
        {/* PROJECT */}
        <Link href="/dashboard/researcher/project">
          <div
            className={`cursor-pointer px-4 py-1 text-sm rounded-[15px] transition
            ${
              pathname === "/dashboard/researcher/project"
                ? "bg-[#E6EEF7] text-[#474747]"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Project
          </div>
        </Link>

        {/* PUBLICATION */}
        <Link href="/dashboard/researcher/publication">
          <div
            className={`cursor-pointer px-4 py-1 text-sm rounded-[15px] transition
            ${
              pathname === "/dashboard/researcher/publication"
                ? "bg-[#E6EEF7] text-[#474747]"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Publication
          </div>
        </Link>

        {/* RESUME */}
        <Link href="/dashboard/researcher/resume">
          <div
            className={`cursor-pointer px-4 py-1 text-sm rounded-[15px] transition
            ${
              pathname === "/dashboard/researcher/resume"
                ? "bg-[#E6EEF7] text-[#474747]"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Resume
          </div>
        </Link>

        {/* PROFILE */}
        <Link href="/dashboard/researcher/profile">
          <div
            className={`cursor-pointer px-4 py-1 text-sm rounded-[15px] transition
            ${
              pathname === "/dashboard/researcher/profile"
                ? "bg-[#E6EEF7] text-[#474747]"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Profile
          </div>
        </Link>
      </div>

      {/* RIGHT SIDE → CREATE BUTTON */}
      <button className="bg-[#003F7F] text-white px-4 py-2 rounded-lg text-sm sm:text-base mr-12 flex items-center gap-2">
        <MdPublish size={14} />Publish
      </button>

    </div>
  );
}
