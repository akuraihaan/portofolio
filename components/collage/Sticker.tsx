"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SPRINGS, VIEWPORT_ONCE } from "../motion/MotionSystem";
import { useMotionContext } from "../motion/MotionProvider";

export type StickerTone = "blue" | "green" | "orange" | "peach";

interface StickerProps {
  children: React.ReactNode;
  tone?: StickerTone;
  rotate?: number;
  className?: string;
  draggable?: boolean;
  delay?: number;
  label?: string;
}

const TONE_CLASSES: Record<StickerTone, string> = {
  blue: "bg-[#A8D0F0] text-[#000000]",
  green: "bg-[#C4D94E] text-[#000000]",
  orange: "bg-[#F05A28] text-[#FAF8F5]",
  peach: "bg-[#FFD4C2] text-[#000000]",
};

/**
 * Sticker — Playful, flat square/rectangular sticker with spring pop-in,
 * optional drag-and-snap-back physics, and hover rotation.
 */
export function Sticker({
  children,
  tone = "blue",
  rotate = -6,
  className = "",
  draggable = true,
  delay = 0.15,
  label,
}: StickerProps) {
  const prefersReduced = useReducedMotion();
  const { setCursor, resetCursor } = useMotionContext();

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.7, rotate: rotate - 10 }}
      whileInView={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1, rotate }}
      viewport={VIEWPORT_ONCE}
      transition={{ ...SPRINGS.bouncy, delay }}
      whileHover={prefersReduced ? {} : { scale: 1.08, rotate: rotate + 6 }}
      whileTap={prefersReduced ? {} : { scale: 0.94 }}
      drag={draggable && !prefersReduced}
      dragSnapToOrigin
      dragElastic={0.35}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
      onMouseEnter={() =>
        draggable
          ? setCursor({ active: true, text: "DRAG", variant: "drag" })
          : setCursor({ active: true, variant: "hover" })
      }
      onMouseLeave={resetCursor}
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-[0.5rem] select-none ${
        draggable ? "cursor-grab active:cursor-grabbing" : ""
      } ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </motion.div>
  );
}
