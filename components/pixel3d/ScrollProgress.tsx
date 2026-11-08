"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setPercent(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  return (
    <div className="fixed right-4 bottom-6 z-40 hidden md:flex items-center gap-2 bg-[#171816]/90 dark:bg-[#111310]/90 backdrop-blur-md px-3 py-1.5 border border-[#171816] dark:border-[#C8F169]/50 shadow-pixel dark:shadow-pixel-lime font-mono text-[10px] text-[#F4F3EE] select-none">
      <span className="font-pixel text-[8px] text-[#C8F169]">DEPTH:</span>
      <span className="w-9 font-bold text-[#C8F169]">{String(percent).padStart(3, "0")}%</span>
      <div className="w-16 h-2 bg-[#1C1F1A] border border-[#C8F169]/30 p-0.5">
        <motion.div
          className="h-full bg-[#C8F169]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

