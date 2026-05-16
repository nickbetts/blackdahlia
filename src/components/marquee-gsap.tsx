"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface MarqueeGsapProps {
  items: string[];
  separator?: string;
  speed?: number; // pixels per second, default 80
}

export function MarqueeGsap({ items, separator = "✦", speed = 80 }: MarqueeGsapProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Measure single-set width after mount
    const firstSet = track.querySelector("[data-set='0']") as HTMLElement | null;
    if (!firstSet) return;

    const setWidth = firstSet.offsetWidth;
    const duration = setWidth / speed;

    const tween = gsap.fromTo(
      track,
      { x: 0 },
      {
        x: -setWidth,
        duration,
        ease: "none",
        repeat: -1,
      }
    );

    return () => {
      tween.kill();
    };
  }, [speed]);

  // Three copies so we always have content visible on wide screens
  const sets = [0, 1, 2];

  return (
    <div className="marqueeGsapOuter" aria-hidden="true">
      <div className="marqueeGsapTrack" ref={trackRef}>
        {sets.map((setIndex) => (
          <span key={setIndex} className="marqueeGsapSet" data-set={setIndex}>
            {items.map((item, i) => (
              <span key={i} className="marqueeItem">
                <span>{item}</span>
                <span className="marqueeDot">{separator}</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
