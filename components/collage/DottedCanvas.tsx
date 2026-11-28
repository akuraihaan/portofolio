"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";

interface DottedCanvasProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * DottedCanvas — Warm off-white (#FAF8F5) / warm charcoal (#1A1917)
 * canvas with subtle 1rem (16px) dot grid texture and a lightweight
 * pointer-following warm glow on desktop (zero React re-renders).
 */
export function DottedCanvas({ children, className = "" }: DottedCanvasProps) {
  const prefersReduced = useReducedMotion();
  const [isFinePointer, setIsFinePointer] = useState(false);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const smoothX = useSpring(mouseX, { stiffness: 180, damping: 28, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 180, damping: 28, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setIsFinePointer(fine);
    if (!fine || prefersReduced) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY, prefersReduced]);

  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${smoothX}px ${smoothY}px, rgba(240, 90, 40, 0.08), transparent 75%)`;

  return (
    <div
      className={`dotted-canvas relative min-h-screen text-[#000000] dark:text-[#FAF8F5] transition-colors duration-500 ${className}`}
    >
      {isFinePointer && !prefersReduced && (
        <motion.div
          aria-hidden="true"
          style={{ background: spotlight }}
          className="pointer-events-none fixed inset-0 z-0"
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
