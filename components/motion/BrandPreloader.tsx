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

    // If already seen in this session, skip immediately
    try {
      const hasSeen = sessionStorage.getItem("bworiey_brand_bumper_seen");
      if (hasSeen) {
        setIsFinished(true);
        onComplete?.();
        return;
      }
    } catch {
      // sessionStorage might fail in strict private mode
    }

    // Lock body scrolling temporarily
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (prefersReduced) {
      const reducedTimer = setTimeout(() => {
        try {
          sessionStorage.setItem("bworiey_brand_bumper_seen", "true");
        } catch {}
        document.body.style.overflow = originalOverflow;
        setIsFinished(true);
        onComplete?.();
      }, 600);
      return () => {
        clearTimeout(reducedTimer);
        document.body.style.overflow = originalOverflow;
      };
    }

    // Stage 1 -> Stage 2: Logo assembly starts at 180ms
    const timerAssembly = setTimeout(() => {
      setStage("assembly");
    }, 180);

    // Stage 2 -> Stage 3: Accent line & subtitle at 550ms
    const timerBumper = setTimeout(() => {
      setStage("bumper");
    }, 550);

    // Stage 3 -> Stage 4: Trigger exit curtain at 1150ms (never hang on external assets)
    const timerExit = setTimeout(() => {
      setStage("exit");

      // Mark complete once curtain has animated away
      setTimeout(() => {
        try {
          sessionStorage.setItem("bworiey_brand_bumper_seen", "true");
        } catch {}
        document.body.style.overflow = originalOverflow;
        setIsFinished(true);
        onComplete?.();
      }, 450);
    }, 1150);

    return () => {
      clearTimeout(timerAssembly);
      clearTimeout(timerBumper);
      clearTimeout(timerExit);
      document.body.style.overflow = originalOverflow;
    };
  }, [prefersReduced, onComplete]);

  if (!isMounted || isFinished) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.02,
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
        type: "spring" as const,
        damping: 18,
        stiffness: 260,
      },
    },
  };

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="brand-bumper-overlay"
          initial={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 }}
          animate={
            stage === "exit"
              ? {
                  clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
                  opacity: 0,
                  transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] as const },
                }
              : {
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                  opacity: 1,
                }
          }
          className={`fixed inset-0 z-[99999] bg-[#0E1013] text-[#F4F3EE] flex flex-col items-center justify-center p-6 select-none overflow-hidden ${
            stage === "exit" ? "pointer-events-none" : ""
          }`}
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
          <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-full">
            {/* Stage 1: Initial Origin Pixel Dot */}
            <AnimatePresence>
              {stage === "initial" && (
                <motion.div
                  key="origin-dot"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="w-3.5 h-3.5 bg-[#C8F169] rounded-none shadow-[0_0_16px_#C8F169]"
                />
              )}
            </AnimatePresence>

            {/* Stage 2 & 3: BWORIEY Letters with Stagger Animation */}
            {stage !== "initial" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center justify-center tracking-tight leading-none whitespace-nowrap"
              >
                {LETTERS.map((char, index) => (
                  <motion.span
                    key={`${char}-${index}`}
                    variants={letterVariants}
                    className="font-display font-black text-[clamp(2.75rem,8.5vw,7.5rem)] tracking-tight text-[#F4F3EE] inline-block leading-none"
                    style={{
                      textShadow:
                        stage === "bumper"
                          ? "0 4px 24px rgba(200, 241, 105, 0.22)"
                          : "none",
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            )}

            {/* Stage 3: Expanding Accent Divider Line */}
            {stage === "bumper" && (
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                className="h-[2px] bg-[#C8F169] w-48 sm:w-64 max-w-full my-3.5 sm:my-4 origin-center shadow-[0_0_10px_rgba(200,241,105,0.6)]"
              />
            )}

            {/* Stage 3: Monospace Subtitle */}
            {stage === "bumper" && (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                className="font-mono text-[9px] sm:text-[11px] font-bold text-[#A1A49A] uppercase tracking-[0.3em] pl-[0.3em]"
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
