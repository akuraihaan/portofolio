"use client";

/**
 * BrandPreloader — Cinematic BWORIEY intro sequence.
 *
 * Sequence:
 * 1. Black canvas fills viewport
 * 2. BWORIEY wordmark: character-by-character reveal
 * 3. Progress percentage + lime line run to 100%
 * 4. Brief pause at "presentation" state
 * 5. Clip-path curtain rises revealing the page below
 * 6. AnimatePresence unmounts
 *
 * Respects prefers-reduced-motion & session-caches for repeat visits.
 */
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASINGS } from "./MotionSystem";

const SESSION_KEY = "bworiey_preloader_v3";
const BRAND_CHARS = ["b", "w", "o", "r", "i", "e", "y"];

type Stage = "entering" | "counting" | "presentation" | "exit" | "done";

interface BrandPreloaderProps {
  onComplete?: () => void;
}

export function BrandPreloader({ onComplete }: BrandPreloaderProps) {
  const prefersReduced = useReducedMotion();
  const [isFinished, setIsFinished] = useState(false);
  const [stage, setStage] = useState<Stage>("entering");
  const [progress, setProgress] = useState(0);

  const finish = useCallback(() => {
    document.body.style.overflow = "";
    setIsFinished(true);
    onComplete?.();
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
  }, [onComplete]);

  useEffect(() => {
    // Skip for repeat visits
    try {
      if (sessionStorage.getItem(SESSION_KEY)) { finish(); return; }
    } catch {}

    document.body.style.overflow = "hidden";

    if (prefersReduced) { finish(); return; }

    // Sequence timings (ms)
    const t1 = setTimeout(() => setStage("counting"), 300);
    // Animate counter from 0 → 100 over ~1.6s
    const start = performance.now();
    const duration = 1600;
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setStage("presentation");
        const t2 = setTimeout(() => setStage("exit"), 900);
        const t3 = setTimeout(() => finish(), 1500);
        return () => { clearTimeout(t2); clearTimeout(t3); };
      }
    };
    // Delay raf start by 300ms (align with stage transition)
    const t1b = setTimeout(() => { raf = requestAnimationFrame(tick); }, 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t1b);
      cancelAnimationFrame(raf);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isFinished) return null;

  return (
    <AnimatePresence>
      {stage !== "done" && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1A1917] select-none"
          initial={{ clipPath: "inset(0 0 0 0)" }}
          animate={
            stage === "exit"
              ? { clipPath: "inset(100% 0 0 0)" }
              : { clipPath: "inset(0 0 0 0)" }
          }
          transition={
            stage === "exit"
              ? { duration: 0.75, ease: EASINGS.expo }
              : { duration: 0 }
          }
        >
          {/* Background decorative line */}
          <motion.div
            className="absolute left-0 right-0 bottom-[44%] h-[1px] bg-[#FAF8F5]/15 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.0, delay: 0.1, ease: EASINGS.editorial }}
          />

          {/* Progress orange line */}
          <motion.div
            className="absolute left-0 bottom-[44%] h-[2px] bg-[#F05A28] origin-left"
            style={{ scaleX: progress / 100 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
          />

          {/* Core wordmark */}
          <div className="relative flex flex-col items-center gap-5">
            {/* Character reveal */}
            <div
              className="flex items-baseline overflow-hidden"
              aria-label="BWORIEY"
            >
              {BRAND_CHARS.map((char, i) => (
                <motion.span
                  key={char + i}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={
                    stage !== "entering"
                      ? { y: "0%", opacity: 1 }
                      : { y: "110%", opacity: 0 }
                  }
                  transition={{
                    duration: 0.72,
                    delay: i * 0.065,
                    ease: EASINGS.organic,
                  }}
                  className="inline-block font-editorial italic font-normal text-[clamp(3.5rem,10vw,8rem)] tracking-tight text-[#FAF8F5] leading-none"
                >
                  {char}
                </motion.span>
              ))}
              {/* Orange accent dot */}
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={stage !== "entering" ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: BRAND_CHARS.length * 0.065 + 0.1, duration: 0.3, ease: EASINGS.elasticOvershoot }}
                className="inline-block w-2.5 h-2.5 rounded-full bg-[#F05A28] ml-1.5 mb-2 self-end"
              />
            </div>

            {/* Separator line */}
            {stage === "presentation" && (
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: EASINGS.editorial }}
                className="h-[1.5px] bg-[#C4D94E] w-56 origin-center"
              />
            )}

            {/* Subtitle + counter row */}
            <div className="flex items-center gap-6 font-mono text-[11px]">
              <motion.span
                initial={{ opacity: 0 }}
                animate={stage === "counting" || stage === "presentation" ? { opacity: 1 } : {}}
                transition={{ duration: 0.3 }}
                className="text-[#FAF8F5]/55 uppercase tracking-[0.25em]"
              >
                {stage === "presentation" ? "bworiey" : "memuat"}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={stage !== "entering" ? { opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-[#C4D94E] font-medium tabular-nums w-10 text-right"
              >
                {progress}%
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
