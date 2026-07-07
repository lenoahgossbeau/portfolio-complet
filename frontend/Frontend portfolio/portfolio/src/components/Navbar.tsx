'use client';
import React, { useEffect, useState, useRef } from 'react';
import { TfiWorld } from "react-icons/tfi";
import { FaChevronDown } from "react-icons/fa6";
import Hamburger from 'hamburger-react';
import { useRouter } from 'next/navigation';
<<<<<<< HEAD
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
import { API_BASE_URL } from '@/lib/api';
=======
import Link from 'next/link';
import { API_ENDPOINTS, API_BASE_URL } from '@/lib/api';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066

const sections = ["home", "project", "publication", "resume", "about"];

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
<<<<<<< HEAD
  const { language, changeLanguage } = useLanguage();

  const menuRef = useRef<HTMLDivElement | null>(null);

  // Vérifier si l'utilisateur est connecté
=======
  
  const { language, setLanguage } = useLanguage();
  const menuRef = useRef<HTMLDivElement | null>(null);

>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

<<<<<<< HEAD
  // Sticky shadow on scroll
=======
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

<<<<<<< HEAD
  // Active link indicator
=======
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
  useEffect(() => {
    const handleActiveSection = () => {
        let current = "home";

        sections.forEach(section => {
            const el = document.getElementById(section);
            if (!el) return;

            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2) {
                current = section;
            }
        });

        setActive(current);
    }

    handleActiveSection();

    window.addEventListener("scroll", handleActiveSection);
    window.addEventListener("resize", handleActiveSection);

    return () => {
        window.removeEventListener("scroll", handleActiveSection);
        window.removeEventListener("resize", handleActiveSection);
    };
  }, []);

  const closeMenu = () => setOpen(false);

<<<<<<< HEAD
  // Fermer le menu hamburger quand on clique en dehors
=======
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

<<<<<<< HEAD
  // Déconnexion
=======
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
<<<<<<< HEAD
        await fetch(`${API_BASE_URL}/auth/logout`, {
=======
        await fetch(API_ENDPOINTS.logout, {
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsLoggedIn(false);
      router.push('/');
    }
  };

<<<<<<< HEAD
  // Changement de langue
  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
    setLangOpen(false);
  };

=======
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setLangOpen(false);
  };

  const navLinks = [
    { href: "/", label: "nav_home", section: "home" },
    { href: "/#project", label: "nav_project", section: "project" },
    { href: "/#publication", label: "nav_publication", section: "publication" },
    { href: "/#resume", label: "nav_resume", section: "resume" },
    { href: "/#about", label: "nav_about_me", section: "about" },
  ];

>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
  return (
    <nav className={`sticky top-0 z-50 bg-white transition-shadow ${
      scrolled ? "shadow-md" : ""
    } border-b border-[#ADADAD]`}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 text-sm">

<<<<<<< HEAD
        {/* LEFT */}
=======
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
        <div>
          <div className="font-semibold text-lg text-[#5F5F5F]">Ekwoge Junior</div>
          <div className="font-light text-[#AAAAAA]">{t('software_engineer', language)}</div>
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-8">
<<<<<<< HEAD
          {sections.map(item => (
            <a
              key={item}
              href={`#${item}`}
              className={`relative hover:text-[#363636] transition ${
                active === item ? "text-black font-medium" : "text-[#5F5F5F]"
              }`}
            >
              {active === item && (
                <span className="absolute -left-3 top-[7px] w-[7px] h-[7px] bg-[#8A9DB4] rounded-full" />
              )}
              {item === "about" ? t('nav_about_me', language) : t(`nav_${item}`, language)}
            </a>
          ))}
        </div>

        {/* AUTH BUTTON + LANGUAGE DROPDOWN */}
=======
          {navLinks.map((link) => (
            <Link
              key={link.section}
              href={link.href}
              className={`relative hover:text-[#363636] transition ${
                active === link.section ? "text-black font-medium" : "text-[#5F5F5F]"
              }`}
            >
              {active === link.section && (
                <span className="absolute -left-3 top-[7px] w-[7px] h-[7px] bg-[#8A9DB4] rounded-full" />
              )}
              {t(link.label, language)}
            </Link>
          ))}
        </div>

>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-sm"
            >
              {t('logout', language)}
            </button>
          ) : (
<<<<<<< HEAD
            <a
              href="/auth/login"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition text-sm"
            >
              {t('login', language)}
            </a>
=======
            <>
              <Link
                href="/auth/register"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition text-sm"
              >
                {t('register', language)}
              </Link>
              <Link
                href="/auth/login"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition text-sm"
              >
                {t('login', language)}
              </Link>
            </>
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
          )}

          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 hover:text-[#363636] cursor-pointer"
            >
              <TfiWorld className="text-[#5F5F5F]" />
<<<<<<< HEAD
              <span className="text-[#5F5F5F]">{language}</span>
=======
              <span className="text-[#5F5F5F]">{language.toUpperCase()}</span>
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
              <FaChevronDown className='text-xs text-[#5F5F5F]' />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                {["EN", "FR"].map(lang => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

<<<<<<< HEAD
      {/* MOBILE HAMBURGER */}
=======
      {/* MOBILE MENU */}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
      <div ref={menuRef} className='md:hidden'>
        <button className="text-[#5F5F5F] absolute top-3 right-2" aria-label="Toggle Menu">
          <Hamburger size={22} toggled={open} toggle={setOpen} />
        </button>

<<<<<<< HEAD
        {/* MOBILE MENU */}
=======
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
        <div
          className={`overflow-hidden transition-all duration-300 ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col items-center py-6 space-y-4 border-t border-[#ADADAD]">
<<<<<<< HEAD
            {sections.map(item => (
              <li key={item}>
                <a
                  href={`#${item}`}
                  onClick={closeMenu}
                  className={`${active === item ? "font-semibold text-black" : "text-[#5F5F5F]"} hover:text-[#363636]`}
                >
                  {item === "about" ? t('nav_about_me', language) : t(`nav_${item}`, language)}
                </a>
=======
            {navLinks.map((link) => (
              <li key={link.section}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className={`${active === link.section ? "font-semibold text-black" : "text-[#5F5F5F]"} hover:text-[#363636]`}
                >
                  {t(link.label, language)}
                </Link>
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
              </li>
            ))}

            <li>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 hover:text-[#363636] cursor-pointer"
              >
                <TfiWorld className="text-[#5F5F5F]" />
<<<<<<< HEAD
                <span className="text-[#5F5F5F]">{language}</span>
=======
                <span className="text-[#5F5F5F]">{language.toUpperCase()}</span>
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
                <FaChevronDown className='text-xs text-[#5F5F5F]' />
              </button>

              {langOpen && (
                <div className="absolute right-48 flex -mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
                  {["EN", "FR"].map(lang => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </li>

<<<<<<< HEAD
            {/* Mobile Auth Button */}
=======
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
            <li>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition w-full"
                >
                  {t('logout', language)}
                </button>
              ) : (
<<<<<<< HEAD
                <a
                  href="/auth/login"
                  onClick={closeMenu}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition block text-center"
                >
                  {t('login', language)}
                </a>
=======
                <div className="flex flex-col gap-2 w-full">
                  <Link
                    href="/auth/register"
                    onClick={closeMenu}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition block text-center"
                  >
                    {t('register', language)}
                  </Link>
                  <Link
                    href="/auth/login"
                    onClick={closeMenu}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition block text-center"
                  >
                    {t('login', language)}
                  </Link>
                </div>
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}