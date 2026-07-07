'use client'
<<<<<<< HEAD
import Image from "next/image";
=======
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
import profile from '@/assets/profile.png'
import left_shape from '@/assets/left_shape.png'
import blue_shape from '@/assets/blue_circle.png'
import right_l_shape from '@/assets/Ellipse 510.png'
import right_s_shape from '@/assets/Ellipse 508.png'
import line1 from '@/assets/Line 3.png'
import line2 from '@/assets/Line 4.png'
import circle1 from '@/assets/Ellipse 511.png'

<<<<<<< HEAD

=======
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ProjectSlider from "@/components/ProjectSlider";
<<<<<<< HEAD


import Buttons, { ProjectButtons } from "@/components/Buttons";

import ProjectCard from "@/components/ProjectCard";
import { useRef, useState, useEffect } from "react";

import PublicationSlider from "@/components/PublicationSlider";
import Resume from "@/sections/Resume";


import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

import Navbar from "@/components/Navbar";
import { UseLanguage } from "@/hooks/useLanguage";
import { t } from "@/locales/translations";



export default  function Home( {researcher_name="Brice Parfait", about_summary="A passionate software engineer specializing in building modern, responsive, and user-friendly web solutions."} ) {
  
  // Api enpoint attachement 
  /*
  const res = await fetch("api_endpoint", {
    cache: "no-store"  // ensures fresh data
  });

  const profile = await res.json();  // profile.name, profile.summary
  */


  ////////////////////////////////////////////
  //////  PROJECT STATE (TEMP BACKEND)  //////
  ////////////////////////////////////////////
  const [projects, setProjects] = useState<any[]>([
    {
      id: 1,
      image: "",
      title: "Sample Project",
      date: "01-12-2025",
      description: "Description details here A passionate software engineer specializing in building modern, responsive, and user-friendly web solutions. A passionate software engineer specializing in building modern, responsive, and user-friendly web solutions.",
      link: ""
    },
    {
      id: 2,
      image: "",
      title: "Sample Projec",
      date: "01-12-2025",
      description: "Description details here A passionate software engineer specializing in building modern, responsive, and user-friendly web solutions. A passionate software engineer specializing in building modern, responsive, and user-friendly web solutions.",
      link: ""
    },
    {
      id: 3,
      image: "",
      title: "Sample Projec",
      date: "01-12-2025",
      description: "Description details here A passionate software engineer specializing in building modern, responsive, and user-friendly web solutions. A passionate software engineer specializing in building modern, responsive, and user-friendly web solutions.",
      link: ""
    },
    {
      id: 4,
      image: "",
      title: "Sample Pr",
      date: "01-12-2025",
      description: "Description details here A passionate software engineer specializing in building modern, responsive, and user-friendly web solutions. A passionate software engineer specializing in building modern, responsive, and user-friendly web solutions.",
      link: ""
    },
  ]);



  ////////////////////////////////////////////
  //////  PROJECT STATE (TEMP BACKEND)  //////
  ////////////////////////////////////////////
  const [publications, setPublications] = useState<any[]>([
    {
      id: 1,
      title: "Sample Publication",
      author: ["Ekwoge junior", "James"],
      date: "1st November 2025",
      description: "Maximize your tax returns and minimize common errors with our expert guidance. Our system streamlines the entire declaration process, helping you find every eligible deduction and optimize your financial outcomes effortlessly declaration process, helping you find every eligible deduction and optimize your financial outcomes effortlessly declaration process, helping you find every eligible deduction and optimize your financial outcomes effortlessly...",
      link: ""
    },
    {
      id: 2,
      title: "Sample Publication",
      author: ["Ekwoge junior"],
      date: "1st November 2025",
      description: "Maximize your tax returns and minimize common errors with our expert guidance. Our system streamlines the entire declaration process, helping you find every eligible deduction and optimize your financial outcomes effortlessly declaration process, helping you find every eligible deduction and optimize your financial outcomes effortlessly declaration process, helping you find every eligible deduction and optimize your financial outcomes effortlessly...",
      link: ""
    },
    {
      id: 3,
      title: "Sample Publication",
      author: ["Ekwoge junior", "James"],
      date: "1st November 2025",
      description: "Maximize your tax returns and minimize common errors with our expert guidance. Our system streamlines the entire declaration process, helping you find every eligible deduction and optimize your financial outcomes effortlessly declaration process, helping you find every eligible deduction and optimize your financial outcomes effortlessly declaration process, helping you find every eligible deduction and optimize your financial outcomes effortlessly...",
      link: ""
    },
    {
      id: 4,
      title: "Sample Publication",
      author: ["Ekwoge junior", "James"],
      date: "1st November 2025",
      description: "Maximize your tax returns and minimize common errors with our expert guidance. Our system streamlines the entire declaration process, helping you find every eligible deduction and optimize your financial outcomes effortlessly declaration process, helping you find every eligible deduction and optimize your financial outcomes effortlessly declaration process, helping you find every eligible deduction and optimize your financial outcomes effortlessly...",
      link: ""
    },
    {
      id: 5,
      title: "Fifth",
      author: ["me"],
      date: "32323 323 ",
      description: "wwwwewe",
      link: ""
    },
  ]);



  const horizontalSettings = {
    arrows: false,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
    {
    breakpoint: 1024,
    settings: "unslick" // disables slider on small screens (normal stacked layout)
    }
    ]
    };

    
