"use client"
import Slider from "react-slick";
import { useState, useRef, useEffect } from "react";
import ProjectCard from "@/components/ProjectCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { title } from "process";

function NextArrow({ onClick, show }: any) {
  if (!show) return null;
  return (
    <button
      onClick={onClick}
      className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 hover:bg-gray-100 transition"
    >
      <FaChevronRight />
    </button>
  );
}

function PrevArrow({ onClick, show }: any) {
  if (!show) return null;
  return (
    <button
      onClick={onClick}
      className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 hover:bg-gray-100 transition"
    >
      <FaChevronLeft />
    </button>
  );
}

export default function Re_ProjectSlider({
  editable = false,
  projects = [],
  onEdit,
  onDelete
}: {
  editable?: boolean;
  projects: any[];
  onEdit?: (data: any) => void;
  onDelete?: (id: number) => void;
}) {

  const sliderRef = useRef<any>(null);

  const [viewAll, setViewAll] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);

  const totalSlides = projects.length;
  const maxSlideIndex = Math.max(0, totalSlides - slidesToShow);

/** 
  useEffect(() => {
    const handleResize = () => {
      if (!sliderRef.current) return;

      const width = window.innerWidth;
      let newSlidesToShow = 3;

      if (width < 640) newSlidesToShow = 1;
      else if (width < 1024) newSlidesToShow = 2;

      setSlidesToShow(newSlidesToShow);

      const maxIndex = Math.max(0, totalSlides - newSlidesToShow);

      if (currentSlide > maxIndex) {
        sliderRef.current.slickGoTo(maxIndex, true);
        setCurrentSlide(maxIndex);
      }

      sliderRef.current.innerSlider.onWindowResized();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentSlide, totalSlides]);
*/

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    arrows: !viewAll,

    beforeChange: (_: number, next: number) => setCurrentSlide(next),

    nextArrow: <NextArrow show={currentSlide < maxSlideIndex} />,
    prevArrow: <PrevArrow show={currentSlide > 0} />,

    swipe: true,
    draggable: true,
    swipeToSlide: true
  };

  return (
    <div className="max-w-md mx-auto px-6 relative">

      {!viewAll ? (
        <Slider ref={sliderRef} {...settings}>
          {projects.map((proj) => (
            <div key={proj.id} className="px-2">
              <ProjectCard 
                editable = {editable}
                data = {proj}
                onEdit = {onEdit}
                onDelete = {onDelete}
              />
            </div>
          ))}
        </Slider>
      ) : (
        <div className="grid grid-cols-1 gap-8 overflow-y-auto scrollbar-hide max-h-[520px] px-2 py-14">
          {projects.map((proj) => (
            <ProjectCard 
              key={proj.id} 
              editable = {editable}
              data = {proj}
              onEdit = {onEdit}
              onDelete = {onDelete}
            />
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => {
            setViewAll(!viewAll)
            
            // Reset arrow logic
            setCurrentSlide(0);
          }}
          className="cursor-pointer px-4 py-3 bg-[#003F7F] text-white rounded-2xl hover:bg-[#004F9F] transition"
        >
          {viewAll ? "Show Less" : "View All "}
        </button>
      </div>
    </div>
  );
}
