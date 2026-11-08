"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface BrandPreloaderProps {
  onComplete?: () => void;
}

const LETTERS = ["B", "W", "O", "R", "I", "E", "Y"];

export function BrandPreloader({ onComplete }: BrandPreloaderProps) {
  const prefersReduced = useReducedMotion();
  const [stage, setStage] = useState<"initial" | "assembly" | "bumper" | "exit">("initial");
  const [isFinished, setIsFinished] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // If user has already seen bumper in this session, skip immediately
    const hasSeen = sessionStorage.getItem("bworiey_brand_bumper_seen");
    if (hasSeen) {
      setIsFinished(true);
      onComplete?.();
      return;
    }

    // Lock body scrolling while bumper is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // If user prefers reduced motion, show a quick elegant fade (1.2s total)
    if (prefersReduced) {
      const reducedTimer = setTimeout(() => {
        sessionStorage.setItem("bworiey_brand_bumper_seen", "true");
        document.body.style.overflow = originalOverflow;
        setIsFinished(true);
        onComplete?.();
      }, 1200);
      return () => {
        clearTimeout(reducedTimer);
        document.body.style.overflow = originalOverflow;
      };
    }

    // Stage 1: Initial dot appearance (0ms)
    // Stage 2: Logo assembly starts at 350ms
    const timerAssembly = setTimeout(() => {
      setStage("assembly");
    }, 350);

    // Stage 3: Brand bumper with line & subtext at 1100ms
    const timerBumper = setTimeout(() => {
      setStage("bumper");
    }, 1100);

    // Stage 4: Exit transition at 2100ms
    const timerExit = setTimeout(async () => {
      // Ensure fonts and DOM are ready before exiting
      if (document.fonts) {
        await document.fonts.ready;
      }
      setStage("exit");

      // Complete exit after curtain transition finishes
      setTimeout(() => {
        sessionStorage.setItem("bworiey_brand_bumper_seen", "true");
        document.body.style.overflow = originalOverflow;
        setIsFinished(true);
        onComplete?.();
      }, 700);
    }, 2100);

    return () => {
      clearTimeout(timerAssembly);
      clearTimeout(timerBumper);
      clearTimeout(timerExit);
      document.body.style.overflow = originalOverflow;
    };
  }, [prefersReduced, onComplete]);

  if (!isMounted || isFinished) return null;

  // Staggered variants for letter assembly
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 18,
      scale: 0.92,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="brand-bumper-overlay"
          initial={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 }}
          animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 }}
          exit={{
            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
            transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] as const },
          }}
          className="fixed inset-0 z-[99999] bg-[#0E1013] text-[#F4F3EE] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
          style={{ willChange: "clip-path, opacity" }}
        >
          {/* Subtle Ambient Background Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(200, 241, 105, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(200, 241, 105, 0.08) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Center Stage: Brand Logo Assembly */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            {/* Stage 1: Initial Origin Pixel Dot */}
            <AnimatePresence>
              {stage === "initial" && (
                <motion.div
                  key="origin-dot"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-3 h-3 bg-[#C8F169] rounded-none shadow-[0_0_12px_#C8F169]"
                />
              )}
            </AnimatePresence>

            {/* Stage 2 & 3: BWORIEY Letters with Stagger Animation */}
            {stage !== "initial" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center justify-center tracking-tight"
              >
                {LETTERS.map((char, index) => (
                  <motion.span
                    key={`${char}-${index}`}
                    variants={letterVariants}
                    className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-[#F4F3EE] inline-block"
                    style={{
                      textShadow:
                        stage === "bumper"
                          ? "0 4px 20px rgba(200, 241, 105, 0.15)"
                          : "none",
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            )}

            {/* Stage 3: Accent Line & Subtext */}
            <AnimatePresence>
              {(stage === "bumper" || stage === "exit") && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
                  className="flex flex-col items-center mt-3 sm:mt-5"
                >
                  {/* Expanding Thin Accent Line */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                    className="h-[2px] bg-[#C8F169] max-w-[200px] sm:max-w-[260px] w-full mb-3 opacity-90"
                  />

                  {/* Clean Digital Subtitle */}
                  <span
                    className="font-mono text-[9px] sm:text-[11px] font-bold text-[#A1A49A] uppercase tracking-[0.3em] pl-[0.3em]"
                  >
                    PORTFOLIO / DEVELOPER
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
