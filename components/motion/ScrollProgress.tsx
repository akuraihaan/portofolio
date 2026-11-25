"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

interface ScrollProgressProps {
  color?: string;
  showPercentage?: boolean;
}

export function ScrollProgress({
  color = "#2563EB",
  showPercentage = false,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const prefersReduced = useReducedMotion();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 30,
    restDelta: 0.001,
  });

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setPercentage(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  if (prefersReduced) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
      <div className="w-full h-[2px] bg-black/[0.04] dark:bg-white/[0.06] overflow-hidden">
        <motion.div
          style={{ scaleX, backgroundColor: color }}
          className="h-full origin-left"
        />
      </div>

      {showPercentage && (
        <div className="hidden lg:flex fixed top-4 right-8 z-[60] items-center gap-1.5 font-mono text-[10px] font-medium bg-white/85 dark:bg-[#121214]/85 text-[#121214] dark:text-[#F4F4F6] px-2.5 py-1 rounded-full border border-black/10 dark:border-white/10 backdrop-blur-md shadow-sm">
          <span className="text-[#71717A]">PROGRES:</span>
          <span className="font-semibold">{percentage}%</span>
        </div>
      )}
    </div>
  );
}
