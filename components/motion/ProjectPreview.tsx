"use client";

import React, { useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { SPRINGS } from "./MotionSystem";

interface ProjectPreviewProps {
  imageSrc: string | null;
  title: string;
  category?: string;
}

/**
 * ProjectPreview — Pointer-following floating sharp preview card on desktop.
 * Uses MotionValues for 60fps cursor tracking without React re-renders.
 */
export function ProjectPreview({ imageSrc, title, category }: ProjectPreviewProps) {
  const prefersReduced = useReducedMotion();
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const smoothX = useSpring(x, SPRINGS.follower);
  const smoothY = useSpring(y, SPRINGS.follower);

  useEffect(() => {
    if (prefersReduced) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX + 24);
      y.set(e.clientY - 90);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <AnimatePresence>
      {imageSrc && (
        <motion.div
          aria-hidden="true"
          style={{ x: smoothX, y: smoothY }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed top-0 left-0 z-50 hidden xl:block w-64 bg-[#1A1917] border border-[#F05A28] p-2"
        >
          <div className="aspect-[16/10] w-full overflow-hidden bg-[#1A1917]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="pt-2 flex items-center justify-between gap-2 font-mono text-[10px] text-[#FAF8F5]">
            <span className="truncate">{title}</span>
            {category && <span className="text-[#C4D94E] shrink-0">{category}</span>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
