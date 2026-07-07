"use client"
import Slider from "react-slick";
import { useState, useRef, useEffect } from "react";
import PublicationCard from "@/components/PublicationCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/locales/translations';

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

export default function PublicationSlider(
  {
    editable = false,
    publications = [],
    onEdit,
    onDelete
  }: {
    editable?: boolean;
    publications: any[];
    onEdit?: (data: any) => void;
    onDelete?: (id: number) => void;
  }
) {
  const { language } = useLanguage();
  const sliderRef = useRef<any>(null);

  const [viewAll, setViewAll] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  const totalSlides = publications.length;
  const maxSlideIndex = Math.max(0, totalSlides - slidesToShow);

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
    <div className="max-w-7xl mx-auto px-6 relative">

      {!viewAll ? (
        <Slider ref={sliderRef} {...settings}>
          {publications.map((pub) => (
            <div key={pub.id} className="px-2">
              <PublicationCard 
                editable = {editable}
                data = {pub}
                onEdit = {onEdit}
                onDelete = {onDelete}
              />
            </div>
          ))}
        </Slider>
      ) : (
        <div className="flex justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publications.map((pub) => (
            <PublicationCard 
              key={pub.id} 
              editable = {editable}
              data = {pub}
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
            setCurrentSlide(0);
          }}
          className="cursor-pointer px-4 py-3 bg-[#002754] text-white rounded-2xl hover:bg-[#001B40] transition"
        >
          {viewAll ? t('show_less', language) : t('view_all', language)}
        </button>
      </div>
    </div>
  );
}