"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion, useSpring, useMotionValue } from "framer-motion";

interface CardTilt3DProps {
  children: React.ReactNode;
  className?: string;
  tiltMax?: number;
  scaleHover?: number;
}

export function CardTilt3D({
  children,
  className = "",
  tiltMax = 8,
  scaleHover = 1.02,
}: CardTilt3DProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();

  const [isHovered, setIsHovered] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  const rotateX = useSpring(0, { stiffness: 400, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 400, damping: 25 });
  const scale = useSpring(1, { stiffness: 400, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / rect.width - 0.5) * 2;
    const yPct = (y / rect.height - 0.5) * 2;

    rotateX.set(-yPct * tiltMax);
    rotateY.set(xPct * tiltMax);

    setSpotlight({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    if (prefersReduced) return;
    setIsHovered(true);
    scale.set(scaleHover);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
        className={`relative h-full transition-shadow duration-200 ${className}`}
      >
        {children}

        {/* Dynamic Light Spotlight Gradient */}
        {isHovered && !prefersReduced && (
          <div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 opacity-25 dark:opacity-20 mix-blend-overlay"
            style={{
              background: `radial-gradient(circle 320px at ${spotlight.x}% ${spotlight.y}%, rgba(255,229,0,0.8), transparent 70%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
