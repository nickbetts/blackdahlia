"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

export type TrustPoint = {
  icon: React.ReactNode;
  title: string;
  body: string;
};

export function TrustCards({ points }: { points: TrustPoint[] }) {
  return (
    <div className="revealGrid">
      {points.map((point, i) => (
        <RevealCard key={i} point={point} />
      ))}
    </div>
  );
}

function RevealCard({ point }: { point: TrustPoint }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="revealCard"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 rounded-[inherit]"
          >
            <CanvasRevealEffect
              animationSpeed={3}
              colors={[[201, 162, 107]]}
              opacities={[0.05, 0.05, 0.07, 0.1, 0.12, 0.15, 0.18, 0.22, 0.27, 0.35]}
              dotSize={3}
              showGradient={false}
              containerClassName="bg-[#0d0b09] rounded-[inherit] h-full w-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="revealCardInner">
        <div className="revealCardIcon">{point.icon}</div>
        <div>
          <h3 className="revealCardTitle">{point.title}</h3>
          <p className="revealCardBody">{point.body}</p>
        </div>
      </div>
    </div>
  );
}
