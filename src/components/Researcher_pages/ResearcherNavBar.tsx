'use client';

import React, { useEffect, useState, useRef } from 'react';
import { TfiWorld } from "react-icons/tfi";
import { FaChevronDown } from "react-icons/fa6";
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

const sections = ["dashboard"];

export default function Navbar({ admin = false }: { admin?: boolean }) {
  const { language, setLanguage } = useLanguage();

  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  // Ombre de la navbar pendant le scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Détection de la section active
  useEffect(() => {
    const handleActiveSection = () => {
      let current = "home";

      sections.forEach((section) => {
        const el = document.getElementById(section);

        if (!el) return;

        const rect = el.getBoundingClientRect();

        if (rect.top <= window.innerHeight / 2) {
          current = section;
        }
      });

      setActive(current);
    };

    handleActiveSection();

    window.addEventListener("scroll", handleActiveSection);
    window.addEventListener("resize", handleActiveSection);

    return () => {
      window.removeEventListener("scroll", handleActiveSection);
      window.removeEventListener("resize", handleActiveSection);
    };
  }, []);

  // Fermer le menu de langue lorsqu'on clique à l'extérieur
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setLangOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 bg-white transition-shadow ${
        scrolled ? "shadow-md" : ""
      } border-b border-[#ADADAD]`}
    >
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 text-sm ${
          admin ? "h-18" : ""
        }`}
      >
        {/* LEFT */}
        {!admin && (
          <div>
            <div className="font-semibold text-lg text-[#5F5F5F]">
              Ekwoge Junior
            </div>

            <div className="font-light text-[#AAAAAA]">
              {t('software_engineer', language)}
            </div>
          </div>
        )}

        {admin && (
          <div>
            <div className="font-semibold text-lg text-[#5F5F5F]">
              Inchtech Admin
            </div>
          </div>
        )}

        {/* DESKTOP LINKS */}
        <div className="flex">
          {sections.map((item) => (
            <a
              key={item}
              className={`relative hover:text-[#363636] transition ${
                active === item
                  ? "text-black font-medium"
                  : "text-[#5F5F5F]"
              }`}
            >
              {active === item && (
                <span className="absolute -left-3 top-[7px] w-[7px] h-[7px] bg-[#8A9DB4] rounded-full" />
              )}

              {t('dashboard', language)}
            </a>
          ))}
        </div>

        {/* LANGUAGE DROPDOWN */}
        <div ref={menuRef} className="relative block">
          <button
            type="button"
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1 hover:text-[#363636] cursor-pointer"
          >
            <TfiWorld className="text-[#5F5F5F]" />

            <span className="text-[#5F5F5F]">
              {language.toUpperCase()}
            </span>

            <FaChevronDown className="text-xs text-[#5F5F5F]" />
          </button>

          {langOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden z-50">
              {["en", "fr"].map((lang) => (
                <button
                  type="button"
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}