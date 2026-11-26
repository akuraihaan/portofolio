"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SPRINGS, VIEWPORT_ONCE } from "../motion/MotionSystem";

interface InfoCardProps {
  children: React.ReactNode;
  className?: string;
  /** Desktop rotation angle in degrees (default -8deg per DESIGN.md) */
  rotate?: number;
  /** Mobile rotation angle in degrees (default -2.5deg per DESIGN.md) */
  mobileRotate?: number;
  /** Render binder-hole cutouts along top edge */
  binderHoles?: boolean;
  delay?: number;
}

/**
 * InfoCard — Flat orange (#F05A28) identity / statement card.
 * Zero shadows, zero gradients. Depth achieved via rotation and overlap.
 */
export function InfoCard({
  children,
  className = "",
  rotate = -8,
  mobileRotate = -2.5,
  binderHoles = true,
  delay = 0,
}: InfoCardProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={
        prefersReduced
          ? { opacity: 0 }
          : { opacity: 0, y: 28, rotate: rotate - 4, scale: 0.96 }
      }
      whileInView={
        prefersReduced
          ? { opacity: 1 }
          : { opacity: 1, y: 0, rotate: 0, scale: 1 }
      }
      viewport={VIEWPORT_ONCE}
      transition={{ ...SPRINGS.fluid, delay }}
      style={
        {
          "--card-rotate": `${rotate}deg`,
          "--card-mobile-rotate": `${mobileRotate}deg`,
        } as React.CSSProperties
      }
      className={`relative bg-[#F05A28] text-[#FAF8F5] rounded-[0.75rem] p-6 sm:p-8 rotate-[var(--card-mobile-rotate)] lg:rotate-[var(--card-rotate)] transition-transform duration-300 ${className}`}
    >
      {binderHoles && (
        <div
          aria-hidden="true"
          className="flex items-center justify-between gap-3 mb-5 px-1"
        >
          {[0, 1, 2, 3, 4].map((hole) => (
            <span
              key={hole}
              className="w-2.5 h-2.5 bg-[#FAF8F5] dark:bg-[#1A1917] block"
            />
          ))}
        </div>
      )}
      {children}
    </motion.div>
  );
}
