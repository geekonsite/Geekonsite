import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  name: string;
  business: string;
  rating: number;
  text: string;
}

interface Carousel3DProps {
  items: Testimonial[];
}

export const Carousel3D: React.FC<Carousel3DProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    setActiveIndex((index + items.length) % items.length);
  }, [items.length]);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [isPaused, goNext]);

  const getItemState = (index: number): string => {
    const diff = index - activeIndex;
    if (diff === 0) return 'active';
    if (diff === -1 || (activeIndex === 0 && index === items.length - 1)) return 'prev';
    if (diff === 1 || (activeIndex === items.length - 1 && index === 0)) return 'next';
    if (diff < -1) return 'hidden-left';
    return 'hidden-right';
  };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Desktop: 3D Carousel */}
      <div className="hidden md:block carousel-container h-96">
        <div className="carousel-track relative w-full h-full">
          {items.map((item, index) => (
            <div
              key={index}
              className={`carousel-item w-80 h-64`}
            >
              <div className="w-full h-full bg-white rounded-xl shadow-depth border border-gray-100 p-6 flex flex-col">
                <div className="flex items-center mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 flex-1 relative">
                  <span className="absolute -top-2 -left-1 text-5xl text-blue-100 font-serif leading-none select-none">&ldquo;</span>
                  <span className="pl-3 block">{item.text}</span>
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.business}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile: Simple scroll */}
      <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[85%] snap-center bg-white rounded-xl shadow-depth border border-gray-100 p-5"
          >
            <div className="flex items-center mb-3">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-700 text-sm mb-4">{item.text}</p>
            <div>
              <div className="font-semibold text-gray-900">{item.name}</div>
              <div className="text-xs text-gray-600">{item.business}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'bg-blue-600 w-6'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
