"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASINGS } from "./MotionSystem";

interface PreloaderProps {
  onComplete?: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const prefersReduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // If user prefers reduced motion or already viewed preloader in this session, skip immediately
    const hasLoaded = sessionStorage.getItem("bworiey-preloader-shown");
    if (prefersReduced || hasLoaded) {
      setIsFinished(true);
      onComplete?.();
      return;
    }

    // Progress counter simulation that smoothly speeds up to 100%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            sessionStorage.setItem("bworiey-preloader-shown", "true");
            onComplete?.();
          }, 450);
          return 100;
        }
        const diff = 100 - prev;
        const inc = Math.max(1, Math.floor(Math.random() * (diff / 3) + 3));
        return Math.min(100, prev + inc);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [prefersReduced, onComplete]);

  if (!isMounted || isFinished) {
    return null;
  }

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="preloader"
          initial={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          exit={{
            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
            transition: { duration: 0.9, ease: EASINGS.cinematic },
          }}
          className="fixed inset-0 z-[10000] bg-[#111310] text-[#F4F3EE] flex flex-col justify-between p-6 sm:p-12 select-none"
        >
          {/* Top Metadata */}
          <div className="flex items-center justify-between font-mono text-[11px] text-[#A1A49A] tracking-widest uppercase">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#C8F169] animate-pulse"></span>
              <span>BWORIEY® STUDIO</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden sm:block"
            >
              LAT -3.3167 / LON 114.5900 · INDONESIA
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              RELEASE // 2026.1
            </motion.div>
          </div>

          {/* Center Brand Wordmark with Mask Reveal */}
          <div className="my-auto text-center overflow-hidden py-4">
            <motion.div
              initial={{ y: "120%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.8, ease: EASINGS.editorial, delay: 0.2 }}
            >
              <h1 className="font-display font-black tracking-tighter text-6xl sm:text-8xl md:text-9xl text-[#F4F3EE]">
                BWORIEY
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-mono text-xs sm:text-sm tracking-widest uppercase text-[#A1A49A] mt-3"
            >
              TAUFIK RAIHANDANI · COMPUTER EDUCATION & CREATIVE ENGINEERING
            </motion.p>
          </div>

          {/* Bottom Progress & Counter */}
          <div className="flex flex-col gap-3 font-mono">
            <div className="flex items-end justify-between text-xs sm:text-sm">
              <span className="text-[#A1A49A] uppercase tracking-wider text-[11px]">
                INITIALIZING ARTIFACTS & EXPERIENCES
              </span>
              <span className="font-bold text-[#C8F169] text-base sm:text-xl">
                {String(progress).padStart(2, "0")}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-[#1C1F1A] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#C8F169]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

