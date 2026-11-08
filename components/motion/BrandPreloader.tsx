"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASINGS } from "./MotionSystem";

interface BrandPreloaderProps {
  onComplete?: () => void;
}

const LETTERS = ["B", "W", "O", "R", "I", "E", "Y"];

export function BrandPreloader({ onComplete }: BrandPreloaderProps) {
  const prefersReduced = useReducedMotion();
  const [stage, setStage] = useState<"appearance" | "assembly" | "presentation" | "exit">("appearance");
  const [isFinished, setIsFinished] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Run only once per browser session
    try {
      const hasSeen = sessionStorage.getItem("bworiey_apple_bumper_seen");
      if (hasSeen) {
        setIsFinished(true);
        onComplete?.();
        return;
      }
    } catch {
      // Fallback if sessionStorage is blocked
    }

    // If user prefers reduced motion, exit immediately
    if (prefersReduced) {
      try {
        sessionStorage.setItem("bworiey_apple_bumper_seen", "true");
      } catch {}
      setIsFinished(true);
      onComplete?.();
      return;
    }

    // Prevent background scrolling while bumper is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Stage 1 -> Stage 2: Logo assembly begins at 350ms
    const timerAssembly = setTimeout(() => {
      setStage("assembly");
    }, 350);

    // Stage 2 -> Stage 3: Brand presentation (horizontal line & subtext) at 1100ms
    const timerPresentation = setTimeout(() => {
      setStage("presentation");
    }, 1100);

    // Stage 3 -> Stage 4: Exit transition begins at 1950ms
    const timerExit = setTimeout(() => {
      setStage("exit");

      // Complete exit after curtain transition finishes (~2400ms total)
      setTimeout(() => {
        try {
          sessionStorage.setItem("bworiey_apple_bumper_seen", "true");
        } catch {}
        document.body.style.overflow = originalOverflow;
        setIsFinished(true);
        onComplete?.();
      }, 550);
    }, 1950);

    return () => {
      clearTimeout(timerAssembly);
      clearTimeout(timerPresentation);
      clearTimeout(timerExit);
      document.body.style.overflow = originalOverflow;
    };
  }, [prefersReduced, onComplete]);

  if (!isMounted || isFinished) return null;

  // Stagger variants for Stage 2 Logo Assembly
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 14,
      scale: 0.95,
      filter: "blur(2px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.45,
        ease: EASINGS.apple,
      },
    },
  };

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="apple-brand-bumper"
          initial={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 }}
          animate={
            stage === "exit"
              ? {
                  clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
                  opacity: 0,
                  transition: { duration: 0.55, ease: EASINGS.editorial },
                }
              : {
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                  opacity: 1,
                }
          }
          className={`fixed inset-0 z-[99999] bg-[#000000] text-[#F5F5F7] flex flex-col items-center justify-center p-6 select-none overflow-hidden ${
            stage === "exit" ? "pointer-events-none" : ""
          }`}
          style={{ willChange: "clip-path, opacity" }}
          role="status"
          aria-label="BWORIEY Brand Introduction"
        >
          {/* Subtle Ambient Vignette */}
          <div className="absolute inset-0 bg-radial from-white/[0.04] to-transparent pointer-events-none" />

          {/* Center Brand Assembly */}
          <div
            className={`relative z-10 flex flex-col items-center justify-center text-center transition-transform duration-500 ease-out ${
              stage === "exit" ? "-translate-y-4" : "translate-y-0"
            }`}
          >
            {/* Stage 1: Central Origin Pixel */}
            <AnimatePresence>
              {stage === "appearance" && (
                <motion.div
                  key="origin-pixel"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-2.5 h-2.5 bg-white rounded-sm shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                />
              )}
            </AnimatePresence>

            {/* Stage 2 & 3: BWORIEY Letters with Stagger Animation */}
            {stage !== "appearance" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`flex items-center justify-center tracking-tight leading-none whitespace-nowrap transition-transform duration-500 ${
                  stage === "presentation" ? "scale-[1.02]" : "scale-100"
                }`}
              >
                {LETTERS.map((char, index) => (
                  <motion.span
                    key={`${char}-${index}`}
                    variants={letterVariants}
                    className="font-display font-black text-[clamp(2.75rem,8vw,6.5rem)] tracking-tight text-[#F5F5F7] inline-block leading-none"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            )}

            {/* Stage 3: Thin Refined Horizontal Divider Line */}
            {stage === "presentation" && (
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease: EASINGS.apple }}
                className="h-[1px] bg-white/40 w-44 sm:w-56 my-3.5 origin-center"
              />
            )}

            {/* Stage 3: Subtitle `PORTFOLIO / DEVELOPER` */}
            {stage === "presentation" && (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1, ease: EASINGS.apple }}
                className="font-mono text-[9px] sm:text-[10px] font-medium text-[#86868B] uppercase tracking-[0.28em] pl-[0.28em]"
              >
                PORTFOLIO / DEVELOPER
              </motion.span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
