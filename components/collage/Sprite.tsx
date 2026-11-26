"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SPRINGS, VIEWPORT_ONCE } from "../motion/MotionSystem";

export type SpriteKind =
  | "flower"
  | "smile"
  | "star"
  | "spark"
  | "bug"
  | "leaf"
  | "ascii-cat"
  | "ascii-wave";

interface SpriteProps {
  kind?: SpriteKind;
  color?: "green" | "pink" | "orange" | "blue" | "ink";
  size?: "sm" | "md" | "lg";
  className?: string;
  delay?: number;
  float?: boolean;
}

const COLOR_MAP = {
  green: "text-[#8BA314] dark:text-[#C4D94E]",
  pink: "text-[#D946EF] dark:text-[#FF8AD8]",
  orange: "text-[#F05A28]",
  blue: "text-[#3B82F6] dark:text-[#A8D0F0]",
  ink: "text-[#000000]/60 dark:text-[#FAF8F5]/60",
};

const SIZE_MAP = {
  sm: "text-[11px]",
  md: "text-sm",
  lg: "text-base",
};

function renderSpriteArt(kind: SpriteKind) {
  switch (kind) {
    case "flower":
      return "✿";
    case "smile":
      return "(•‿•)";
    case "star":
      return "✦";
    case "spark":
      return "✳";
    case "bug":
      return "ᗢ";
    case "leaf":
      return "❦";
    case "ascii-cat":
      return "(=^･ω･^=)";
    case "ascii-wave":
      return "~≈~";
    default:
      return "✦";
  }
}

/**
 * Sprite — Hand-crafted ASCII / glyph figure for negative space texture.
 * Sparse in light mode, dense glowing pink & green in dark digital garden mode.
 */
export function Sprite({
  kind = "star",
  color = "green",
  size = "sm",
  className = "",
  delay = 0,
  float = false,
}: SpriteProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.span
      aria-hidden="true"
      initial={prefersReduced ? { opacity: 0.8 } : { opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT_ONCE}
      animate={
        float && !prefersReduced
          ? { y: [0, -4, 0] }
          : undefined
      }
      transition={
        float && !prefersReduced
          ? { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay }
          : { ...SPRINGS.bouncy, delay }
      }
      className={`inline-block font-mono select-none leading-none pointer-events-none ${COLOR_MAP[color]} ${SIZE_MAP[size]} ${className}`}
    >
      {renderSpriteArt(kind)}
    </motion.span>
  );
}