=======
import Buttons from "@/components/Buttons";
import PublicationSlider from "@/components/PublicationSlider";
import Resume from "@/sections/Resume";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import Navbar from "@/components/Navbar";

// Import API services
import { fetchProjects, fetchPublications } from '@/lib/apiService';
import { t } from '@/locales/translations';
import { useLanguage } from '@/hooks/useLanguage';

export default function Home() {

  const { language } = useLanguage();
  const researcher_name = "Brice Parfait";

  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [publications, setPublications] = useState<any[]>([]);
  const [loadingPublications, setLoadingPublications] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoadingProjects(false);
        return;
      }
      
      try {
        const data = await fetchProjects();
        const formattedProjects = data.map((project: any) => ({
          id: project.id,
          title: project.title,
          date: project.year?.toString() || '',
          description: project.description || '',
          coauthor: project.coauthor || [],
          link: `/projects/${project.id}`
        }));
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Erreur chargement projets:', error);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, []);

  useEffect(() => {
    async function loadPublications() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoadingPublications(false);
        return;
      }
      
      try {
        const data = await fetchPublications();
        const formattedPublications = data.map((pub: any) => ({
          id: pub.id,
          title: pub.title,
          author: pub.coauthor || [],
          date: pub.year?.toString() || '',
          description: pub.description || '',
          link: `/publications/${pub.id}`
        }));
        setPublications(formattedPublications);
      } catch (error) {
        console.error('Erreur chargement publications:', error);
      } finally {
        setLoadingPublications(false);
      }
    }
    loadPublications();
  }, []);
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066

  return (
    <main className="scroll-smooth">

      <Navbar />

<<<<<<< HEAD
      {/* Home section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden flex-col-reverse  lg:flex-row lg:justify-between">

        {/* Left text area */}
        <div className="z-10  max-w-md md:max-w-lg lg:max-w-xl   mt-8 md:mt-6 lg:mt-0  text-center   lg:text-left lg:ml-28">
          <h1 className="lg:w-145 md:w-125   font-bold text-gray-900 text-3xl lg:text-5xl md:text-4xl">
            Hello, I'm {researcher_name} {researcher_name}
          </h1>

          <p className="mt-3 lg:text-lg md:text-md text-md text-gray-700">
            { about_summary }
            { about_summary }
          </p>

          <div className="flex justify-center lg:justify-start">
            <Buttons />
          </div>
        </div>

        {/* Right profile image */}
        <div className="relative lg:absolute lg:bottom-0 lg:right-0">
          <Image 
            src={profile} 
            alt="profile" 
            className="relative  mt-1 md:mt-1 w-[330px] md:w-[350px]  z-10  lg:w-[550px]  lg:right-2  "
            priority
          />

          {/* Black line 1 */}
          <Image
            src={line1}
            alt="line1"
            className="absolute  lg:-top-6 md:top-0 top-1  lg:right-28 md:right-18 right-17  rotate-10   lg:w-[300px] md:w-[175px] w-[150px] opacity-80 z-9"
          />

          {/* Black line 2 */}
          <Image
            src={line2}
            alt="line2"
            className="absolute  lg:top-30 md:top-18 top-18  lg:right-18 md:right-6 right-6  rotate-10  lg:w-[300px] md:w-[158px] w-[150px] opacity-80 z-9"
          />

          {/* Circle 1 */}
=======
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden flex-col-reverse  lg:flex-row lg:justify-between">

        <div className="z-10 max-w-md md:max-w-lg lg:max-w-xl mt-8 md:mt-6 lg:mt-0 text-center lg:text-left lg:ml-28">
          <h1 className="lg:w-145 md:w-125 font-bold text-gray-900 text-3xl lg:text-5xl md:text-4xl">
            {t('hello_title', language)} {researcher_name}
          </h1>

          <p className="mt-3 lg:text-lg md:text-md text-md text-gray-700">
            {t('about_summary', language)}
          </p>

          {/* ✅ DEUX BOUTONS SUR LA MÊME LIGNE */}
          <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <Buttons />
            <Link
              href="/researchers"
              className="bg-[#002754] text-white px-6 py-3 rounded-xl shadow-md hover:bg-[#001B40] transition whitespace-nowrap"
            >
              {t('browse_researchers', language)}
            </Link>
          </div>
        </div>

        <div className="relative lg:absolute lg:bottom-0 lg:right-0">
          <Image
            src={profile}
            alt="profile"
            className="relative mt-1 md:mt-1 w-[330px] md:w-[350px] z-10 lg:w-[550px] lg:right-2"
            priority
          />

          <Image
            src={line1}
            alt="line1"
            className="absolute lg:-top-6 md:top-0 top-1 lg:right-28 md:right-18 right-17 rotate-10 lg:w-[300px] md:w-[175px] w-[150px] opacity-80 z-9"
          />

          <Image
            src={line2}
            alt="line2"
            className="absolute lg:top-30 md:top-18 top-18 lg:right-18 md:right-6 right-6 rotate-10 lg:w-[300px] md:w-[158px] w-[150px] opacity-80 z-9"
          />

>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
          <Image
            src={circle1}
            alt="circle1"
            className="absolute top-85 right-215 w-[40px] h-[40px] opacity-50"
          />

<<<<<<< HEAD
          {/* Circle 2 */}
=======
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
          <Image
            src={circle1}
            alt="circle1"
            className="absolute top-115 right-190 w-[30px] h-[30px] opacity-50"
          />

<<<<<<< HEAD
          {/* Background big shape */}
          <Image
            src={right_l_shape}
            alt="right_l_shape"
            className="absolute top-8  opacity-60  right-5  w-[0px]  lg:w-[370px] lg:h-[500px] "
          />
          
          {/* Background small shape */}
          <Image
            src={right_s_shape}
            alt="right_s_shape"
            className="absolute  lg:-top-4 top-4 lg:w-[190px] md:w-[180px] w-[160px]  -rotate-0 md:-rotate-0 lg:-rotate-0  right-30 md:right-30 lg:right-65  opacity-60"
          />

           {/* Background blue shape */}
         <Image
            src={blue_shape}
            alt="blue_shape"
            className="absolute lg:bottom-0 md:bottom-0 bottom-0   lg:w-[200px] md:w-[190px] w-[160px]  lg:right-0  -right-4  opacity-80  lg:right-105 "
          />
          
        </div>



        {/* Left big background shape */}
        <Image
          src={left_shape}
          alt="left_shape"
          className="absolute left-0 top-0  h-[700px] md:h-[670px] lg:h-[640px]  w-[370px] md:w-[370px] lg:w-[370px] opacity-90"
        />



      </section>

      
      {/* Project section */}
      <section id="project" className="min-h-screen py-10 relative">
        <h2 className="text-center text-3xl text-gray-700 tracking-[5px] mb-8">
          Project
        </h2>
        

        <ProjectSlider
          projects={projects}
        />
        
      </section>



      {/* Publication section */}
      <section id="publication" className="min-h-screen py-10 relative">
        <h2 className="text-center text-3xl text-gray-700 tracking-[5px] mb-8">
          Publication
        </h2>

        <PublicationSlider 
          publications={publications}
        />
      </section>


      {/* Resume section */}
      <section>
        <Resume editable={false}  />
      </section>
      
      

      {/* About-me section */}
      <section id="about" className="min-h-screen py-10 relative">
        <h2 className="text-center text-3xl text-gray-700 tracking-[5px] mb-8">
          About me
        </h2>

        {/* Card */}
          <div className="bg-blue-200 shadow-lg rounded-lg p-10 flex flex-col lg:flex-row items-center gap-10 justify-center">
            
            {/* IMAGE AREA */}
            <div className="flex-shrink-0">
              <div className="w-72 h-80 rounded-full overflow-hidden bg-gray-200 shadow-md">
                <Image
                  src={profile}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* TEXT CONTENT */}
            <div className="text-center lg:text-left max-w-2xl">
              <h3 className="text-3xl text-gray-800 mb-4">
                Hi, i’m <span className="font-semibold">Ekwoge Junior</span>
              </h3>

              <p className="text-gray-600 leading-relaxed mb-6">
                I am a software engineer passionate about building impactful digital 
                solutions. I focus on clean architecture, scalable systems, and user-centered
                design to deliver efficient and modern applications. My work combines technical
                excellence with creativity to solve real-world problems.
              </p>

              {/* SOCIAL ICONS */}
              <div className="flex lg:justify-start justify-center gap-8 mt-8">
                <a
                  href="https://github.com/"
                  target="_blank"
                  className="transition-transform duration-300 hover:scale-110          text-gray-600 hover:text-black transition duration-300"
                >
                  <FaGithub size={28} />
                </a>

                <a
                  href="https://x.com/"
                  target="_blank"
                  className="transition-transform duration-300 hover:scale-110          text-gray-600 hover:text-black transition duration-300"
                >
                  <FaXTwitter size={26} />
                </a>

                <a
                  href="https://wa.me/237xxxxxxxxx"
                  target="_blank"
                  className="transition-transform duration-300 hover:scale-110           text-green-500 hover:text-green-600 transition duration-300"
                >
                  <FaWhatsapp size={28} />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  className="transition-transform duration-300 hover:scale-110             text-blue-600 hover:text-blue-700 transition duration-300"
                >
                  <FaLinkedin size={28} />
                </a>

                <a
                  href="mailto:yourmail@gmail.com"
                  className="transition-transform duration-300 hover:scale-110              text-red-500 hover:text-red-600 transition duration-300"
                >
                  <MdEmail size={28} />
                </a>
              </div>     
            </div>
          </div>

      </section>

     

    </main>
  );
}
=======
          <Image
            src={right_l_shape}
            alt="right_l_shape"
            className="absolute top-8 opacity-60 right-5 w-[0px] lg:w-[370px] lg:h-[500px]"
          />

          <Image
            src={right_s_shape}
            alt="right_s_shape"
            className="absolute lg:-top-4 top-4 lg:w-[190px] md:w-[180px] w-[160px] -rotate-0 md:-rotate-0 lg:-rotate-0 right-30 md:right-30 lg:right-65 opacity-60"
          />

          <Image
            src={blue_shape}
            alt="blue_shape"
            className="absolute lg:bottom-0 md:bottom-0 bottom-0 lg:w-[200px] md:w-[190px] w-[160px] lg:right-0 -right-4 opacity-80 lg:right-105"
          />

        </div>

        <Image
          src={left_shape}
          alt="left_shape"
          className="absolute left-0 top-0 h-[700px] md:h-[670px] lg:h-[640px] w-[370px] md:w-[370px] lg:w-[370px] opacity-90"
        />

      </section>

      <section id="project" className="min-h-screen py-10 relative">
        <h2 className="text-center text-3xl text-gray-700 tracking-[5px] mb-8">
          {t('project_section', language)}
        </h2>

        {loadingProjects ? (
          <div className="text-center py-10">{t('loading', language)}</div>
        ) : (
          <ProjectSlider projects={projects} />
        )}
      </section>

      <section id="publication" className="min-h-screen py-10 relative">
        <h2 className="text-center text-3xl text-gray-700 tracking-[5px] mb-8">
          {t('publication_section', language)}
        </h2>

        {loadingPublications ? (
          <div className="text-center py-10">{t('loading', language)}</div>
        ) : (
          <PublicationSlider publications={publications} />
        )}
      </section>

      <section>
        <Resume editable={false} />
      </section>

      <section id="about" className="min-h-screen py-10 relative">
        <h2 className="text-center text-3xl text-gray-700 tracking-[5px] mb-8">
          {t('about_section', language)}
        </h2>

        <div className="bg-blue-200 shadow-lg rounded-lg p-10 flex flex-col lg:flex-row items-center gap-10 justify-center">
          <div className="flex-shrink-0">
            <div className="w-72 h-80 rounded-full overflow-hidden bg-gray-200 shadow-md">
              <Image
                src={profile}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="text-center lg:text-left max-w-2xl">
            <h3 className="text-3xl text-gray-800 mb-4">
              {t('hi_im', language)} <span className="font-semibold">Brice Parfait</span>
            </h3>

            <p className="text-gray-600 leading-relaxed mb-6">
              {t('about_text', language)}
            </p>

            <div className="flex lg:justify-start justify-center gap-8 mt-8">
              <a href="https://github.com/" target="_blank" className="transition-transform duration-300 hover:scale-110 text-gray-600 hover:text-black">
                <FaGithub size={28} />
              </a>
              <a href="https://x.com/" target="_blank" className="transition-transform duration-300 hover:scale-110 text-gray-600 hover:text-black">
                <FaXTwitter size={26} />
              </a>
              <a href="https://wa.me/237xxxxxxxxx" target="_blank" className="transition-transform duration-300 hover:scale-110 text-green-500 hover:text-green-600">
                <FaWhatsapp size={28} />
              </a>
              <a href="https://linkedin.com" target="_blank" className="transition-transform duration-300 hover:scale-110 text-blue-600 hover:text-blue-700">
                <FaLinkedin size={28} />
              </a>
              <a href="mailto:yourmail@gmail.com" className="transition-transform duration-300 hover:scale-110 text-red-500 hover:text-red-600">
                <MdEmail size={28} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
