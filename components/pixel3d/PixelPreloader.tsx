"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { VoxelCube3D } from "./VoxelCube3D";
import { Terminal, ArrowRight, ShieldCheck, Cpu } from "lucide-react";

interface PixelPreloaderProps {
  onComplete?: () => void;
}

export function PixelPreloader({ onComplete }: PixelPreloaderProps) {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState<"cube" | "assembly" | "ready" | "exit">("cube");
  const [progress, setProgress] = useState(15);
  const [assetStatus, setAssetStatus] = useState("INITIALIZING VOXEL RUNTIME...");
  const [isFinished, setIsFinished] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Skip if already shown in this session or reduced motion
    const hasSeen = sessionStorage.getItem("bworiey_pixel_preloader_seen");
    if (hasSeen || prefersReduced) {
      setIsFinished(true);
      onComplete?.();
      return;
    }

    // Step 1: Real asset readiness monitoring
    let progressTimer: NodeJS.Timeout;
    const startTime = Date.now();

    const checkReadiness = async () => {
      // Check font readiness
      if (document.fonts) {
        setAssetStatus("LOADING TYPOGRAPHY & VOXEL DATA...");
        await document.fonts.ready;
        setProgress(45);
      }

      // Check document readiness
      if (document.readyState !== "complete") {
        setAssetStatus("SYNCHRONIZING DIGITAL ENVIRONMENT...");
        await new Promise((resolve) => {
          window.addEventListener("load", resolve, { once: true });
        });
      }
      setProgress(80);

      // Phase 2: Assembly after 800ms
      setTimeout(() => {
        setPhase("assembly");
        setAssetStatus("ASSEMBLING BWORIEY WORLD...");
        setProgress(95);
      }, 700);

      // Phase 3: Ready after 1600ms total
      setTimeout(() => {
        setPhase("ready");
        setAssetStatus("SYSTEM READY // ENTERING WORLD");
        setProgress(100);

        // Phase 4: Zoom / Pixel dissolve transition exit
        setTimeout(() => {
          setPhase("exit");
          setTimeout(() => {
            sessionStorage.setItem("bworiey_pixel_preloader_seen", "true");
            setIsFinished(true);
            onComplete?.();
          }, 800);
        }, 600);
      }, 1800);
    };

    checkReadiness();

    // Smooth counter tick
    progressTimer = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 3 : prev));
    }, 50);

    // Keyboard shortcut ESC to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(progressTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [prefersReduced, onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem("bworiey_pixel_preloader_seen", "true");
    setIsFinished(true);
    onComplete?.();
  };

  if (!isMounted || isFinished) return null;

  const bworieyLetters = ["B", "W", "O", "R", "I", "E", "Y"];

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="pixel-preloader"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 1.15,
            filter: "blur(8px)",
            transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[99999] bg-[#0E1013] text-[#F4F3EE] flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none cursor-default"
        >
          {/* Subtle isometric grid inside preloader */}
          <div className="absolute inset-0 pixel-grid opacity-25 pointer-events-none" />
          <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

          {/* Top HUD Header */}
          <div className="relative z-10 flex items-center justify-between font-mono text-[11px] text-[#A1A49A]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#C8F169] animate-pulse rounded-none" />
              <span className="font-pixel text-[9px] text-[#C8F169] tracking-widest">
                SYS.INIT // BWORIEY
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-[10px]">
              <span>NODE: 2026.PROD</span>
              <span>·</span>
              <span>GEO: BANJARMASIN</span>
            </div>

            {/* Skip Button */}
            <button
              onClick={handleSkip}
              className="px-3 py-1 bg-[#1C1F1A] border border-[#C8F169]/50 hover:bg-[#C8F169] hover:text-[#0E1013] font-pixel text-[8px] text-[#C8F169] transition-colors rounded-none flex items-center gap-1.5"
            >
              <span>[ESC / SKIP]</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Center Stage: Pixel 3D Voxel Forming + Typography Assembly */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
            {/* 3D Voxel Cube forming in space */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{
                scale: phase === "exit" ? 2.5 : 1,
                rotate: 0,
                y: [0, -8, 0],
              }}
              transition={{
                scale: { duration: 0.6, ease: "easeOut" },
                y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
              }}
              className="mb-8"
            >
              <VoxelCube3D size={56} color="#C8F169" />
            </motion.div>

            {/* Typography Assembly: BWORIEY revealed letter by letter with voxel block tags */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 my-2">
              {bworieyLetters.map((char, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.5 }}
                  animate={{
                    opacity: phase !== "cube" ? 1 : 0,
                    y: phase !== "cube" ? 0 : 30,
                    scale: phase !== "cube" ? 1 : 0.5,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: 0.15 + index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative group"
                >
                  <span className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#F4F3EE] drop-shadow-[0_4px_0_#171816]">
                    {char}
                  </span>
                  {/* Subtle pixel notch accent under each letter */}
                  <span className="block w-full h-1 bg-[#C8F169] mt-1 opacity-80" />
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: phase !== "cube" ? 1 : 0 }}
              transition={{ delay: 0.7 }}
              className="font-mono text-xs sm:text-sm tracking-widest text-[#A1A49A] uppercase mt-4 max-w-md"
            >
              TAUFIK RAIHANDANI · PIXEL 3D DIGITAL WORLD
            </motion.p>
          </div>

          {/* Bottom HUD: Real Progress + Status Terminal */}
          <div className="relative z-10 max-w-xl mx-auto w-full font-mono text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-[#A1A49A] flex items-center gap-1.5 font-pixel">
                <Terminal className="w-3 h-3 text-[#C8F169]" />
                <span>{assetStatus}</span>
              </span>
              <span className="font-pixel text-[10px] text-[#C8F169]">
                {Math.min(100, Math.floor(progress))}%
              </span>
            </div>

            {/* Pixel Stepped Progress Bar */}
            <div className="w-full h-3 bg-[#1C1F1A] border border-[#C8F169]/40 p-0.5">
              <motion.div
                className="h-full bg-[#C8F169]"
                animate={{ width: `${Math.min(100, progress)}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

