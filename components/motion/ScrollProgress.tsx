"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

interface ScrollProgressProps {
  color?: string;
  showPercentage?: boolean;
}

export function ScrollProgress({
  color = "#FFE500",
  showPercentage = true,
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
      <div className="w-full h-1.5 md:h-2 bg-black/10 dark:bg-white/10 overflow-hidden">
        <motion.div
          style={{ scaleX, backgroundColor: color }}
          className="h-full origin-left border-b-2 border-black dark:border-white shadow-[0_2px_0px_#FF5C00]"
        />
      </div>

      {showPercentage && (
        <div className="hidden lg:flex fixed top-4 right-8 z-[60] items-center gap-1.5 font-mono text-[10px] font-black bg-[#FFE500] text-black px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000]">
          <span>SCROLL:</span>
          <span className="w-8 text-right">{percentage}%</span>
        </div>
      )}
    </div>
  );
}
