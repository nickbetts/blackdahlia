"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

type HeroSlide = {
  src: string;
  alt: string;
};

type HeroCarouselProps = {
  slides: HeroSlide[];
};

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 28 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    onSelect();
    emblaApi.on("select", onSelect);

    const interval = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 5500);

    return () => {
      window.clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="heroCarousel">
      <div className="heroCarouselViewport" ref={emblaRef}>
        <div className="heroCarouselTrack">
          {slides.map((slide, index) => (
            <div
              className="heroCarouselSlide"
              key={`${slide.src}-${slide.alt}`}
              data-active={index === selectedIndex ? "true" : "false"}
            >
              <img src={slide.src} alt={slide.alt} loading="eager" />
            </div>
          ))}
        </div>
      </div>

      <div className="heroCarouselOverlay" />

      <div className="heroCarouselControls">
        <button type="button" onClick={scrollPrev} aria-label="Show previous image">
          <ChevronLeft size={18} />
        </button>
        <button type="button" onClick={scrollNext} aria-label="Show next image">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="heroCarouselDots" aria-hidden="true">
        {slides.map((slide, index) => (
          <span
            key={`${slide.src}-dot`}
            className={index === selectedIndex ? "heroCarouselDot active" : "heroCarouselDot"}
          />
        ))}
      </div>
    </div>
  );
}
