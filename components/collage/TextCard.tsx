"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SPRINGS, VIEWPORT_ONCE } from "../motion/MotionSystem";

interface TextCardProps {
  children: React.ReactNode;
  className?: string;
  /** Desktop rotation angle in degrees (default +3deg per DESIGN.md) */
  rotate?: number;
  mobileRotate?: number;
  /** Folded paper corner detail */
  foldedCorner?: boolean;
  delay?: number;
}

/**
 * TextCard — Flat peach (#FFD4C2) secondary text box with optional folded corner.
 * Positioned to overlap InfoCard corner for layered collage depth without shadows.
 */
export function TextCard({
  children,
  className = "",
  rotate = 3,
  mobileRotate = 2,
  foldedCorner = true,
  delay = 0.12,
}: TextCardProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={
        prefersReduced
          ? { opacity: 0 }
          : { opacity: 0, y: 24, rotate: rotate + 3, scale: 0.95 }
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
          "--tcard-rotate": `${rotate}deg`,
          "--tcard-mobile-rotate": `${mobileRotate}deg`,
        } as React.CSSProperties
      }
      className={`relative bg-[#FFD4C2] text-[#000000] rounded-[0.75rem] p-6 rotate-[var(--tcard-mobile-rotate)] lg:rotate-[var(--tcard-rotate)] ${className}`}
    >
      {foldedCorner && (
        <span
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, #E8B59F 50%, #FAF8F5 50%)",
          }}
        />
      )}
      {children}
    </motion.div>
  );
}
